import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBadgePeriod } from "@m/base/components/CBadgePeriod";
import { CBadgeYesNo } from "@m/base/components/CBadgeYesNo";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { CButtonRefresh } from "@m/base/components/CButtonRefresh";
import { CDisplayDate } from "@m/base/components/CDisplayDatetime";
import { CLinkAdd } from "@m/base/components/CLinkAdd";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CDropdown, IDropdownListCallback } from "@m/core/components/CDropdown";
import { CHr } from "@m/core/components/CHr";
import { CLine } from "@m/core/components/CLine";
import { CTable, ITableHeaderColumn } from "@m/core/components/CTable";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoComplianceObligationArticleResponse } from "../interfaces/IDtoComplianceObligation";

export function CComplianceObligationArticleList() {
  const { t } = useTranslation();
  const { subjectId = "" } = useParams();
  const apiToast = useApiToast();
  const { push } = useContext(ContextAreYouSure);

  const complianceObligationFetcher = useCallback(
    () =>
      Api.GET("/u/commitment/compliance-obligation/item/{id}", {
        params: { path: { id: subjectId } },
      }),
    [subjectId],
  );
  const [complianceObligationData, reloadDesign] = useLoader(
    complianceObligationFetcher,
  );

  const ideasFetcher = useCallback(
    () =>
      Api.GET("/u/commitment/compliance-obligation/item/{subjectId}/articles", {
        params: { path: { subjectId } },
      }),
    [subjectId],
  );
  const [articleData, reloadIdeas] = useLoader(ideasFetcher);

  const refreshAll = useCallback(async () => {
    await reloadDesign();
    await reloadIdeas();
  }, [reloadDesign, reloadIdeas]);

  const handleDelete = useCallback(
    async (record: IDtoComplianceObligationArticleResponse) => {
      await push(
        t("msgRecordWillBeDeleted", { subject: record.conformityAssessment }),
        async () => {
          const res = await Api.DELETE(
            "/u/commitment/compliance-obligation/item/{subjectId}/articles/{id}",
            { params: { path: { id: record.id, subjectId } } },
          );
          apiToast(res);
          if (!res.error) {
            await reloadIdeas();
          }
        },
      );
    },
    [apiToast, reloadIdeas, push, t, subjectId],
  );

  const actions = useCallback<
    IDropdownListCallback<IDtoComplianceObligationArticleResponse>
  >(
    (d) => [
      {
        icon: Pencil,
        label: t("edit"),
        path: `/commitment/compliance-obligation/item/${subjectId}/articles/item/${d.id}`,
      },
      {
        icon: Trash2,
        label: t("_delete"),
        onClick: handleDelete,
      },
    ],
    [t, subjectId, handleDelete],
  );

  const header = useMemo<ITableHeaderColumn[]>(
    () => [
      { label: t("conformityAssessment") },
      { label: t("currentApplication"), hideSm: true },
      { label: t("conformityAssessmentPeriod"), hideMd: true },
      { label: t("lastConformityAssessment"), hideSm: true, right: true },
      { label: t("relatedeomscleNo"), hideMd: true },
      { label: "", right: true },
    ],
    [t],
  );

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      {
        label: t("complianceObligation"),
        path: "/commitment/compliance-obligation",
      },
      {
        label: complianceObligationData.payload?.complianceObligation,
        dynamic: true,
      },
      { label: t("eomscles") },
    ],
    [t, complianceObligationData.payload?.complianceObligation],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={complianceObligationData}>
        {(complianceObligation) => {
          const rows = [
            {
              label: t("complianceObligation"),
              value: complianceObligation.complianceObligation,
            },
            {
              label: t("revisionNo"),
              value: <CBadge value={complianceObligation.revisionNo} />,
            },
            {
              label: t("revisionDate"),
              value: <CDisplayDate value={complianceObligation.revisionDate} />,
            },
            {
              label: t("reviewPeriod"),
              value: <CBadgePeriod value={complianceObligation.reviewPeriod} />,
            },
            {
              label: t("isLegalActive"),
              value: <CBadgeYesNo value={complianceObligation.isLegalActive} />,
            },
            {
              label: t("articleCount"),
              value: complianceObligation.articleCount,
            },
            {
              label: t("officialNewspaperNo"),
              value: complianceObligation.officialNewspaperNo,
            },
            {
              label: t("officialNewspaperPublicationDate"),
              value: (
                <CDisplayDate
                  value={complianceObligation.officialNewspaperPublicationDate}
                />
              ),
            },
            {
              label: t("reviewDate"),
              value: <CDisplayDate value={complianceObligation.reviewDate} />,
            },
          ];

          return (
            <CTable header={[{ label: t("property") }, { label: t("value") }]}>
              {rows.map((row) => [
                <div key="label" className="font-semibold">
                  {row.label}
                </div>,
                <div key="value">{row.value}</div>,
              ])}
            </CTable>
          );
        }}
      </CAsyncLoader>

      <CHr className="my-4" />
      <CLine className="justify-end space-x-2 grow mb-4">
        <CLinkAdd
          path={`/commitment/compliance-obligation/item/${subjectId}/articles/item-add`}
        />
        <CButtonRefresh onClick={refreshAll} />
      </CLine>

      <CAsyncLoader data={articleData} arrayField="records">
        {(payload) => (
          <CTable noOverflow header={header}>
            {payload.records.map((d) => [
              d.conformityAssessment,
              d.currentApplication,
              <CBadgePeriod
                key="conformityAssessmentPeriod"
                value={d.conformityAssessmentPeriod}
              />,
              <CDisplayDate
                key="lastConformityAssessment"
                value={d.lastConformityAssessment}
              />,
              d.relatedArticleNo,
              <div key="actions" className="flex overflow-visible justify-end">
                <CDropdown
                  list={actions}
                  value={d}
                  label={t("actions")}
                  hideLabelLg
                />
              </div>,
            ])}
          </CTable>
        )}
      </CAsyncLoader>
    </CBody>
  );
}
