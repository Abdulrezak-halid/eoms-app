import { EApiFailCode } from "common";
import { SearchX } from "lucide-react";
import { ReactNode, useMemo } from "react";

import { classNames } from "@m/core/utils/classNames";

import { NO_FETCH_FAIL_CODE } from "../hooks/useLoader";
import { useTranslation } from "../hooks/useTranslation";
import { CLine } from "./CLine";
import { CLoading } from "./CLoading";
import { CMessageText } from "./CMessageText";
import { CNoPermission } from "./CNoPermission";
import { CNoRecord } from "./CNoRecord";
import { CNotFound } from "./CNotFound";
import { CPlanDisabledOp } from "./CPlanDisabledOp";
import { CSomethingWentWrong } from "./CSomethingWentWrong";
import { CTimeout } from "./CTimeout";

export interface IAsyncData<TPayload> {
  readonly failCode?: string;
  readonly pending?: boolean;
  readonly payload?: TPayload;
}

export type IExtractAsyncData<TAsyncData> =
  TAsyncData extends IAsyncData<infer U> ? U : never;

export function CAsyncLoader<TPayload>({
  data,
  children,
  arrayField,
  inline,
  className,
  showSpinnerDuringNoFetch,
  hideOnNotFound,
}: {
  data: IAsyncData<TPayload>;
  children?: (payload: TPayload) => ReactNode;
  arrayField?: keyof TPayload;
  inline?: boolean;
  className?: string;
  showSpinnerDuringNoFetch?: boolean;
  hideOnNotFound?: boolean;
}) {
  const doNotHandleNoRecord = inline;
  const showSpinnerDuringRevalidate = inline;

  const isNoRecord = useMemo(() => {
    if (!data.payload || doNotHandleNoRecord) {
      return false;
    }
    const arr = arrayField ? data.payload[arrayField] : data.payload;
    return arr instanceof Array && arr.length === 0;
  }, [data.payload, doNotHandleNoRecord, arrayField]);

  const isSuccess =
    data.payload !== undefined &&
    data.failCode === undefined &&
    (!showSpinnerDuringRevalidate || !data.pending);

  const revalidating = data.pending && isSuccess;

  const { t } = useTranslation();

  if (hideOnNotFound && data.failCode === EApiFailCode.NOT_FOUND) {
    return null;
  }

  return (
    <div className={classNames(className, revalidating && "opacity-50")}>
      {isSuccess && !isNoRecord ? (
        children?.(data.payload)
      ) : (
        <CLine
          className={classNames(
            "space-x-2",
            // grow is for in case of CAsyncLoader is a flex,
            //   and place message center
            inline ? "p-3" : "py-12 justify-center grow h-full",
          )}
        >
          {data.failCode === EApiFailCode.FORBIDDEN ? (
            <CNoPermission />
          ) : data.failCode === EApiFailCode.PLAN_DISABLED_OP ? (
            <CPlanDisabledOp />
          ) : data.failCode === EApiFailCode.NOT_FOUND ? (
            <CNotFound />
          ) : data.failCode === EApiFailCode.TIMEOUT ? (
            <CTimeout />
          ) : !showSpinnerDuringNoFetch &&
            data.failCode === NO_FETCH_FAIL_CODE ? (
            <CMessageText
              icon={SearchX}
              value={t("msgDataNotAvailablePleaseCheckParameters")}
              type="mute"
            />
          ) : data.failCode && data.failCode !== NO_FETCH_FAIL_CODE ? (
            <CSomethingWentWrong />
          ) : isNoRecord ? (
            <CNoRecord />
          ) : (
            <CLoading />
          )}
        </CLine>
      )}
    </div>
  );
}
