import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { usePermission } from "@m/base/hooks/usePermission";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CLine } from "@m/core/components/CLine";
import { CModal } from "@m/core/components/CModal";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CDraggableWidgetGrid } from "../components/CDraggableWidgetGrid";
import { CWidgetForm } from "../components/CWidgetForm";
import { useDraggableDashboard } from "../hooks/useDraggableDashboard";
import { useFetchWidgets } from "../hooks/useFetchWidgets";
import {
  IDtoWidgetConfig,
  IDtoWidgetListResponse,
} from "../interfaces/IDtoDashboard";

export function CDashboardPage() {
  const { t } = useTranslation();
  const apiToast = useApiToast();
  const [data, load] = useFetchWidgets();
  const [showAddModal, setShowAddModal] = useState(false);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("dashboard") }],
    [t],
  );

  // This method is used to optimize refresh function of the dashboard.
  //   When widget lists are refetched, since it is a different object now,
  //   all widgets refetch the graph data again.
  //   Json stringify/parse method is not a good way, but widget config object
  //   is a small object. So it does not hurt performance.
  const cachedWidgets = useMemo(
    () => JSON.stringify(data.payload?.records ?? []),
    [data.payload?.records],
  );
  const sortedWidgets = useMemo(
    () =>
      (JSON.parse(cachedWidgets) as IDtoWidgetListResponse["records"]).sort(
        (a, b) => a.index - b.index,
      ) ?? [],
    [cachedWidgets],
  );

  const { columns, handleOnDragEnd } = useDraggableDashboard(
    sortedWidgets,
    load,
  );

  const handleOpenAddModal = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setShowAddModal(false);
  }, []);

  const handleAddWidget = useCallback(
    async (widgetData: {
      index: number;
      column: number;
      config: IDtoWidgetConfig;
    }) => {
      const res = await Api.POST("/u/dashboard/widget/item", {
        body: widgetData,
      });
      apiToast(res);
      if (!res.error) {
        setShowAddModal(false);
        await load();
      }
    },
    [apiToast, load],
  );

  const hasEditPerm = usePermission("/DASHBOARD/WIDGET/EDIT");

  return (
    <CBody breadcrumbs={breadcrumbs} noFixedWidth showGlobalFilter>
      <CLine className="justify-end mb-4 gap-2">
        {hasEditPerm && (
          <CButton
            onClick={handleOpenAddModal}
            icon={Plus}
            label={t("add")}
            hideLabelLg
          />
        )}
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {() => (
          <CDraggableWidgetGrid
            columns={columns}
            onDragEnd={handleOnDragEnd}
            onUpdate={load}
            onDelete={load}
          />
        )}
      </CAsyncLoader>

      {showAddModal && (
        <CModal onClickBg={handleCloseAddModal}>
          <CWidgetForm
            onSubmit={handleAddWidget}
            onCancel={handleCloseAddModal}
          />
        </CModal>
      )}
    </CBody>
  );
}
