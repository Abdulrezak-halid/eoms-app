import { useCallback, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CSeuCardBody } from "../components/CSeuCard";
import { CSeuValueGraph } from "../components/CSeuValueGraph";
import { CSeuValueTable } from "../components/CSeuValueTable";

export function CSeuValue() {
  const { t } = useTranslation();
  const params = useParams();
  const seuId = params.seuId || "";

  const range = useGlobalDatetimeRange();

  const fetcherInfo = useCallback(() => {
    return Api.GET("/u/measurement/seu/item/{id}", {
      params: { path: { id: seuId }, query: range },
    });
  }, [range, seuId]);

  const [seuData] = useLoader(fetcherInfo);

  const breadcrumbs = useMemo<IBreadCrumb[]>(() => {
    const seuName = seuData.payload?.name || "";
    return [
      {
        label: t("significantEnergyUsers"),
        path: "/measurements/significant-energy-user",
      },
      {
        label: seuName,
        dynamic: true,
      },
      { label: t("values") },
    ];
  }, [t, seuData.payload?.name]);

  return (
    <CBody breadcrumbs={breadcrumbs} showGlobalFilter>
      <CAsyncLoader data={seuData}>
        {(payload) => (
          <div className="space-y-4">
            <div className="space-y-2">
              <CCard key={payload.id} className="p-3">
                <CSeuCardBody data={payload} />
              </CCard>
            </div>

            {params.type === "table" ? (
              <CSeuValueTable seuId={seuId} />
            ) : (
              <CSeuValueGraph seuId={seuId} />
            )}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
