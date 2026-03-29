import { IDtoEEnergyResource } from "common/build-api-schema";
import { CornerDownRight } from "lucide-react";
import { useCallback, useMemo } from "react";

import { Api, InferApiGetResponse } from "@m/base/api/Api";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { useUnitInfo } from "@m/base/hooks/useUnitMultiplierAndAbbr";
import {
  CAsyncLoader,
  IExtractAsyncData,
} from "@m/core/components/CAsyncLoader";
import { CBadge } from "@m/core/components/CBadge";
import { CBadgePercentage } from "@m/core/components/CBadgePercentage";
import { CCard } from "@m/core/components/CCard";
import { CCheckbox } from "@m/core/components/CCheckbox";
import { CDisplayNumber } from "@m/core/components/CDisplayNumber";
import { CIcon } from "@m/core/components/CIcon";
import { useLoaderMiddleware, useLoaderMulti } from "@m/core/hooks/useLoader";
import { useTranslation } from "@m/core/hooks/useTranslation";

interface ISelectionValue {
  departmentIds: string[];
  meterSliceIds: string[];
}

interface ICSeuDepartmentMeterTreeProps {
  value: ISelectionValue;
  onChange: (value: ISelectionValue) => void;
  onInvalidMsg?: (msg: string) => void;
  disabled?: boolean;
  energyResource?: IDtoEEnergyResource;
}

type IDtoMeterSlice =
  InferApiGetResponse<"/u/measurement/meter/slice">["records"][number];
type IDtoDepartment =
  InferApiGetResponse<"/u/base/department/item">["records"][number];

export function CSeuDepartmentAndMeterSliceChecklist({
  value,
  onChange,
  disabled = false,
  energyResource,
}: ICSeuDepartmentMeterTreeProps) {
  const range = useGlobalDatetimeRange();

  const fetcher = useCallback(async () => {
    return {
      departments: await Api.GET("/u/base/department/item"),
      meterSlices: !energyResource
        ? undefined
        : await Api.GET("/u/measurement/meter/slice", {
            params: {
              query: {
                energyResource,
                nonMainOnly: "true",
                ...range,
              },
            },
          }),
    };
  }, [energyResource, range]);

  const [data] = useLoaderMulti(fetcher);

  const middleware = useCallback((payload: IExtractAsyncData<typeof data>) => {
    const allDepartments = payload.departments.records;
    const meterSlices = payload.meterSlices?.records || [];

    const meterSlicesByDeptId = new Map<string, IDtoMeterSlice[]>();

    meterSlices.forEach((meterSlice) => {
      const deptId = meterSlice.department.id;
      const existing = meterSlicesByDeptId.get(deptId) || [];
      existing.push(meterSlice);
      meterSlicesByDeptId.set(deptId, existing);
    });

    return allDepartments
      .map((dept) => ({
        department: dept,
        slices: meterSlicesByDeptId.get(dept.id) || [],
      }))
      .sort((a, b) => a.department.name.localeCompare(b.department.name));
  }, []);

  const processedData = useLoaderMiddleware(data, middleware);

  return (
    <CAsyncLoader data={processedData} inline>
      {(payload) => (
        <div className="flex flex-col space-y-2">
          {payload.map(({ department, slices }) => (
            <CSeuDepartmentAndMeterSliceChecklistSection
              key={department.id}
              allData={payload}
              department={department}
              slices={slices}
              onChange={onChange}
              value={value}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </CAsyncLoader>
  );
}

function CSeuDepartmentAndMeterSliceChecklistSection({
  allData,
  department,
  slices,
  value,
  onChange,
  disabled,
}: {
  allData: {
    department: IDtoDepartment;
    slices: IDtoMeterSlice[];
  }[];
  department: IDtoDepartment;
  slices: IDtoMeterSlice[];
  value: ISelectionValue;
  onChange: (value: ISelectionValue) => void;
  disabled: boolean;
}) {
  const { t } = useTranslation();

  const { abbr, multiplier } = useUnitInfo("ENERGY");

  const isDeptSelected = useMemo(
    () => value.departmentIds.includes(department.id),
    [department.id, value.departmentIds],
  );

  const isSemiSelected = useMemo(() => {
    if (value.departmentIds.includes(department.id)) {
      return false;
    }
    const meterIds = slices.map((m) => m.id);
    const selectedMetersCount = meterIds.filter((id) =>
      value.meterSliceIds.includes(id),
    ).length;
    return selectedMetersCount > 0;
  }, [department.id, slices, value.departmentIds, value.meterSliceIds]);

  const handleDepartmentClick = useCallback(
    (deptId: string, isSelected: boolean) => {
      const deptMeters =
        allData.find((d) => d.department.id === deptId)?.slices || [];

      if (isSelected) {
        const meterIds = deptMeters.map((m) => m.id);

        onChange({
          departmentIds: [...value.departmentIds, deptId],
          meterSliceIds: [
            ...value.meterSliceIds.filter((id) => !meterIds.includes(id)),
          ],
        });
      } else {
        onChange({
          departmentIds: value.departmentIds.filter((id) => id !== deptId),
          meterSliceIds: value.meterSliceIds.filter(
            (id) => !deptMeters.some((m) => m.id === id),
          ),
        });
      }
    },
    [allData, onChange, value.departmentIds, value.meterSliceIds],
  );

  const handleMeterSliceClick = useCallback(
    (
      meter: { id: string; department: { id: string } },
      isSelected: boolean,
    ) => {
      if (value.departmentIds.includes(meter.department.id)) {
        return;
      }

      if (isSelected) {
        onChange({
          ...value,
          meterSliceIds: [...value.meterSliceIds, meter.id],
        });
      } else {
        onChange({
          ...value,
          meterSliceIds: value.meterSliceIds.filter((id) => id !== meter.id),
        });
      }
    },
    [onChange, value],
  );

  return (
    <CCard key={department.id} className="flex flex-col pl-2 p-2">
      <div className="flex items-center justify-between">
        <CCheckbox
          value={department.id}
          selected={isDeptSelected}
          semiSelected={isSemiSelected}
          onClick={handleDepartmentClick}
          label={department.name}
          disabled={disabled}
          truncateLabel
        />
        {slices.length > 0 && (
          <CBadge value={`${slices.length} ${t("meters")}`} />
        )}
      </div>

      {slices.map((slice) => (
        <div key={slice.id} className="flex items-center">
          <div className="w-12 flex-none flex justify-center">
            <CIcon
              value={CornerDownRight}
              className="text-gray-400 dark:text-gray-500"
            />
          </div>

          <CCheckbox
            value={slice}
            selected={isDeptSelected || value.meterSliceIds.includes(slice.id)}
            onClick={handleMeterSliceClick}
            disabled={disabled || isDeptSelected}
            label={slice.name}
            truncateLabel
          />

          <div className="ml-auto pl-3 flex items-center gap-3">
            {slice.consumption !== null && (
              <div className="flex flex-col">
                <CDisplayNumber
                  value={slice.consumption * multiplier}
                  unitStr={abbr}
                  maxDecimals={2}
                  minDecimals={0}
                />
              </div>
            )}
            {slice.consumptionPercentage !== null &&
              slice.consumptionPercentage !== undefined && (
                <CBadgePercentage
                  value={slice.consumptionPercentage}
                  description={t("consumptionRate")}
                />
              )}
          </div>
        </div>
      ))}
    </CCard>
  );
}
