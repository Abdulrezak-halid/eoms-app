import { ChartLine, Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CCard } from "@m/core/components/CCard";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CLine } from "@m/core/components/CLine";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CDataViewProfileCardBody } from "../components/CDataViewProfileCardBody";
import { IDtoDataViewProfileResponse } from "../interfaces/IDtoDataViewProfile";

export function CDataViewProfileList() {
  const { t } = useTranslation();

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("dataViews") }],
    [t],
  );

  const fetcher = useCallback(async () => {
    return await Api.GET("/u/measurement/data-view/profile");
  }, []);
  const [data, load] = useLoader(fetcher);

  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const handleDelete = useCallback(
    async (record: IDtoDataViewProfileResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.name }),
        async () => {
          const res = await Api.DELETE(
            "/u/measurement/data-view/profile/{id}",
            {
              params: { path: { id: record.id } },
            },
          );
          apiToast(res);
          if (res.error === undefined) {
            await load();
          }
        },
      );
    },
    [apiToast, load, push, t],
  );

  const actions = useCallback<
    IDropdownListCallback<IDtoDataViewProfileResponse>
  >(
    (d) => [
      {
        icon: ChartLine,
        label: t("values"),
        path: `/measurements/data-view/values/${d.id}`,
      },
      {
        icon: Pencil,
        label: t("edit"),
        path: `/measurements/data-view/profile/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [handleDelete, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CLine className="justify-end space-x-2 grow">
        <CLinkAdd path="/measurements/data-view/profile/item-add" />
        <CButtonRefresh onClick={load} />
      </CLine>

      <CAsyncLoader data={data} arrayField="records">
        {(payload) => (
          <div className="space-y-2">
            {payload.records.map((d) => (
              <CCard key={d.id} className="p-3">
                <CLine className="space-x-3 items-center">
                  <CDataViewProfileCardBody data={d} />
                  <div className="self-start">
                    <CDropdown
                      value={d}
                      list={actions}
                      label={t("actions")}
                      hideLabelLg
                    />
                  </div>
                </CLine>
              </CCard>
            ))}
          </div>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
