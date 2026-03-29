import { ChartLine, CircleGauge, Copy, Trash2 } from "lucide-react";
import { useCallback, useContext, useState } from "react";

import { Api } from "@m/base/api/Api";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CCard } from "@m/core/components/CCard";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CLine } from "@m/core/components/CLine";
import { CSwitch } from "@m/core/components/CSwitch";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoAdvancedRegressionResultItem } from "../interfaces/IDtoRegressionAnalyses";
import { CRegressionAnalysesCardBody } from "./CRegressionAnalysesCardBody";
import { CRegressionAnalysesCardThresholdModal } from "./CRegressionAnalysesCardThresholdModal";

export function CRegressionAnalysesCard({
  data,
  load,
}: {
  data: IDtoAdvancedRegressionResultItem;
  load: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const openThresholdModal = useCallback(() => {
    setShowThresholdModal(true);
  }, []);
  const closeThresholdModal = useCallback(() => {
    setShowThresholdModal(false);
  }, []);

  const handlePrimaryChange = useCallback(
    async (selected: boolean) => {
      const res = await Api.PUT("/u/analysis/advanced-regression/set-primary", {
        body: {
          id: data.id,
          value: selected,
        },
      });
      apiToast(res);

      if (!res.error) {
        await load();
      }
    },
    [apiToast, data.id, load],
  );

  const handleDelete = useCallback(async () => {
    const subject =
      data.seu?.name ||
      data.slices.map((slice) => slice.name).join(", ") ||
      t("meters");

    await push(t("msgRecordWillBeDeleted", { subject }), async () => {
      const res = await Api.DELETE(
        "/u/analysis/advanced-regression/result/{resultId}",
        {
          params: { path: { resultId: data.id } },
        },
      );
      apiToast(res);
      if (res.error === undefined) {
        await load();
      }
    });
  }, [apiToast, data, load, push, t]);

  const actions = useCallback<
    IDropdownListCallback<IDtoAdvancedRegressionResultItem>
  >(
    (d) => [
      {
        icon: ChartLine,
        label: t("result"),
        path: `/analysis/advanced-regression/values/${d.id}`,
      },
      {
        icon: CircleGauge,
        label: t("adjustThreshold"),
        onClick: openThresholdModal,
      },
      {
        icon: Copy,
        label: t("clone"),
        path: `/analysis/advanced-regression/clone/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [handleDelete, openThresholdModal, t],
  );

  return (
    <>
      <CCard className="p-3">
        <CLine className="space-x-3 items-start">
          <div className="grow min-w-0">
            <CRegressionAnalysesCardBody data={data} />
            {data.seu && (
              <CSwitch
                selected={data.primary}
                onChange={handlePrimaryChange}
                label={t("primary")}
              />
            )}
          </div>
          <CDropdown
            list={actions}
            value={data}
            label={t("actions")}
            hideLabelLg
          />
        </CLine>
      </CCard>

      {showThresholdModal && (
        <CRegressionAnalysesCardThresholdModal
          id={data.id}
          initialValue={data.threshold}
          onClose={closeThresholdModal}
          onDone={load}
        />
      )}
    </>
  );
}
