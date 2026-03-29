import { Plus, Trash2 } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CRegressionAnalysesTabs } from "../components/CRegressionAnalysesTabs";
import { CRegressionSuggestCard } from "../components/CRegressionSuggestCard";

export function CRegressionSuggestList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set(),
  );
  const [allRecords, setAllRecords] = useState<string[]>([]);

  const fetcherSuggests = useCallback(async () => {
    return await Api.GET("/u/analysis/advanced-regression/suggest");
  }, []);

  const [dataSuggests, loadSuggests] = useLoader(fetcherSuggests);

  useEffect(() => {
    if (dataSuggests.payload?.records) {
      const ids = dataSuggests.payload.records.map((record) => record.id);
      setAllRecords(ids);
      setSelectedRecords((prev) => {
        const newSelected = new Set<string>();
        ids.forEach((id) => {
          if (prev.has(id)) {
            newSelected.add(id);
          }
        });
        return newSelected;
      });
    }
  }, [dataSuggests.payload?.records]);

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedRecords(new Set(allRecords));
      } else {
        setSelectedRecords(new Set());
      }
    },
    [allRecords],
  );

  const handleCheckboxClick = useCallback((id: string, selected: boolean) => {
    setSelectedRecords((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleBulkDelete = useCallback(async () => {
    await push(
      t("msgRecordCountDeletionConfirm", {
        count: selectedRecords.size,
      }),
      async () => {
        const deletePromises = Array.from(selectedRecords).map((id) =>
          Api.DELETE("/u/analysis/advanced-regression/suggest/{id}", {
            params: { path: { id } },
          }),
        );

        const results = await Promise.all(deletePromises);
        const hasError = results.some((res) => res.error !== undefined);

        if (hasError) {
          apiToast({ error: t("unknown") });
        } else {
          apiToast({ error: undefined });
          setSelectedRecords(new Set());
          await loadSuggests();
        }
      },
    );
  }, [apiToast, loadSuggests, push, selectedRecords, t]);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("regressionAnalysis"),
      },
    ],
    [t],
  );

  const actions = useMemo(
    () => (
      <CLine className="gap-2 flex-shrink-0">
        <div className="-my-1">
          <CCheckbox
            selected={
              selectedRecords.size > 0 &&
              selectedRecords.size === allRecords.length
            }
            semiSelected={
              selectedRecords.size > 0 &&
              selectedRecords.size < allRecords.length
            }
            onChange={handleSelectAll}
          />
        </div>

        <CButton
          icon={Trash2}
          label={
            selectedRecords.size > 0
              ? `${t("_delete")} (${selectedRecords.size})`
              : t("_delete")
          }
          onClick={handleBulkDelete}
          color="red"
          disabled={selectedRecords.size === 0}
          hideLabelLg
        />

        <div className="w-px h-10 bg-neutral-200 dark:bg-neutral-700" />

        <CLink
          icon={Plus}
          label={t("startAnalysis")}
          path="/analysis/advanced-regression/suggestion-add"
          hideLabelLg
        />
        <CButtonRefresh onClick={loadSuggests} />
      </CLine>
    ),
    [
      allRecords.length,
      handleBulkDelete,
      handleSelectAll,
      loadSuggests,
      selectedRecords.size,
      t,
    ],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <div className="space-y-4">
        <div className="flex items-end justify-between space-x-2">
          <CRegressionAnalysesTabs />
          {actions}
        </div>

        <CAsyncLoader data={dataSuggests} arrayField="records">
          {(payload) => (
            <div className="flex flex-col space-y-4">
              {payload.records.map((suggest) => (
                <CRegressionSuggestCard
                  key={suggest.id}
                  data={suggest}
                  load={loadSuggests}
                  selected={selectedRecords.has(suggest.id)}
                  onCheckboxClick={handleCheckboxClick}
                />
              ))}
            </div>
          )}
        </CAsyncLoader>
      </div>
    </CBody>
  );
}
