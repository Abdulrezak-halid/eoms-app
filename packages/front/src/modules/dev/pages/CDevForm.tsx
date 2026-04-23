import { UtilDate } from "common";
import { Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CBody } from "@m/base/components/CBody";
import { CAsyncLoader, IAsyncData } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CCombobox } from "@m/core/components/CCombobox";
import { CForm } from "@m/core/components/CForm";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import { CInputDate } from "@m/core/components/CInputDate";
import { CInputDatetime } from "@m/core/components/CInputDatetime";
import { CInputEmail } from "@m/core/components/CInputEmail";
import { CInputFile } from "@m/core/components/CInputFile";
import { CInputMultiEmail } from "@m/core/components/CInputMultiEmail";
import { CInputMultiString } from "@m/core/components/CInputMultiString";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputPassword } from "@m/core/components/CInputPassword";
import { CInputPhone } from "@m/core/components/CInputPhone";
import { CInputString } from "@m/core/components/CInputString";
import { CInputTextarea } from "@m/core/components/CInputTextarea";
import { CInputTime } from "@m/core/components/CInputTime";
import { CMultiSelect } from "@m/core/components/CMultiSelect";
import { CRadioGroup } from "@m/core/components/CRadioGroup";
import { ISelectListItem } from "@m/core/components/CSelectList";
import { CSlider } from "@m/core/components/CSlider";
import { CSwitch } from "@m/core/components/CSwitch";
import { useInput } from "@m/core/hooks/useInput";

export function CDevForm() {
  const asyncCb = useCallback(async () => {
    await new Promise((res) => {
      setTimeout(res, 1000);
    });
  }, []);

  const list = useMemo(
    () => [
      {
        label: "Label 1",
        value: 1,
      },
      {
        label: "Label 2",
        value: 2,
      },
    ],
    [],
  );

  const regex = useMemo(() => /^.{3}$/, []);
  const today = useMemo(() => UtilDate.objToLocalIsoDate(new Date()), []);
  const noUniqueArr = useMemo(() => ["val0", "val0"], []);

  const inputVal1 = useInput("");
  const inputVal12 = useInput("");
  const inputVal13 = useInput("");
  const inputVal14 = useInput("");
  const inputVal15 = useInput("");
  const inputVal2 = useInput("");
  const inputVal3 = useInput<number>();
  const inputVal32 = useInput<number | undefined>(1);
  const inputVal4 = useInput<number>();
  const inputVal5 = useInput<string>();
  const inputVal52 = useInput<string | undefined>("2024-10-04");
  const inputVal6 = useInput("");
  const inputVal7 = useInput("");
  const inputVal8 = useInput<number[]>();
  const inputValPhone = useInput("");
  const inputValPhoneRequired = useInput("");

  const inputTimeEmpty = useInput<string>();
  const inputTimeMinMax = useInput("10:00:00");
  const inputDatetimeEmpty = useInput<string>();

  const inputMultiString = useInput<string[]>();
  const inputMultiEmail = useInput<string[]>();
  const inputMultiStringNoUnique = useInput<string[]>(noUniqueArr);

  const loading = useMemo(() => ({}), []);

  const [asyncList, setAsyncList] = useState<
    IAsyncData<ISelectListItem<number>[]>
  >({});
  const loadAsyncList = useCallback(() => {
    setTimeout(() => {
      setAsyncList({
        payload: [
          {
            label: "Async Label 1",
            value: 1,
          },
          {
            label: "Async Label 2",
            value: 2,
          },
        ],
      });
    }, 5000);
  }, []);
  useEffect(() => {
    loadAsyncList();
  }, [loadAsyncList]);

  return (
    <CBody title="Dev - Form">
      <CForm onSubmit={asyncCb}>
        <CFormPanel>
          <CFormLine
            label="CInputString required"
            invalidMsg={inputVal1.invalidMsg}
          >
            <CInputString {...inputVal1} required />
          </CFormLine>

          <CFormLine
            label="CInputString min max"
            invalidMsg={inputVal12.invalidMsg}
          >
            <CInputString {...inputVal12} min={1} max={2} />
          </CFormLine>

          <CFormLine
            label="CInputTextarea required"
            invalidMsg={inputVal13.invalidMsg}
          >
            <CInputTextarea {...inputVal13} required />
          </CFormLine>

          <CFormLine
            label="CInputTextarea min max"
            invalidMsg={inputVal14.invalidMsg}
          >
            <CInputTextarea {...inputVal14} min={1} max={2} />
          </CFormLine>

          <CFormLine
            label="CInputString regex"
            invalidMsg={inputVal15.invalidMsg}
          >
            <CInputString {...inputVal15} regex={regex} />
          </CFormLine>

          <CFormLine label="CInputEmail" invalidMsg={inputVal6.invalidMsg}>
            <CInputEmail {...inputVal6} />
          </CFormLine>

          <CFormLine
            label="CInputEmail required"
            invalidMsg={inputVal7.invalidMsg}
          >
            <CInputEmail {...inputVal7} required />
          </CFormLine>

          <CFormLine label="CInputPhone" invalidMsg={inputValPhone.invalidMsg}>
            <CInputPhone {...inputValPhone} />
          </CFormLine>

          <CFormLine
            label="CInputPhone required"
            invalidMsg={inputValPhoneRequired.invalidMsg}
          >
            <CInputPhone {...inputValPhoneRequired} required />
          </CFormLine>

          <CFormLine
            label="CInputPassword required"
            invalidMsg={inputVal2.invalidMsg}
          >
            <CInputPassword {...inputVal2} required />
          </CFormLine>

          <CFormLine
            label="CInputNumber required"
            invalidMsg={inputVal3.invalidMsg}
          >
            <CInputNumber {...inputVal3} required />
          </CFormLine>

          <CFormLine
            label="CInputNumber min max"
            invalidMsg={inputVal32.invalidMsg}
          >
            <CInputNumber {...inputVal32} min={1} max={2} />
          </CFormLine>

          <CFormLine
            label="CCombobox required"
            invalidMsg={inputVal4.invalidMsg}
          >
            <CCombobox {...inputVal4} list={list} required />
          </CFormLine>

          <CFormLine
            label="CInputDate required"
            invalidMsg={inputVal5.invalidMsg}
          >
            <CInputDate {...inputVal5} required />
          </CFormLine>

          <CFormLine
            label="CInputDate min max"
            invalidMsg={inputVal52.invalidMsg}
          >
            <CInputDate {...inputVal52} min="2024-10-05" max="2024-10-25" />
          </CFormLine>

          <CFormLine
            label="CInputTime required"
            invalidMsg={inputTimeEmpty.invalidMsg}
          >
            <CInputTime {...inputTimeEmpty} required />
          </CFormLine>

          <CFormLine
            label="CInputTime min max"
            invalidMsg={inputTimeMinMax.invalidMsg}
          >
            <CInputTime {...inputTimeMinMax} min="12:00:00" max="13:00:00" />
          </CFormLine>

          <CFormLine
            label="CInputDatetime required"
            invalidMsg={inputDatetimeEmpty.invalidMsg}
          >
            <CInputDatetime {...inputDatetimeEmpty} required />
          </CFormLine>

          <CFormLine
            label="CInputMultiString required"
            invalidMsg={inputMultiString.invalidMsg}
          >
            <CInputMultiString {...inputMultiString} required />
          </CFormLine>

          <CFormLine
            label="CInputMultiEmail required"
            invalidMsg={inputMultiEmail.invalidMsg}
          >
            <CInputMultiEmail {...inputMultiEmail} required />
          </CFormLine>

          <CFormLine
            label="CInputMultiString non unique"
            invalidMsg={inputMultiStringNoUnique.invalidMsg}
          >
            <CInputMultiString {...inputMultiStringNoUnique} />
          </CFormLine>

          <CFormLine
            label="CMultiSelect required"
            invalidMsg={inputVal8.invalidMsg}
          >
            <CMultiSelect {...inputVal8} list={list} required />
          </CFormLine>

          <CFormLine label="CInputString">
            <CInputString value="Value" />
          </CFormLine>
          <CFormLine label="CInputString - icon">
            <CInputString icon={Star} value="Value" />
          </CFormLine>
          <CFormLine label="CInputTextarea">
            <CInputTextarea value="Value" />
          </CFormLine>
          <CFormLine label="CInputPassword">
            <CInputPassword value="Value" />
          </CFormLine>
          <CFormLine label="CInputNumber">
            <CInputNumber value={1} />
          </CFormLine>
          <CFormLine label="CCombobox">
            <CCombobox list={list} value={1} />
          </CFormLine>
          <CFormLine label="CAsyncLoader - inline">
            <CAsyncLoader data={loading} inline />
          </CFormLine>
          <CFormLine label="Async Combo">
            <CAsyncLoader data={asyncList} inline>
              {(payload) => <CCombobox list={payload} placeholder="Combobox" />}
            </CAsyncLoader>
          </CFormLine>
          <CFormLine label="CInputDate">
            <CInputDate value={today} />
          </CFormLine>

          <CFormLine label="CCheckbox">
            <CCheckbox selected label="Checkbox" />
          </CFormLine>

          <CFormLine label="CCheckbox - radio">
            <CCheckbox radio selected label="Radio Button" />
          </CFormLine>

          <CFormLine label="CInputFile">
            <CInputFile required />
          </CFormLine>

          <CFormLine label="CRadioGroup">
            <CRadioGroup list={list} value={1} />
          </CFormLine>

          <CFormLine label="CSwitch">
            <CSwitch label="Switch" />
          </CFormLine>

          <CFormLine label="CSwitch">
            <CSwitch label="Switch" selected={true} />
          </CFormLine>

          <CFormLine label="CSlider">
            <CSlider />
          </CFormLine>

          <CFormFooter>
            <CButton label="Button" onClick={asyncCb} />
            <CButton label="Submit" submit primary />
          </CFormFooter>
        </CFormPanel>
      </CForm>
    </CBody>
  );
}
