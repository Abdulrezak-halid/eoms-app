import { useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "@m/core/hooks/useTranslation";
import { Trash2 } from "lucide-react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import { CFormPanel } from "@m/core/components/CFormPanel";
import { CInputImage } from "@m/core/components/CInputImage";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { BANNER_ACCEPT, BANNER_MAX_SIZE } from "../constants/Banner";

export function CSysOrganizationsBannerForm() {
  const { t } = useTranslation();
  const apiToast = useApiToast();
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetcher = useCallback(async () => {
    if (!id) {
      return undefined;
    }
    return await Api.GET("/u/sys/organization/item/{id}", {
      params: { path: { id } },
    });
  }, [id]);

  const [data] = useLoader(fetcher);

  const existingBannerUrl = useMemo(
    () => (id ? `/api/u/sys/organization/item/${id}/banner` : undefined),
    [id],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(() => {
    return [
      { label: t("sysOrganizations"), path: "/sys/organizations" },
      { label: data.payload?.displayName, dynamic: true },
      { label: t("changeBanner") },
    ];
  }, [t, data.payload]);

  const handleSubmit = useCallback(async () => {
    if (!bannerFile) {
      return;
    }

    setIsLoading(true);
    const res = await Api.PUT("/u/sys/organization/item/{id}/banner", {
      params: { path: { id } },
      body: {
        banner: "",
      },

      bodySerializer() {
        const formData = new FormData();
        formData.append("banner", bannerFile);
        return formData;
      },
    });

    apiToast(res);
    if (!res.error) {
      navigate("/sys/organizations");
    }
  }, [bannerFile, apiToast, navigate, id]);

  const handleCancel = useCallback(() => {
    navigate("/sys/organizations");
  }, [navigate]);

  const { push } = useContext(ContextAreYouSure);

  const handleDelete = useCallback(async () => {
    await push(
      t("msgRecordWillBeDeleted", { subject: data.payload?.displayName }),
      async () => {
        const res = await Api.DELETE("/u/sys/organization/item/{id}/banner", {
          params: { path: { id } },
        });
        apiToast(res);
        if (res.error === undefined) {
          navigate("/sys/organizations");
        }
      },
    );
  }, [push, t, data.payload?.displayName, id, apiToast, navigate]);

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => (
          <CForm onSubmit={handleSubmit}>
            <CFormPanel>
              <CInputImage
                value={bannerFile}
                onChange={setBannerFile}
                existingImageUrl={
                  payload.hasBanner ? existingBannerUrl : undefined
                }
                accept={BANNER_ACCEPT}
                maxSize={BANNER_MAX_SIZE}
                disabled={isLoading}
              />

              <CFormFooterSaveUpdate
                isUpdate={true}
                disabled={!bannerFile || isLoading}
                onCancel={handleCancel}
              >
                <div className="grow">
                  <CButton
                    icon={Trash2}
                    label={t("_delete")}
                    color="red"
                    onClick={handleDelete}
                    disabled={!data.payload?.hasBanner}
                  />
                </div>
              </CFormFooterSaveUpdate>
            </CFormPanel>
          </CForm>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
