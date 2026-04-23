import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CNeedAndExpectationForm } from "../components/CNeedAndExpectationForm";
import { IDtoNeedAndExpectationRequest } from "../interfaces/IDtoNeedAndExpectation";

export function CNeedAndExpectationAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoNeedAndExpectationRequest) => {
      const res = await Api.POST("/u/commitment/need-and-expectation/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/commitment/needs-and-expectations");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("needsAndExpectations"),
        path: "/commitment/needs-and-expectations",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CNeedAndExpectationForm onSubmit={handleSubmit} />
    </CBody>
  );
}
