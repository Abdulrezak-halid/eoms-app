import { useCallback, useMemo } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { CDataViewProfileForm } from "../components/CDataViewProfileForm";
import { IDtoDataViewProfileRequest } from "../interfaces/IDtoDataViewProfile";

export function CDataViewProfileAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoDataViewProfileRequest) => {
      const res = await Api.POST("/u/measurement/data-view/profile", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate(`/measurements/data-view/values/${res.data.id}`);
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("dataViews"),
        path: "/measurements/data-view/profile",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CDataViewProfileForm onSubmit={handleSubmit} />
    </CBody>
  );
}
