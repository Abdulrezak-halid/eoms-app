import { IReportSection } from "../interfaces/IReportSection";

export namespace UtilReportSectionControl {
  // Re calculate all section numbers
  export function renumberSections(
    sections: IReportSection[],
  ): IReportSection[] {
    return sections.map((s, i) => ({
      ...s,
      sectionNumber: UtilReportSectionControl.calculateSectionNumber(
        sections,
        i,
      ),
    }));
  }

  // Calculate section number based on depth hierarchy.
  export function calculateSectionNumber(
    sections: IReportSection[],
    currentIndex: number,
  ): string {
    const counters: number[] = [];

    for (let i = 0; i <= currentIndex; i++) {
      const section = sections[i];
      const depth = section.data.depth || 0;

      if (depth > counters.length) {
        throw new Error("Parent depth is missing.");
      }

      while (counters.length <= depth) {
        counters.push(0);
      }

      if (counters.length > depth + 1) {
        counters.length = depth + 1;
      }

      counters[depth]++;
    }

    return counters.join(".") + ".";
  }

  // // Check if section can move up.
  // //   It is not allowed if depths are not the same.
  // export function canMoveUp(
  //   sections: IReportSection[],
  //   index: number,
  // ): boolean {
  //   if (index === 0) {
  //     return false;
  //   }

  //   const currentDepth = sections[index].data.depth || 0;
  //   const previousDepth = sections[index - 1].data.depth || 0;

  //   return currentDepth === previousDepth;
  // }

  // // Check if section can move down.
  // //   It is not allowed if depths are not the same.
  // export function canMoveDown(
  //   sections: IReportSection[],
  //   index: number,
  // ): boolean {
  //   if (index === sections.length - 1) {
  //     return false;
  //   }

  //   const currentDepth = sections[index].data.depth || 0;
  //   const nextDepth = sections[index + 1].data.depth || 0;

  //   return currentDepth === nextDepth;
  // }

  // Check if depth can be increased for a section at given index
  export function canIncreaseDepth(
    sections: IReportSection[],
    index: number,
  ): boolean {
    if (index === 0) {
      return false;
    }

    const currentDepth = sections[index].data.depth || 0;
    const previousDepth = sections[index - 1].data.depth || 0;

    return currentDepth <= previousDepth;
  }

  // Check if depth can be decreased for a section at given index
  export function canDecreaseDepth(
    sections: IReportSection[],
    index: number,
  ): boolean {
    const currentDepth = sections[index].data.depth || 0;
    return currentDepth > 0;
  }

  // Increase depth of section at given index
  export function increaseDepth(
    sections: IReportSection[],
    index: number,
  ): IReportSection[] {
    if (!canIncreaseDepth(sections, index)) {
      return sections;
    }

    const newSections = [...sections];
    const currentDepth = newSections[index].data.depth || 0;
    newSections[index] = {
      ...newSections[index],
      data: {
        ...newSections[index].data,
        depth: currentDepth + 1,
      },
    };

    return renumberSections(newSections);
  }

  // Decrease depth of section at given index
  export function decreaseDepth(
    sections: IReportSection[],
    index: number,
  ): IReportSection[] {
    if (!canDecreaseDepth(sections, index)) {
      return sections;
    }

    const newSections = [...sections];
    const currentDepth = newSections[index].data.depth || 0;
    newSections[index] = {
      ...newSections[index],
      data: {
        ...newSections[index].data,
        depth: Math.max(0, currentDepth - 1),
      },
    };

    return renumberSections(newSections);
  }

  // Normalize depths after section reordering to ensure validity
  export function normalizeSectionDepths(
    sections: IReportSection[],
  ): IReportSection[] {
    const normalized: IReportSection[] = [];

    for (let index = 0; index < sections.length; index++) {
      const section = sections[index];
      const depth = section.data.depth || 0;

      if (index === 0 && depth > 0) {
        normalized.push({ ...section, data: { ...section.data, depth: 0 } });
        continue;
      }

      if (index > 0) {
        const prevDepth = normalized[index - 1].data.depth || 0;
        if (depth > prevDepth + 1) {
          normalized.push({
            ...section,
            data: { ...section.data, depth: prevDepth + 1 },
          });
          continue;
        }
      }

      normalized.push(section);
    }

    return renumberSections(normalized);
  }
}
