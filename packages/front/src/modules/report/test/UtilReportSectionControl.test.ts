import { describe, expect, it } from "vitest";

import { IReportSection } from "../interfaces/IReportSection";
import { UtilReportSectionControl } from "../utils/UtilReportSectionControl";

describe("UtilReportSectionControl", () => {
  describe("calculateSectionNumber", () => {
    it("should calculate section numbers for flat list", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      expect(UtilReportSectionControl.calculateSectionNumber(sections, 0)).toBe(
        "1.",
      );
      expect(UtilReportSectionControl.calculateSectionNumber(sections, 1)).toBe(
        "2.",
      );
      expect(UtilReportSectionControl.calculateSectionNumber(sections, 2)).toBe(
        "3.",
      );
    });

    it("should calculate section numbers with depth 1", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      expect(UtilReportSectionControl.calculateSectionNumber(sections, 0)).toBe(
        "1.",
      );
      expect(UtilReportSectionControl.calculateSectionNumber(sections, 1)).toBe(
        "1.1.",
      );
      expect(UtilReportSectionControl.calculateSectionNumber(sections, 2)).toBe(
        "2.",
      );
    });

    it("should calculate section numbers with multiple depth 1 items", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
      ];

      expect(UtilReportSectionControl.calculateSectionNumber(sections, 0)).toBe(
        "1.",
      );
      expect(UtilReportSectionControl.calculateSectionNumber(sections, 1)).toBe(
        "1.1.",
      );
      expect(UtilReportSectionControl.calculateSectionNumber(sections, 2)).toBe(
        "1.2.",
      );
    });

    it("should calculate section numbers with depth 2", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 2, title: { type: "PLAIN", value: "" } } },
        { id: 3, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      expect(UtilReportSectionControl.calculateSectionNumber(sections, 0)).toBe(
        "1.",
      );
      expect(UtilReportSectionControl.calculateSectionNumber(sections, 1)).toBe(
        "1.1.",
      );
      expect(UtilReportSectionControl.calculateSectionNumber(sections, 2)).toBe(
        "1.1.1.",
      );
      expect(UtilReportSectionControl.calculateSectionNumber(sections, 3)).toBe(
        "2.",
      );
    });

    it("should throw error for invalid depth jump", () => {
      // Skips depth 1
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 2, title: { type: "PLAIN", value: "" } } },
      ];

      expect(() => {
        UtilReportSectionControl.calculateSectionNumber(sections, 1);
      }).toThrow("Parent depth is missing.");
    });
  });

  describe("canIncreaseDepth", () => {
    it("should not allow depth increase for first item", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];
      expect(UtilReportSectionControl.canIncreaseDepth(sections, 0)).toBe(
        false,
      );
    });

    it("should allow depth increase when previous has same depth", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];
      expect(UtilReportSectionControl.canIncreaseDepth(sections, 1)).toBe(true);
    });

    it("should allow depth increase when previous has greater depth", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];
      expect(UtilReportSectionControl.canIncreaseDepth(sections, 2)).toBe(true);
    });

    it("should not allow depth increase when it would skip levels", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 2, title: { type: "PLAIN", value: "" } } },
      ];
      expect(UtilReportSectionControl.canIncreaseDepth(sections, 1)).toBe(
        false,
      );
    });
  });

  describe("canDecreaseDepth", () => {
    it("should not allow depth decrease when depth is 0", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];
      expect(UtilReportSectionControl.canDecreaseDepth(sections, 0)).toBe(
        false,
      );
    });

    it("should allow depth decrease when depth > 0", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
      ];
      expect(UtilReportSectionControl.canDecreaseDepth(sections, 1)).toBe(true);
    });
  });

  describe("increaseDepth", () => {
    it("should increase depth and renumber sections", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.increaseDepth(sections, 1);

      expect(result[0].data.depth).toBe(0);
      expect(result[0].sectionNumber).toBe("1.");
      expect(result[1].data.depth).toBe(1);
      expect(result[1].sectionNumber).toBe("1.1.");
    });

    it("should not change sections when increase is not allowed", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.increaseDepth(sections, 0);

      expect(result).toEqual(sections);
    });
  });

  describe("decreaseDepth", () => {
    it("should decrease depth and renumber sections", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.decreaseDepth(sections, 1);

      expect(result[0].data.depth).toBe(0);
      expect(result[0].sectionNumber).toBe("1.");
      expect(result[1].data.depth).toBe(0);
      expect(result[1].sectionNumber).toBe("2.");
    });

    it("should not change sections when decrease is not allowed", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.decreaseDepth(sections, 0);

      // Should remain the same (with renumbering applied)
      expect(result[0].data.depth).toBe(0);
    });
  });

  describe("renumberSections", () => {
    it("should renumber all sections based on depth", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 2, title: { type: "PLAIN", value: "" } } },
        { id: 3, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 4, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.renumberSections(sections);

      expect(result[0].sectionNumber).toBe("1.");
      expect(result[1].sectionNumber).toBe("1.1.");
      expect(result[2].sectionNumber).toBe("1.1.1.");
      expect(result[3].sectionNumber).toBe("1.2.");
      expect(result[4].sectionNumber).toBe("2.");
    });
  });

  describe("Example use cases from requirements", () => {
    it("should handle the first example: increment depth of B", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.increaseDepth(sections, 1);

      expect(result[0].sectionNumber).toBe("1.");
      expect(result[1].sectionNumber).toBe("1.1.");
      expect(result[1].data.depth).toBe(1);
      expect(result[2].sectionNumber).toBe("2.");
    });

    it("should handle the second example: increment depth of C after B", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.increaseDepth(sections, 2);

      expect(result[0].sectionNumber).toBe("1.");
      expect(result[1].sectionNumber).toBe("1.1.");
      expect(result[2].sectionNumber).toBe("1.2.");
      expect(result[2].data.depth).toBe(1);
    });

    it("should handle the third example: increment depth of C to depth 2", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.increaseDepth(sections, 2);

      expect(result[0].sectionNumber).toBe("1.");
      expect(result[1].sectionNumber).toBe("1.1.");
      expect(result[2].sectionNumber).toBe("1.1.1.");
      expect(result[2].data.depth).toBe(2);
    });
  });

  describe("normalizeSectionDepths", () => {
    it("should reset first section to depth 0", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.normalizeSectionDepths(sections);

      expect(result[0].data.depth).toBe(0);
      expect(result[0].sectionNumber).toBe("1.");
      expect(result[1].data.depth).toBe(0);
      expect(result[1].sectionNumber).toBe("2.");
    });

    it("should clamp depth that exceeds previous + 1", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        // Bad depth
        { id: 1, data: { depth: 3, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.normalizeSectionDepths(sections);

      expect(result[0].data.depth).toBe(0);
      expect(result[1].data.depth).toBe(1); // clamped from 3 to 1
      expect(result[1].sectionNumber).toBe("1.1.");
    });

    it("should handle the reported bug: moving subsection to first position", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.normalizeSectionDepths(sections);

      expect(result[0].data.depth).toBe(0);
      expect(result[0].sectionNumber).toBe("1.");
      expect(result[1].data.depth).toBe(0);
      expect(result[1].sectionNumber).toBe("2.");
    });

    it("should preserve valid depth structure", () => {
      const sections: IReportSection[] = [
        { id: 0, data: { depth: 0, title: { type: "PLAIN", value: "" } } },
        { id: 1, data: { depth: 1, title: { type: "PLAIN", value: "" } } },
        { id: 2, data: { depth: 2, title: { type: "PLAIN", value: "" } } },
      ];

      const result = UtilReportSectionControl.normalizeSectionDepths(sections);

      expect(result[0].data.depth).toBe(0);
      expect(result[1].data.depth).toBe(1);
      expect(result[2].data.depth).toBe(2);
    });
  });
});
