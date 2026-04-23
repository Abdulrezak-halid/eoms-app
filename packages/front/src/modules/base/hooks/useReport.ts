import { useCallback, useContext, useMemo } from "react";

import { LOCAL_STORAGE_KEY_REPORT_SECTIONS_PREFILL } from "@m/base/constants/LocalStorageKeys";
import {
  IReportQueueSectionType,
  REPORT_QUEUE_SECTION_META,
  isReportQueueSectionType,
} from "@m/base/constants/ReportQueueSectionTypes";
import { useNavigate } from "@m/core/hooks/useNavigate";

import { ContextReport } from "../contexts/ContextReport";
import {
  IReportQueueSection,
  IReportQueueSectionInput,
} from "../interfaces/IReportQueueSection";

export function isReportQueueSection(
  value: unknown,
): value is IReportQueueSection {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const type = typeof record.type === "string" ? record.type : undefined;

  return (
    Boolean(type && isReportQueueSectionType(type)) &&
    typeof record.createdAt === "number"
  );
}

export function parseReportQueueSections(
  raw: string | null,
): IReportQueueSection[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const sections: IReportQueueSection[] = [];
    const typeSet = new Set<string>();

    for (const current of parsed) {
      if (!isReportQueueSection(current)) {
        continue;
      }

      if (typeSet.has(current.type)) {
        continue;
      }

      typeSet.add(current.type);
      sections.push({
        type: current.type,
        createdAt: current.createdAt,
      });
    }

    return sections;
  } catch {
    return [];
  }
}

export function useReport() {
  const navigate = useNavigate();
  const {
    sections,
    addSection,
    removeSectionByType,
    removeSectionsByType,
    clearSections,
    hasSectionType,
  } = useContext(ContextReport);

  const groupedSections = useMemo(() => {
    const groupedMap = sections.reduce(
      (acc, section) => {
        const current = acc[section.type] || [];
        acc[section.type] = [...current, section];
        return acc;
      },
      {} as Record<IReportQueueSectionType, IReportQueueSection[]>,
    );

    return Object.entries(groupedMap).map(([type, items]) => {
      const sectionType = type as IReportQueueSectionType;
      return {
        type: sectionType,
        labelKey: REPORT_QUEUE_SECTION_META[sectionType].labelKey,
        items,
      };
    });
  }, [sections]);

  const addByType = useCallback(
    (data: IReportQueueSectionInput) => {
      return addSection(data);
    },
    [addSection],
  );

  const createReportFromQueue = useCallback(
    (types?: IReportQueueSectionType[]) => {
      const selectedTypes = (types || sections.map((d) => d.type)).filter(
        (d, i, arr) => arr.indexOf(d) === i,
      );
      if (selectedTypes.length === 0) {
        return;
      }

      const selectedSections = sections.filter((d) =>
        selectedTypes.includes(d.type),
      );
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY_REPORT_SECTIONS_PREFILL,
        JSON.stringify(selectedSections),
      );

      navigate("/report/item-add");
      removeSectionsByType(selectedTypes);
    },
    [navigate, removeSectionsByType, sections],
  );

  const consumePrefillSections = useCallback(() => {
    const raw = window.localStorage.getItem(
      LOCAL_STORAGE_KEY_REPORT_SECTIONS_PREFILL,
    );
    window.localStorage.removeItem(LOCAL_STORAGE_KEY_REPORT_SECTIONS_PREFILL);

    return parseReportQueueSections(raw);
  }, []);

  return {
    sections,
    groupedSections,
    addSection,
    addByType,
    removeSectionByType,
    clearSections,
    hasSectionType,
    createReportFromQueue,
    consumePrefillSections,
  };
}
