/**
 * @file: CReportFileSelection.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 06.01.2026
 * Last Modified Date: 06.01.2026
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { ArrowDown, ArrowUp, SquareArrowOutUpRight } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import { Api, InferApiGetResponse } from "@m/base/api/Api";
import { CDisplayDateAgo } from "@m/base/components/CDisplayDateAgo";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CButton } from "@m/core/components/CButton";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CFixedFormWidth } from "@m/core/components/CFixedFormWidth";
import { CLine } from "@m/core/components/CLine";
import { CLink } from "@m/core/components/CLink";
import { CMessageCard } from "@m/core/components/CMessageCard";
import { CMutedText } from "@m/core/components/CMutedText";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { useLoader } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

type IReportAttachmentRecord =
  InferApiGetResponse<"/u/report/attachment/item">["records"][number];

type IReportAttachmentItem =
  | (IReportAttachmentRecord & { outdated?: undefined })
  | { id: string; name: string; outdated: boolean; createdAt?: string };

export function CSelectReportAttachment({
  outdatedList,
  value,
  onChange,
  onInvalidChange,
}: {
  // Outdated list is to show deleted attachments
  outdatedList: { id: string; name: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  onInvalidChange: (value: boolean) => void;
}) {
  const loader = useCallback(async () => {
    return await Api.GET("/u/report/attachment/item");
  }, []);

  const [data] = useLoader(loader);

  return (
    <CAsyncLoader data={data}>
      {(payload) => (
        <CSelectReportAttachmentInternal
          outdatedList={outdatedList}
          list={payload.records}
          value={value}
          onChange={onChange}
          onInvalidChange={onInvalidChange}
        />
      )}
    </CAsyncLoader>
  );
}

export function CSelectReportAttachmentInternal({
  outdatedList,
  list,
  value,
  onChange,
  onInvalidChange,
}: {
  outdatedList: { id: string; name: string }[];
  list: IReportAttachmentRecord[];
  value: string[];
  onChange: (value: string[]) => void;
  onInvalidChange: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  const handleFileToggle = useCallback(
    (id: string, selected: boolean) => {
      if (selected) {
        onChange([...value, id]);
      } else {
        onChange(value.filter((d) => d !== id));
      }
    },
    [value, onChange],
  );

  const selectedList = useMemo<IReportAttachmentItem[]>(() => {
    return value.map((id) => {
      const validItem = list.find((d) => d.id === id);
      if (validItem) {
        return validItem;
      }

      const outdatedItem = outdatedList.find((d) => d.id === id);
      if (outdatedItem) {
        return { ...outdatedItem, outdated: true };
      }

      return { name: t("unknown"), id: "", outdated: true };
    });
  }, [list, outdatedList, t, value]);

  const unselectedList = useMemo(() => {
    return list.filter((d) => !value.includes(d.id));
  }, [list, value]);

  const hasOutdatedItems = useMemo(() => {
    return selectedList.some((d) => d.outdated);
  }, [selectedList]);

  useEffect(() => {
    onInvalidChange(hasOutdatedItems);
  }, [hasOutdatedItems, onInvalidChange]);

  const handleMoveUp = useCallback(
    (index: number) => {
      const clone = [...value];
      clone[index - 1] = value[index];
      clone[index] = value[index - 1];
      onChange(clone);
    },
    [onChange, value],
  );
  const handleMoveDown = useCallback(
    (index: number) => {
      const clone = [...value];
      clone[index + 1] = value[index];
      clone[index] = value[index + 1];
      onChange(clone);
    },
    [onChange, value],
  );

  return (
    <div className="space-y-4">
      <div className="text-xl font-bold">{t("attachments")}</div>

      {selectedList.length === 0 && unselectedList.length === 0 && (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-md">
          <CNoRecord />
        </div>
      )}

      {hasOutdatedItems && (
        <CFixedFormWidth className="space-y-2">
          <CMessageCard
            type="error"
            message={t("someSelectedAttachmentsAreNotAvailable")}
          />
        </CFixedFormWidth>
      )}

      {selectedList.length !== 0 && (
        <>
          <CMutedText value={t("selected")} />
          <CFixedFormWidth className="space-y-2">
            {selectedList.map((item, i) => (
              <CSelectReportAttachmentLine
                key={item.id}
                index={i}
                item={item}
                selected
                onClick={handleFileToggle}
                onClickUp={i === 0 ? undefined : handleMoveUp}
                onClickDown={
                  i === selectedList.length - 1 ? undefined : handleMoveDown
                }
              />
            ))}
          </CFixedFormWidth>
        </>
      )}

      {unselectedList.length !== 0 && (
        <>
          <CMutedText value={t("available")} />
          <CFixedFormWidth className="space-y-2">
            {unselectedList.map((item, i) => (
              <CSelectReportAttachmentLine
                key={item.id}
                index={i}
                item={item}
                onClick={handleFileToggle}
              />
            ))}
          </CFixedFormWidth>
        </>
      )}
    </div>
  );
}

function CSelectReportAttachmentLine({
  index,
  item,
  selected,
  onClick,
  onClickUp,
  onClickDown,
}: {
  index: number;
  item: IReportAttachmentItem;
  selected?: boolean;
  onClick: (value: string, selected: boolean) => void;
  onClickUp?: (index: number) => void;
  onClickDown?: (index: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <CLine
      key={item.name}
      className="justify-between items-center space-x-3 py-1"
    >
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <CCheckbox
          value={item.id}
          selected={selected}
          onClick={onClick}
          label={item.name}
          invalid={item.outdated}
          truncateLabel
        />
        {item.outdated && (
          <CBadge
            className="text-red-700 dark:text-red-300"
            value={t("deleted")}
          />
        )}
      </div>

      {item.createdAt && (
        <div className="flex flex-col @sm:flex-row gap-1 text-right">
          <CMutedText>{t("createdAt")}</CMutedText>
          <CDisplayDateAgo value={item.createdAt} />
        </div>
      )}

      {selected && (
        <CLine className="flex items-center space-x-2">
          <CButton
            icon={ArrowDown}
            value={index}
            onClick={onClickDown}
            disabled={!onClickDown}
            tertiary
            hideLabelLg
          />
          <CButton
            icon={ArrowUp}
            value={index}
            onClick={onClickUp}
            disabled={!onClickUp}
            tertiary
            hideLabelLg
          />
        </CLine>
      )}

      <div className="flex-none">
        <CLink
          iconRight={SquareArrowOutUpRight}
          label={t("seeFile")}
          path={`/report/attachments/item/${item.id}`}
          hideLabelLg
          targetNewTab
        />
      </div>
    </CLine>
  );
}
