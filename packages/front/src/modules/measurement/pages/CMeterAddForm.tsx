import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMeterForm } from "../components/CMeterForm";
import { IDtoMeterRequest } from "../interfaces/IDtoMeter";

export function CMeterAddForm() {
  const apiToast = useApiToast();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (data: IDtoMeterRequest) => {
      const res = await Api.POST("/u/measurement/meter/item", {
        body: data,
      });
      apiToast(res);

      if (!res.error) {
        navigate("/measurements/meter");
      }
    },
    [apiToast, navigate],
  );

  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("meters"),
        path: "/measurements/meter",
      },
      { label: t("add") },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CMeterForm onSubmit={handleSubmit} />
    </CBody>
  );
}
