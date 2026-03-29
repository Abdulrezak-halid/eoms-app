import { UtilDate } from "common";
import { IDtoPlainOrTranslatableText } from "common/build-api-schema";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { CFormFooterSaveUpdate } from "@m/base/components/CFormFooterSaveUpdate";
import { CMultiSelectUser } from "@m/base/components/CMultiSelectUser";
import { CButton } from "@m/core/components/CButton";
import { CForm } from "@m/core/components/CForm";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CHr } from "@m/core/components/CHr";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInvalidMsg } from "@m/core/components/CInvalidMsg";
import { CLine } from "@m/core/components/CLine";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import {
  IDtoReportSectionData,
  IReportFormData,
  IReportFormInitialData,
} from "../interfaces/IDtoReport";
import { IReportSection } from "../interfaces/IReportSection";
import { UtilReportSectionControl } from "../utils/UtilReportSectionControl";
import { CInputStringPlainOrTranslatable } from "./CInputStringPlainOrTranslatable";
import { CReportSection } from "./CReportSection";
import { CSelectReportAttachment } from "./CSelectReportAttachment";

export function CReportForm({
  initialData,
  template,
  onSubmit,
}: {
  initialData?: IReportFormInitialData;
  template?: boolean;
  onSubmit: (data: IReportFormData) => Promise<void>;
}) {
  const { t } = useTranslation();

  const inputTemplateDescription = useInput<IDtoPlainOrTranslatableText>(
    initialData?.templateDescription || { type: "PLAIN", value: "" },
  );

  const inputTitle = useInput<IDtoPlainOrTranslatableText>(
    initialData?.content.title || { type: "PLAIN", value: "" },
  );
  const inputDateStart = useInput(initialData?.content.dateStart);
  const inputDateEnd = useInput(initialData?.content.dateEnd);
  const inputAuthorIds = useInput(initialData?.content.authorIds || []);

  const refLastId = useRef(0);

  const [sections, setSections] = useState<IReportSection[]>(() =>
    initialData?.content.sections
      ? UtilReportSectionControl.renumberSections(
          initialData.content.sections.map((d) => ({
            id: ++refLastId.current,
            data: d,
          })),
        )
      : [],
  );

  const initialAttachments = useMemo(
    () => initialData?.attachments || [],
    [initialData?.attachments],
  );

  const [selectedAttachmentIds, setSelectedAttachmentIds] = useState<string[]>(
    () => initialData?.attachments?.map((d) => d.id) ?? [],
  );

  const invalidMainForm = useInputInvalid(
    inputTitle,
    inputDateStart,
    inputDateEnd,
    inputAuthorIds,
  );

  // To avoid submit button flicker, invalid state started as true
  const [invalidAttachment, setInvalidAttachment] = useState(true);

  const invalid = useMemo(() => {
    const invalidSection = sections.find((d) => d.invalid);
    return (
      invalidMainForm ||
      sections.length === 0 ||
      Boolean(invalidSection) ||
      invalidAttachment
    );
  }, [invalidAttachment, invalidMainForm, sections]);

  const handleSubmit = useCallback(async () => {
    if (
      invalid ||
      (!template && (!inputDateStart.value || !inputDateEnd.value))
    ) {
      return;
    }

    await onSubmit({
      templateDescription: inputTemplateDescription.value,
      content: {
        title: inputTitle.value,
        dateStart: inputDateStart.value,
        dateEnd: inputDateEnd.value,
        authorIds: inputAuthorIds.value,
        sections: sections.map((d) => d.data),
      },
      attachmentIds: selectedAttachmentIds,
    });
  }, [
    inputAuthorIds.value,
    inputDateEnd.value,
    inputDateStart.value,
    inputTemplateDescription.value,
    inputTitle.value,
    invalid,
    onSubmit,
    sections,
    selectedAttachmentIds,
    template,
  ]);

  const handleSectionAdd = useCallback(() => {
    setSections((d) =>
      UtilReportSectionControl.renumberSections([
        ...d,
        {
          id: ++refLastId.current,
          data: { title: { type: "PLAIN", value: "" } },
        },
      ]),
    );
  }, []);

  const handleSectionRemove = useCallback((index: number) => {
    setSections((d) => {
      const clone = [...d];
      clone.splice(index, 1);
      return UtilReportSectionControl.normalizeSectionDepths(clone);
    });
  }, []);

  const handleSectionDataChange = useCallback(
    (index: number, value: IDtoReportSectionData) => {
      setSections((d) => {
        const clone = [...d];
        clone[index] = { ...clone[index], data: value };
        return clone;
      });
    },
    [],
  );

  const handleSectionInvalidChange = useCallback(
    (index: number, value: boolean) => {
      setSections((d) => {
        const clone = [...d];
        clone[index] = { ...clone[index], invalid: value };
        return clone;
      });
    },
    [],
  );

  const handleSectionPositionChange = useCallback(
    (
      index: number,
      event: "moveUp" | "moveDown" | "increaseDepth" | "decreaseDepth",
    ) => {
      setSections((d) => {
        switch (event) {
          case "decreaseDepth": {
            return UtilReportSectionControl.decreaseDepth(d, index);
          }
          case "increaseDepth": {
            return UtilReportSectionControl.increaseDepth(d, index);
          }
          case "moveUp": {
            if (index === 0) {
              return d;
            }
            const clone = [...d];
            clone[index - 1] = d[index];
            clone[index] = d[index - 1];
            return UtilReportSectionControl.normalizeSectionDepths(clone);
          }
          case "moveDown": {
            if (index === d.length - 1) {
              return d;
            }
            const clone = [...d];
            clone[index + 1] = d[index];
            clone[index] = d[index + 1];
            return UtilReportSectionControl.normalizeSectionDepths(clone);
          }
        }
      });
    },
    [],
  );

  const datetimeRange = useMemo(() => {
    if (!inputDateStart.value || !inputDateEnd.value) {
      return undefined;
    }
    const endDate = UtilDate.localIsoDateToObj(inputDateEnd.value);
    endDate.setHours(23, 59, 59, 999);
    return {
      datetimeMin: UtilDate.localIsoDateToIsoDatetime(inputDateStart.value),
      datetimeMax: UtilDate.objToIsoDatetime(endDate),
    };
  }, [inputDateEnd.value, inputDateStart.value]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormPanel>
        <CFormLine label={t("reportTitle")} invalidMsg={inputTitle.invalidMsg}>
          <CInputStringPlainOrTranslatable
            {...inputTitle}
            placeholder={t("reportTitle")}
            required
          />
        </CFormLine>

        {template && (
          <CFormLine
            label={t("description")}
            invalidMsg={inputTemplateDescription.invalidMsg}
          >
            <CInputStringPlainOrTranslatable
              {...inputTemplateDescription}
              placeholder={t("description")}
              multiline
            />
          </CFormLine>
        )}

        <CFormLine
          label={t("startDate")}
          invalidMsg={inputDateStart.invalidMsg}
        >
          <CInputDate
            {...inputDateStart}
            placeholder={t("startDate")}
            required={!template}
            max={inputDateEnd.value}
          />
        </CFormLine>

        <CFormLine label={t("endDate")} invalidMsg={inputDateEnd.invalidMsg}>
          <CInputDate
            {...inputDateEnd}
            placeholder={t("endDate")}
            required={!template}
            min={inputDateStart.value}
          />
        </CFormLine>

        <CFormLine label={t("authors")} invalidMsg={inputAuthorIds.invalidMsg}>
          <CMultiSelectUser {...inputAuthorIds} />
        </CFormLine>
      </CFormPanel>

      <CHr className="my-8" />

      <div className="space-y-4">
        <CLine className="justify-between items-center">
          <h2 className="text-xl font-bold">{t("reportSections")}</h2>
        </CLine>

        {sections.length === 0 && (
          <div className="relative">
            <div className="text-center py-16 rounded-md bg-rose-50 dark:bg-rose-400/25 shadow-sm">
              <CNoRecord />
            </div>
            {/* It is absolute not to shift "Add Sections" button */}
            <div className="absolute">
              <CInvalidMsg value={t("required")} />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {sections.map((d, i) => (
            <CReportSection
              // If content type is changed remount section component
              key={`${d.id}-${d.data.content?.type}`}
              index={i}
              sections={sections}
              data={d.data}
              sectionNumber={d.sectionNumber}
              template={template}
              onRemove={handleSectionRemove}
              onDataChange={handleSectionDataChange}
              onInvalidChange={handleSectionInvalidChange}
              datetimeRange={datetimeRange}
              onSectionPositionChange={handleSectionPositionChange}
            />
          ))}
        </div>

        <div className="text-right">
          <CButton
            icon={Plus}
            label={t("addSection")}
            onClick={handleSectionAdd}
            tertiary
          />
        </div>
      </div>

      {!template && (
        <>
          <CHr className="my-8" />

          <CSelectReportAttachment
            outdatedList={initialAttachments}
            value={selectedAttachmentIds}
            onChange={setSelectedAttachmentIds}
            onInvalidChange={setInvalidAttachment}
          />
        </>
      )}

      <CHr className="my-8" />

      <CFormFooterSaveUpdate
        labelSave={
          template
            ? initialData
              ? t("update")
              : t("createTemplate")
            : t("createReport")
        }
        disabled={invalid}
      />
    </CForm>
  );
}
