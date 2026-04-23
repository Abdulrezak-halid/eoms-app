import { useCallback, useEffect, useMemo, useState } from "react";

import { CComboboxCity } from "@m/base/components/CComboboxCity";
import { CMap } from "@m/base/components/CMap";
import { IMapLocation } from "@m/base/interfaces/IMapLocation";
import { CFormLine, CFormPanel } from "@m/core/components/CFormPanel";
import { CInputNumber } from "@m/core/components/CInputNumber";
import { CRadioGroup } from "@m/core/components/CRadioGroup";
import { useInput, useInputInvalid } from "@m/core/hooks/useInput";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { IDtoOutboundIntegrationParamWeatherApi } from "../interfaces/IDtoOutboundIntegration";

const DEFAULT_BASE_TEMP = 18.3;

export function COutboundIntegrationSubFormWeatherApi({
  value,
  onChange,
  onChangeInvalid,
}: {
  value?: IDtoOutboundIntegrationParamWeatherApi;
  onChange: (value: IDtoOutboundIntegrationParamWeatherApi) => void;
  onChangeInvalid: (isValid: boolean) => void;
}) {
  const { t } = useTranslation();

  const queryTypeOptions = useMemo(
    () =>
      [
        { value: "CITY", label: t("city") },
        { value: "LAT_LONG", label: t("coordinate") },
      ] as const,
    [t],
  );

  const parseCoordinates = useCallback(
    (query?: string): IMapLocation | undefined => {
      if (!query) {
        return undefined;
      }
      const parts = query.split(",");
      if (parts.length !== 2) {
        return undefined;
      }

      const lat = parseFloat(parts[0]);
      const long = parseFloat(parts[1]);
      return !isNaN(lat) && !isNaN(long) ? { lat, long } : undefined;
    },
    [],
  );

  const inputSelectionType = useInput(value?.queryType ?? "CITY");
  const inputCity = useInput(
    value?.queryType === "CITY" ? value.query : undefined,
  );
  const [selectedLocation, setSelectedLocation] = useState<
    IMapLocation | undefined
  >(
    parseCoordinates(value?.queryType === "LAT_LONG" ? value.query : undefined),
  );
  const inputBaseTemp = useInput<number | undefined>(
    value?.baseTemp ?? DEFAULT_BASE_TEMP,
  );

  const isCityInvalid = useInputInvalid(inputCity);
  const isLocationInvalid = !selectedLocation;
  const isBaseTempInvalid = useInputInvalid(inputBaseTemp);

  const handleQueryTypeChange = useCallback(
    (val: "CITY" | "LAT_LONG") => {
      inputSelectionType.setValue(val);
    },
    [inputSelectionType],
  );

  const invalid = useMemo(() => {
    if (isBaseTempInvalid) {
      return true;
    }
    switch (inputSelectionType.value) {
      case "CITY":
        return isCityInvalid;
      case "LAT_LONG":
        return isLocationInvalid;
      default:
        return true;
    }
  }, [
    isBaseTempInvalid,
    inputSelectionType.value,
    isCityInvalid,
    isLocationInvalid,
  ]);

  useEffect(() => {
    onChangeInvalid(invalid);
  }, [invalid, onChangeInvalid]);

  useEffect(() => {
    if (invalid || !inputBaseTemp.value) {
      return;
    }

    if (inputSelectionType.value === "CITY" && inputCity.value) {
      onChange({
        queryType: "CITY",
        query: inputCity.value,
        baseTemp: inputBaseTemp.value,
      });
      return;
    }

    if (inputSelectionType.value === "LAT_LONG" && selectedLocation) {
      onChange({
        queryType: "LAT_LONG",
        query: `${selectedLocation.lat},${selectedLocation.long}`,
        baseTemp: inputBaseTemp.value,
      });
      return;
    }
  }, [
    inputSelectionType.value,
    inputCity.value,
    inputBaseTemp.value,
    invalid,
    onChange,
    selectedLocation,
  ]);

  return (
    <CFormPanel>
      <CFormLine label={t("selectionType")}>
        <CRadioGroup
          list={queryTypeOptions}
          value={inputSelectionType.value}
          onChange={handleQueryTypeChange}
          inline
        />
      </CFormLine>

      <div className={inputSelectionType.value === "CITY" ? "" : "hidden"}>
        <CFormLine label={t("city")} invalidMsg={inputCity.invalidMsg}>
          <CComboboxCity {...inputCity} required />
        </CFormLine>
      </div>

      {inputSelectionType.value === "LAT_LONG" && (
        <CFormLine
          invalidMsg={
            isLocationInvalid ? t("msgPleaseSelectLocation") : undefined
          }
        >
          <CMap value={selectedLocation} onChange={setSelectedLocation} />
        </CFormLine>
      )}

      <CFormLine label={t("baseTemp")} invalidMsg={inputBaseTemp.invalidMsg}>
        <CInputNumber
          float
          {...inputBaseTemp}
          placeholder={t("baseTemp")}
          required
        />
      </CFormLine>
    </CFormPanel>
  );
}
