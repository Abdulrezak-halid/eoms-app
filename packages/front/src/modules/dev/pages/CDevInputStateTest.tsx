/**
 * @file: CDevInputStateTest.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 25.06.2025
 * Last Modified Date: 25.06.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useMemo } from "react";

import { CBody } from "@m/base/components/CBody";
import { CButton } from "@m/core/components/CButton";
import { CCombobox } from "@m/core/components/CCombobox";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import { CInputString } from "@m/core/components/CInputString";
import { useInput } from "@m/core/hooks/useInput";

export function CDevInputStateTest() {
  const inputStr = useInput("");
  const inputStr2 = useInput("a");

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
  const inputCombo = useInput<number | undefined>();
  const inputCombo2 = useInput<number | undefined>(1);

  const handleClick = useCallback(() => {
    inputStr.onChange("b");
    inputStr2.onChange("");
    inputCombo.onChange(1);
    inputCombo2.onChange(undefined);
  }, [inputCombo, inputCombo2, inputStr, inputStr2]);

  return (
    <CBody title="Dev - Input State Test">
      <CFormPanel>
        <CFormLine label="CInputString">
          <div className="space-y-2">
            <CInputString {...inputStr} required />
            <CInputString {...inputStr2} required />
          </div>
        </CFormLine>
        <CFormLine label="CCombobox">
          <div className="space-y-2">
            <CCombobox list={list} {...inputCombo} required />
            <CCombobox list={list} {...inputCombo2} required />
          </div>
        </CFormLine>
        <CFormFooter>
          <CButton onClick={handleClick} label="Click" />
        </CFormFooter>
      </CFormPanel>
    </CBody>
  );
}
