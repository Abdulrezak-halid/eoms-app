import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CNeedAndExpectationForm } from "../components/CNeedAndExpectationForm";
import { IDtoNeedAndExpectationRequest } from "../interfaces/IDtoNeedAndExpectation";

export function CNeedAndExpectationEditForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/commitment/need-and-expectation/item/{id}", {
      params: { path: { id } },
    });
    return res;
  }, [id]);
  const [data] = useLoader(fetcher);

  const handleSubmit = useCallback(
    async (body: IDtoNeedAndExpectationRequest) => {
      const res = await Api.PUT(
        "/u/commitment/need-and-expectation/item/{id}",
        {
          params: { path: { id } },
          body,
        },
      );
      apiToast(res);

      if (!res.error) {
        navigate("/commitment/needs-and-expectations");
      }
    },
    [apiToast, navigate, id],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("needsAndExpectations"),
        path: "/commitment/needs-and-expectations",
      },
      { label: data.payload?.interestedParty, dynamic: true },
      { label: t("edit") },
    ],
    [t, data.payload?.interestedParty],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CNeedAndExpectationForm
            initialData={payload}
            onSubmit={handleSubmit}
          />
        )}
      </CAsyncLoader>
    </CBody>
  );
}
