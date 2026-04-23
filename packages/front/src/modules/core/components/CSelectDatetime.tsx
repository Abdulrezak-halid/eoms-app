import { UtilDate } from "common";
import { useCallback } from "react";

import { useDatetimeParts } from "../hooks/useDatetimeParts";
import { strToTimeParts } from "../hooks/useInputTimeParts";
import { CPopupPanel } from "./CPopupPanel";
import { CSelectDateBody } from "./CSelectDateBody";
import { CSelectTimeBody } from "./CSelectTimeBody";

export type ISelectDatetimeSection = "DATE" | "TIME" | "BOTH";

export function CSelectDatetime({
  value,
  onChange,
  min,
  max,
}: {
  value?: string;
  onChange?: (
    value: string | undefined,
    section: ISelectDatetimeSection,
  ) => void;
  min?: string;
  max?: string;
}) {
  const [valueDate, valueTime] = useDatetimeParts(value);
  const [valueDateMin, valueTimeMin] = useDatetimeParts(min);
  const [valueDateMax, valueTimeMax] = useDatetimeParts(max);

  const handleChange = useCallback(
    (valDate: string, valTime: string, section: ISelectDatetimeSection) => {
      if (valDate === "" || valTime === "") {
        onChange?.("", "BOTH");
        return;
      }
      const date = UtilDate.localIsoDateToObj(valDate);
      const parts = strToTimeParts(valTime);
      date.setHours(parts[0]);
      date.setMinutes(parts[1]);
      date.setSeconds(parts[2]);
      onChange?.(UtilDate.objToIsoDatetime(date), section);
    },
    [onChange],
  );

  const handleChangeDate = useCallback(
    (val: string | undefined) => {
      if (!val) {
        onChange?.(undefined, "BOTH");
        return;
      }
      handleChange(val, valueTime || "00:00:00", "DATE");
    },
    [handleChange, valueTime, onChange],
  );

  const handleChangeTime = useCallback(
    (val: string) => {
      handleChange(
        valueDate || UtilDate.objToLocalIsoDate(new Date()),
        val,
        "TIME",
      );
    },
    [valueDate, handleChange],
  );

  return (
    // Top-level overflow-hidden is to make scrollbar corners rounded
    <CPopupPanel className="w-[20rem] @sm:w-[30rem] max-h-full overflow-hidden">
      <div className="flex flex-col @sm:flex-row h-[40rem] max-h-full @sm:h-[26rem]">
        <div className="flex-none w-[20rem] h-[26rem]">
          <CSelectDateBody
            value={valueDate}
            onChange={handleChangeDate}
            min={min}
            max={max}
          />
        </div>

        <div className="min-h-0">
          <CSelectTimeBody
            value={valueTime}
            onChange={handleChangeTime}
            min={valueDate === valueDateMin ? valueTimeMin : undefined}
            max={valueDate === valueDateMax ? valueTimeMax : undefined}
          />
        </div>
      </div>
    </CPopupPanel>
  );
}
