import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { CLine } from "@m/core/components/CLine";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CDataViewProfileCardBody } from "../components/CDataViewProfileCardBody";
import { CDataViewProfileValueGraph } from "../components/CDataViewProfileValueGraph";

export function CDataViewProfileValue() {
  const { t } = useTranslation();
  const { profileId: paramId } = useParams();
  const profileId = paramId || "";

  const fetcherInfo = useCallback(() => {
    return Api.GET("/u/measurement/data-view/profile/{id}", {
      params: { path: { id: profileId } },
    });
  }, [profileId]);

  const [profileData] = useLoader(fetcherInfo);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("dataViews"),
        path: "/measurements/data-view/profile",
      },
      { label: profileData.payload?.name, dynamic: true },
      { label: t("values") },
    ],
    [t, profileData.payload?.name],
  );

  return (
    <CBody breadcrumbs={breadcrumbs} showGlobalFilter>
      <CAsyncLoader data={profileData}>
        {(payload) => (
          <div className="space-y-4">
            <div className="space-y-2">
              <CCard key={payload.id} className="p-2 pl-4">
                <CLine className="space-x-4">
                  <CDataViewProfileCardBody data={payload} />
                </CLine>
              </CCard>
            </div>

            <CDataViewProfileValueGraph
              profileId={profileId}
              profileType={payload.options.type}
            />
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
