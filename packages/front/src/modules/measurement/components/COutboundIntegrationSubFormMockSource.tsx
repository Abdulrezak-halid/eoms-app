/**
 * @file: COutboundIntegrationSubFormMockSource.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 15.07.2025
 * Last Modified Date: 15.07.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { CButton } from "@m/core/components/CButton";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CLine } from "@m/core/components/CLine";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoOutboundIntegrationParamMockSource } from "../interfaces/IDtoOutboundIntegration";

type IWaveState = {
  vMul: number | undefined;
  hMul: number | undefined;
  vMulInvalidMsg?: string;
  hMulInvalidMsg?: string;
};

export function COutboundIntegrationSubFormMockSource({
  value,
  onChange,
  onChangeInvalid,
}: {
  value?: IDtoOutboundIntegrationParamMockSource;
  onChange: (value: IDtoOutboundIntegrationParamMockSource) => void;
  onChangeInvalid: (invalid: boolean) => void;
}) {
  const { t } = useTranslation();

  const [waves, setWaves] = useState<IWaveState[]>(
    () => value?.waves || [{ vMul: undefined, hMul: undefined }],
  );

  useEffect(() => {
    const invalidWave = waves.find(
      (wave) => wave.vMulInvalidMsg || wave.hMulInvalidMsg,
    );
    if (invalidWave) {
      onChangeInvalid(true);
      return;
    }
    onChangeInvalid(false);
    onChange({
      waves: waves as IDtoOutboundIntegrationParamMockSource["waves"],
    });
  }, [waves, onChange, onChangeInvalid]);

  const handleWaveAdd = useCallback(() => {
    setWaves((d) => [...d, { vMul: undefined, hMul: undefined }]);
    onChangeInvalid(true);
  }, [onChangeInvalid]);

  const handleWaveRemove = useCallback((index: number) => {
    setWaves((d) => {
      const newD = [...d];
      newD.splice(index, 1);
      return newD;
    });
  }, []);

  const handleWaveChange = useCallback((index: number, v: IWaveState) => {
    setWaves((d) => {
      const newD = [...d];
      newD[index] = v;
      return newD;
    });
  }, []);

  return (
    <CFormPanel>
      <CFormLine label={t("waves")}>
        <div className="space-y-2">
          {waves.map((_, i) => (
            <CWaveLine
              key={i}
              index={i}
              waves={waves}
              onChange={handleWaveChange}
              onRemove={handleWaveRemove}
            />
          ))}

          <div className="text-right">
            <CButton
              icon={Plus}
              label={t("addWave")}
              onClick={handleWaveAdd}
            />
          </div>
        </div>
      </CFormLine>
    </CFormPanel>
  );
}

function CWaveLine({
  index,
  waves,
  onChange,
  onRemove,
}: {
  index: number;
  waves: IWaveState[];
  onChange: (index: number, value: IWaveState) => void;
  onRemove: (index: number) => void;
}) {
  const { t } = useTranslation();

  const value = waves[index];

  const handleVMulChange = useCallback(
    (v: number | undefined) => {
      onChange(index, {
        vMul: v,
        hMul: value.hMul,
        vMulInvalidMsg: value.vMulInvalidMsg,
        hMulInvalidMsg: value.hMulInvalidMsg,
      });
    },
    [index, onChange, value.hMul, value.hMulInvalidMsg, value.vMulInvalidMsg],
  );

  const handleHMulChange = useCallback(
    (v: number | undefined) => {
      onChange(index, {
        vMul: value.vMul,
        hMul: v,
        vMulInvalidMsg: value.vMulInvalidMsg,
        hMulInvalidMsg: value.hMulInvalidMsg,
      });
    },
    [index, onChange, value.hMulInvalidMsg, value.vMul, value.vMulInvalidMsg],
  );

  const handleVMulInvalidChange = useCallback(
    (msg: string) => {
      onChange(index, {
        vMul: value.vMul,
        hMul: value.hMul,
        vMulInvalidMsg: msg,
        hMulInvalidMsg: value.hMulInvalidMsg,
      });
    },
    [index, onChange, value.hMul, value.hMulInvalidMsg, value.vMul],
  );

  const handleHMulInvalidChange = useCallback(
    (msg: string) => {
      onChange(index, {
        vMul: value.vMul,
        hMul: value.hMul,
        vMulInvalidMsg: value.vMulInvalidMsg,
        hMulInvalidMsg: msg,
      });
    },
    [index, onChange, value.hMul, value.vMul, value.vMulInvalidMsg],
  );

  return (
    <CLine className="space-x-2">
      <CInputNumber
        placeholder={t("verticalMultiplier")}
        value={value.vMul}
        onChange={handleVMulChange}
        onInvalidMsg={handleVMulInvalidChange}
        float
        required
      />
      <CInputNumber
        placeholder={t("horizontalMultiplier")}
        value={value.hMul}
        onChange={handleHMulChange}
        onInvalidMsg={handleHMulInvalidChange}
        float
        required
      />
      <CButton
        icon={Trash2}
        value={index}
        onClick={onRemove}
        disabled={waves.length === 1}
      />
    </CLine>
  );
}
