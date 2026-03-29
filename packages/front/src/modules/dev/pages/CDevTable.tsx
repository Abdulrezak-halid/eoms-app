import { useMemo } from "react";

import { CBody } from "@m/base/components/CBody";
import { CTable } from "@m/core/components/CTable";

export function CDevTable() {
  const header = useMemo(
    () => [
      { label: "Col 1" },
      { label: "Col 2 - hideSm", hideSm: true },
      { label: "Col 3 - right", right: true },
      {},
    ],
    [],
  );

  return (
    <CBody title="Dev - Table Example">
      <div>Table Example</div>
      <CTable header={header}>
        {new Array(4)
          .fill(null)
          .map((_, iRow) =>
            new Array(4).fill(null).map((__, iCol) => `Data ${iRow}.${iCol}`),
          )}
      </CTable>

      <div>Table With No Records</div>
      <div className="space-y-4">
        <div>Table With Empty Array</div>
        <CTable header={header}>{[]}</CTable>
        <div>Table Without Children</div>
        <CTable header={header} />
      </div>
    </CBody>
  );
}
