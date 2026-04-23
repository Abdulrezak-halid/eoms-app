import { useCallback, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CReportFileUploadForm } from "../components/CReportFileUploadForm";

export function CReportAttachmentUpload() {
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("report"),
      },
      {
        label: t("attachments"),
        path: "/report/attachments",
      },
      {
        label: t("upload"),
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    async (name: string, file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);

      const res = await Api.POST("/u/report/attachment/upload", {
        // @ts-expect-error - FormData for multipart/form-data
        body: formData,
        bodySerializer: (body) => body,
      });

      apiToast(res);

      if (res.error === undefined) {
        navigate("/report/attachments");
      }
    },
    [apiToast, navigate],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CReportFileUploadForm onSubmit={handleSubmit} />
    </CBody>
  );
}
