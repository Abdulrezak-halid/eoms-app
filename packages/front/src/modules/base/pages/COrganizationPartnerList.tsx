import { EApiFailCode } from "common";
import { RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo } from "react";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { IDtoOrganizationPartnerListItem } from "@m/base/interfaces/IDtoOrganizationPartner";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CTokenViewer } from "../components/CTokenViewer";
import { COrganizationPartnerAddModal } from "./COrganizationPartnerAddModal";

export function COrganizationPartnerList() {
  const { t } = useTranslation();
  const { push } = useContext(ContextAreYouSure);
  const apiToast = useApiToast();

  const tokenFetcher = useCallback(
    async () => Api.GET("/u/organization/partner/token"),
    [],
  );
  const [tokenData, loadToken] = useLoader(tokenFetcher);

  // auto-generate token if it doesn't exist
  useEffect(() => {
    if (tokenData.failCode === EApiFailCode.NOT_FOUND) {
      void (async () => {
        const res = await Api.PUT("/u/organization/partner/token");
        if (res.error === undefined) {
          await loadToken();
        }
      })();
    }
  }, [tokenData.failCode, loadToken]);

  const handleRegenerateToken = useCallback(async () => {
    const res = await Api.PUT("/u/organization/partner/token");
    apiToast(res);
    if (res.error === undefined) {
      await loadToken();
    }
  }, [apiToast, loadToken]);

  const listFetcher = useCallback(
    async () => Api.GET("/u/organization/partner/item"),
    [],
  );
  const [listData, loadList] = useLoader(listFetcher);

  const handleDeletePartner = useCallback(
    async (record: IDtoOrganizationPartnerListItem) => {
      await push(t("msgRecordDeletionConfirm"), async () => {
        const res = await Api.DELETE(
          "/u/organization/partner/item/{partnerId}",
          { params: { path: { partnerId: record.partnerId } } },
        );
        apiToast(res);
        if (res.error === undefined) {
          await loadList();
        }
      });
    },
    [push, apiToast, loadList, t],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [{ label: t("partners") }],
    [t],
  );

  const tableHeader = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("name") },
      { label: t("type"), hideSm: true },
      { label: "", right: true },
    ],
    [t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <div className="flex flex-col @sm:flex-row gap-2">
        <div className="grow">
          {tokenData.payload && (
            <CTokenViewer
              value={tokenData.payload.token}
              className="w-full @sm:flex-1"
            />
          )}
        </div>

        <CLine className="gap-2">
          {tokenData.payload && (
            <CButton
              icon={RefreshCw}
              label={t("regenerate")}
              onClick={handleRegenerateToken}
              hideLabelLg
            />
          )}
          <COrganizationPartnerAddModal onSuccess={loadList} />
          <CButtonRefresh onClick={loadList} />
        </CLine>
      </div>

      <CAsyncLoader data={listData} arrayField="records">
        {(payload) => (
          <CTable header={tableHeader}>
            {payload.records.map((d) => [
              d.displayName,
              <CBadge
                key="type"
                value={
                  d.relationType === "TOKEN_OWNER"
                    ? t("tokenOwner")
                    : t("tokenUser")
                }
              />,
              <CLine key="actions" className="justify-end">
                <CButton
                  icon={Trash2}
                  label={t("_delete")}
                  value={d}
                  onClick={handleDeletePartner}
                  hideLabelLg
                />
              </CLine>,
            ])}
          </CTable>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
