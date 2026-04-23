import { useCallback, useMemo, useState } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { CSeuForm } from "@m/measurement/components/CSeuForm";
import { CSeuSuggestions } from "@m/measurement/components/CSeuSuggestions";
import {
  IDtoSeuRequest,
  IDtoSeuSuggestion,
} from "@m/measurement/interfaces/IDtoSeu";

export function CSeuAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const [selectedSuggestion, setSelectedSuggestion] = useState<
    IDtoSeuSuggestion | undefined
  >();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSubmit = useCallback(
    async (data: IDtoSeuRequest) => {
      const res = await Api.POST("/u/measurement/seu/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate(
          `/measurements/significant-energy-user/values/graph/${res.data.id}`,
        );
      }
    },
    [apiToast, navigate],
  );

  const handleSelectSuggestion = useCallback(
    (suggestion: IDtoSeuSuggestion, index: number) => {
      setSelectedSuggestion(suggestion);
      setSelectedIndex(index);
    },
    [],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("significantEnergyUsers"),
        path: "/measurements/significant-energy-user",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs} showGlobalFilter>
      <CSeuSuggestions
        onSelect={handleSelectSuggestion}
        selectedIndex={selectedIndex}
      />
      <CSeuForm onSubmit={handleSubmit} prefillData={selectedSuggestion} />
    </CBody>
  );
}
