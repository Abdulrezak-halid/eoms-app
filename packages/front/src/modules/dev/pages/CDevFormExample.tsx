import { useCallback, useMemo } from "react";
import { Save } from "lucide-react";

import { CBody } from "@m/base/components/CBody";
import { CButton } from "@m/core/components/CButton";
import { CCombobox } from "@m/core/components/CCombobox";
import { CForm } from "@m/core/components/CForm";
import {
  CFormFooter,
  CFormLine,
  CFormPanel,
} from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CInputString } from "@m/core/components/CInputString";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";

export function CDevFormExample() {
  const comboList = useMemo(
    () => [
      { label: "Combo Label 1", value: 1 },
      { label: "Combo Label 2", value: 2 },
    ],
    [],
  );

  const inputString = useInput("");
  const inputNumber = useInput<number>();
  const inputCombo = useInput<number>();
  const invalid = useInputInvalid(inputString, inputNumber, inputCombo);

  const handleSubmit = useCallback(async () => {
    if (invalid) {
      return;
    }

    await new Promise((res) => {
      setTimeout(res, 1000);
    });

    alert(
      `Value1: ${inputString.value} Value2: ${inputNumber.value} Value3: ${inputCombo.value}`,
    );
  }, [inputString, inputNumber, inputCombo, invalid]);

  return (
    <CBody title="Dev - Form Submit Example">
      <div>Form - Basic Example</div>
      <CForm onSubmit={handleSubmit}>
        <CFormPanel>
          <CFormLine label="Input String" invalidMsg={inputString.invalidMsg}>
            <CInputString
              {...inputString}
              placeholder="Input String Placeholder"
              required
            />
          </CFormLine>

          <CFormLine label="Input Number" invalidMsg={inputNumber.invalidMsg}>
            <CInputNumber
              {...inputNumber}
              placeholder="Input Number Placeholder"
              required
            />
          </CFormLine>

          <CFormLine label="Input Combobox" invalidMsg={inputCombo.invalidMsg}>
            <CCombobox
              list={comboList}
              {...inputCombo}
              placeholder="Input Combobox Placeholder"
              required
            />
          </CFormLine>

          <CFormFooter>
            <CButton
              icon={Save}
              label="Submit"
              submit
              primary
              disabled={invalid}
            />
          </CFormFooter>
        </CFormPanel>
      </CForm>
    </CBody>
  );
}
