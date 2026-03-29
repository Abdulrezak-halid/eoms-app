import { Paintbrush, Plus } from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useContext, useMemo, useState } from "react";
import { useParams } from "wouter";

import { Api } from "@m/base/api/Api";
import { CBody } from "@m/base/components/CBody";
import { IBreadCrumb } from "@m/base/components/CBreadCrumbs";
import { useApiToast } from "@m/base/hooks/useApiToast";
import { useGlobalDatetimeRange } from "@m/base/hooks/useGlobalDatetimeRange";
import { CAsyncLoader } from "@m/core/components/CAsyncLoader";
import { CButton } from "@m/core/components/CButton";
import { CFixedFormWidth } from "@m/core/components/CFixedFormWidth";
import { CForm } from "@m/core/components/CForm";
import { CInvalidMsg } from "@m/core/components/CInvalidMsg";
import { CLine } from "@m/core/components/CLine";
import { CMutedText } from "@m/core/components/CMutedText";
import { CNoRecord } from "@m/core/components/CNoRecord";
import { ContextAreYouSure } from "@m/core/contexts/ContextAreYouSure";
import { useLoader } from "@m/core/hooks/useLoader";
import { useNavigate } from "@m/core/hooks/useNavigate";
import { useTranslation } from "@m/core/hooks/useTranslation";

import { CMeterSaveSliceFormSliceLineItem } from "../components/CMeterSaveSliceFormSliceLineItem";
import {
  IDtoMeterResponse,
  IDtoMeterSaveSliceRequest,
} from "../interfaces/IDtoMeter";

interface ISliceItem {
  id?: string;
  rate: number | undefined;
  departmentId: string | undefined;
  isMain: boolean;
  localId: string;
}

export function CMeterSliceSaveForm() {
  const { t } = useTranslation();
  const { id: paramId } = useParams();
  const id = paramId || "";

  const range = useGlobalDatetimeRange();

  const fetcher = useCallback(async () => {
    const res = await Api.GET("/u/measurement/meter/item/{id}", {
      params: { path: { id }, query: range },
    });
    return res;
  }, [range, id]);

  const [data] = useLoader<IDtoMeterResponse>(fetcher);

  const breadcrumbs = useMemo<IBreadCrumb[]>(
    () => [
      { label: t("meters"), path: "/measurements/meter" },
      { label: data.payload?.name, dynamic: true },
      { label: t("slices") },
    ],
    [data.payload?.name, t],
  );

  return (
    <CBody breadcrumbs={breadcrumbs}>
      <CAsyncLoader data={data}>
        {(payload) => <SliceForm initialData={payload} id={id} />}
      </CAsyncLoader>
    </CBody>
  );
}

function SliceForm({
  initialData,
  id,
}: {
  initialData: IDtoMeterResponse;
  id: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const apiToast = useApiToast();

  const [slices, setSlices] = useState<ISliceItem[]>(() => {
    const existingSlices =
      initialData.slices.map((d) => ({
        id: d.id,
        rate: d.rate * 100,
        departmentId: d.department.id,
        isMain: d.isMain,
        localId: nanoid(),
      })) || [];

    if (existingSlices.length === 0) {
      return [
        {
          id: undefined,
          rate: 100,
          departmentId: undefined,
          isMain: false,
          localId: nanoid(),
        },
      ];
    }

    return existingSlices;
  });
  const totalPercent = useMemo(
    () => slices.reduce((sum, d) => sum + (d.rate || 0), 0),
    [slices],
  );

  const invalidSliceTotalPercentage = slices.length > 0 && totalPercent !== 100;
  const invalidSliceHasZero = useMemo(
    () => slices.some((s) => s.rate === undefined || s.rate <= 0),
    [slices],
  );
  const invalidSliceMissing = useMemo(
    () => slices.some((s) => !s.departmentId),
    [slices],
  );
  const invalidClearSlice = useMemo(() => slices.length === 0, [slices]);
  const usedDepartmentIds = useMemo(
    () => slices.map((s) => s.departmentId).filter(Boolean) as string[],
    [slices],
  );

  const invalid =
    invalidSliceTotalPercentage || invalidSliceHasZero || invalidSliceMissing;

  const handleAddSlice = useCallback(() => {
    setSlices((prev) => [
      ...prev,
      {
        id: undefined,
        rate: prev.length === 0 ? 100 : 0,
        departmentId: undefined,
        isMain: false,
        localId: nanoid(),
      },
    ]);
  }, []);

  const { push } = useContext(ContextAreYouSure);

  const handleClearSlice = useCallback(async () => {
    await push(t("msgSlicesWillBeRemoved"), () => {
      setSlices([]);
    });
  }, [push, t]);

  const sliceCallbacks = useMemo(() => {
    const deleteCallbacks: Record<number, () => void> = {};
    const deptChangeCallbacks: Record<
      number,
      (newDeptId: string | undefined) => void
    > = {};
    const percentChangeCallbacks: Record<
      number,
      (newPercent: number | undefined) => void
    > = {};
    const isMainChangeCallbacks: Record<number, (isMain: boolean) => void> = {};

    slices.forEach((_d, index) => {
      deleteCallbacks[index] = () => {
        setSlices((prev) => {
          const next = prev.filter((_, i) => i !== index);
          if (next.length === 1) {
            return [
              {
                ...next[0],
                rate: 100,
              },
            ];
          }
          return next.map((s) => ({ ...s }));
        });
      };
      deptChangeCallbacks[index] = (newDeptId) =>
        setSlices((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, departmentId: newDeptId } : item,
          ),
        );

      percentChangeCallbacks[index] = (newPercent) => {
        setSlices((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, rate: newPercent } : item,
          ),
        );
      };

      isMainChangeCallbacks[index] = (isMain) => {
        setSlices((prev) =>
          prev.map((item, i) => (i === index ? { ...item, isMain } : item)),
        );
      };
    });

    return {
      deleteCallbacks,
      deptChangeCallbacks,
      percentChangeCallbacks,
      isMainChangeCallbacks,
    };
  }, [slices]);

  const handleSubmit = useCallback(async () => {
    if (invalid) {
      return;
    }

    const body: IDtoMeterSaveSliceRequest = slices.map((d) => ({
      id: d.id || undefined,
      rate: !d.rate ? 0 : d.rate / 100,
      departmentId: d.departmentId!,
      isMain: d.isMain,
    }));

    const res = await Api.POST("/u/measurement/meter/slice/{meterId}", {
      params: { path: { meterId: id } },
      body,
    });

    apiToast(res);

    if (!res.error) {
      navigate("/measurements/meter");
    }
  }, [invalid, slices, apiToast, navigate, id]);

  return (
    <CForm onSubmit={handleSubmit}>
      <CFixedFormWidth className="space-y-2">
        <div className="flex flex-col gap-2">
          {slices.length > 0 && (
            <div className="flex gap-2 font-bold">
              <div className="w-12 text-center">
                <CMutedText value={t("main")} />
              </div>
              <div className="grow">
                <CMutedText value={t("department")} />
              </div>
              <div className="w-28">
                <CMutedText value={t("percentWithSign")} />
              </div>
              <div className="w-12" />
            </div>
          )}
          {slices.length === 0 && <CNoRecord className="py-8" />}
          {slices.map((slice, index) => (
            <CMeterSaveSliceFormSliceLineItem
              key={slice.localId}
              departmentId={slice.departmentId}
              percent={slice.rate}
              isMain={slice.isMain}
              onDelete={sliceCallbacks.deleteCallbacks[index]}
              onDepartmentChange={sliceCallbacks.deptChangeCallbacks[index]}
              onPercentChange={sliceCallbacks.percentChangeCallbacks[index]}
              onIsMainChange={sliceCallbacks.isMainChangeCallbacks[index]}
              usedDepartmentIds={usedDepartmentIds}
              invalidPercent={invalidSliceTotalPercentage}
            />
          ))}
        </div>

        <div>
          <CInvalidMsg
            value={
              invalidSliceMissing
                ? t("required")
                : invalidSliceTotalPercentage
                  ? t("totalPercentMustBe100")
                  : invalidSliceHasZero
                    ? t("eachSliceMustHaveAPercentageValueGreaterThan0")
                    : undefined
            }
          />
          <CLine className="flex justify-end space-x-2">
            <CButton
              icon={Paintbrush}
              label={t("clear")}
              disabled={invalidClearSlice}
              onClick={handleClearSlice}
            />
            <CButton
              icon={Plus}
              label={t("addSlice")}
              onClick={handleAddSlice}
            />
          </CLine>
        </div>

        <div className="flex justify-end">
          <CButton primary submit label={t("save")} disabled={invalid} />
        </div>
      </CFixedFormWidth>
    </CForm>
  );
}
