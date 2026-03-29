import { DraggableProvided } from "@hello-pangea/dnd";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { navigate } from "wouter/use-browser-location";

import { Api } from "@m/base/api/Api";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CDropdown } from "@m/core/components/CDropdown";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CWidgetCard } from "../components/CWidgetCard";
import { CWidgetEnergyPolicy } from "../components/CWidgetEnergyPolicy";
import { CWidgetEnergyResourcePieChart } from "../components/CWidgetEnergyResourcePieChart";
import { CWidgetForm } from "../components/CWidgetForm";
import { CWidgetGraphDataView } from "../components/CWidgetGraphDataView";
import { CWidgetGraphRegression } from "../components/CWidgetGraphRegression";
import { CWidgetGraphSeuValue } from "../components/CWidgetGraphSeuValue";
import { CWidgetGraphMetricValue } from "../components/CWidgetMetricValue";
import { CWidgetSeuPieChart } from "../components/CWidgetSeuPieChart";
import {
  IDtoWidgetConfig,
  IDtoWidgetResponse,
} from "../interfaces/IDtoDashboard";

export function CWidgetEditForm({
  widget,
  onUpdate,
  onDelete,
  provided,
}: {
  widget: IDtoWidgetResponse;
  onUpdate: () => void;
  onDelete: () => void;
  provided?: DraggableProvided;
}) {
  const { t } = useTranslation();

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const [isEditing, setIsEditing] = useState(false);

  const [customTitle, setCustomTitle] = useState<string | null>(null);

  const title = useMemo(() => {
    if (customTitle !== null) {
      return customTitle;
    }

    switch (widget.config.type) {
      case "GRAPH_SEU_VALUE":
        return t("seuValues");
      case "GRAPH_DATA_VIEW_VALUE":
        return "";
      case "GRAPH_ADVANCED_REGRESSION_RESULT":
        return t("regressionResult");
      case "GRAPH_METRIC":
        return "";
      case "ENERGY_POLICY":
        return t("energyPolicies");
      case "SEU_PIE_CHART":
        return t("seuTotalConsumptionPieChart");
      case "ENERGY_RESOURCE_PIE_CHART":
        return t("energyConsumptionPieChart");
      default:
        return t("unknown");
    }
  }, [customTitle, widget.config.type, t]);

  useEffect(() => {
    if (widget.config.type === "GRAPH_DATA_VIEW_VALUE") {
      void Api.GET("/u/measurement/data-view/profile/{id}", {
        params: { path: { id: widget.config.dataViewId } },
      }).then((res) => {
        if (!res.error) {
          setCustomTitle(res.data.name);
        }
      });
      return;
    }

    if (widget.config.type === "GRAPH_METRIC") {
      void Api.GET("/u/measurement/metric/item/{id}", {
        params: { path: { id: widget.config.metricId } },
      }).then((res) => {
        if (!res.error) {
          setCustomTitle(res.data.name);
        }
      });
      return;
    }

    setCustomTitle(null);
  }, [widget.config]);

  const handleDelete = useCallback(async () => {
    await push(t("msgRecordWillBeDeleted", { subject: title }), async () => {
      const res = await Api.DELETE("/u/dashboard/widget/item/{id}", {
        params: { path: { id: widget.id } },
      });
      apiToast(res);
      if (res.error === undefined) {
        onDelete();
      }
    });
  }, [apiToast, onDelete, push, t, widget.id, title]);

  const handleUpdate = useCallback(
    async (data: {
      index: number;
      column: number;
      config: IDtoWidgetConfig;
    }) => {
      const res = await Api.PUT("/u/dashboard/widget/item/{id}", {
        params: { path: { id: widget.id } },
        body: {
          index: data.index,
          column: data.column,
          config: data.config,
        },
      });
      apiToast(res);
      if (!res.error) {
        setIsEditing(false);
        onUpdate();
      }
    },
    [apiToast, widget.id, onUpdate],
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleNavigateToList = useCallback(() => {
    switch (widget.config.type) {
      case "GRAPH_SEU_VALUE":
        navigate("/measurements/significant-energy-user");
        break;
      case "GRAPH_DATA_VIEW_VALUE":
        navigate(`/measurements/data-view/values/${widget.config.dataViewId}`);
        break;
      case "GRAPH_ADVANCED_REGRESSION_RESULT":
        navigate("/analysis/advanced-regression");
        break;
      case "ENERGY_POLICY":
        navigate("/commitment/energy-policies");
        break;
      case "GRAPH_METRIC":
        navigate(`/measurements/metric/values/graph/${widget.config.metricId}`);
        break;
      case "SEU_PIE_CHART":
        navigate("/measurements/significant-energy-user");
        break;
      case "ENERGY_RESOURCE_PIE_CHART":
        navigate("/measurements/meter");
        break;
    }
  }, [widget.config]);

  const dropdownList = useMemo(
    () => [
      {
        icon: ExternalLink,
        label: t("goToPage"),
        onClick: handleNavigateToList,
      },
      {
        icon: Pencil,
        label: t("edit"),
        onClick: handleEdit,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [t, handleNavigateToList, handleEdit, handleDelete],
  );

  const renderContent = () => {
    if (isEditing) {
      return (
        <CWidgetForm
          initialData={widget}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
        />
      );
    }

    switch (widget.config.type) {
      case "GRAPH_SEU_VALUE":
        return <CWidgetGraphSeuValue config={widget.config} />;
      case "GRAPH_DATA_VIEW_VALUE":
        return <CWidgetGraphDataView config={widget.config} />;
      case "GRAPH_ADVANCED_REGRESSION_RESULT":
        return <CWidgetGraphRegression config={widget.config} />;
      case "GRAPH_METRIC":
        return <CWidgetGraphMetricValue config={widget.config} />;
      case "ENERGY_POLICY":
        return <CWidgetEnergyPolicy />;
      case "SEU_PIE_CHART":
        return <CWidgetSeuPieChart config={widget.config} />;
      case "ENERGY_RESOURCE_PIE_CHART":
        return <CWidgetEnergyResourcePieChart />;
      default:
        return null;
    }
  };

  return (
    <CWidgetCard
      provided={provided}
      title={!isEditing ? title : undefined}
      actions={
        !isEditing && (
          <CDropdown list={dropdownList} value={widget} hideLabelLg />
        )
      }
    >
      {renderContent()}
    </CWidgetCard>
  );
}
