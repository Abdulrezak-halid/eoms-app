import { DropResult } from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";

import { Api } from "@m/base/api/Api";
import { useApiToast } from "@m/base/hooks/useApiToast";

import { IDtoWidgetResponse } from "../interfaces/IDtoDashboard";

type Columns = Record<string, IDtoWidgetResponse[]>;

export function useDraggableDashboard(
  initialWidgets: IDtoWidgetResponse[],
  load: () => Promise<void>,
) {
  const apiToast = useApiToast();
  const [columns, setColumns] = useState<Columns>({ "col-0": [], "col-1": [] });

  useEffect(() => {
    const col0Widgets = initialWidgets
      .filter((widget) => widget.column === 0)
      .sort((a, b) => a.index - b.index);

    const col1Widgets = initialWidgets
      .filter((widget) => widget.column === 1)
      .sort((a, b) => a.index - b.index);

    setColumns({
      "col-0": col0Widgets,
      "col-1": col1Widgets,
    });
  }, [initialWidgets]);

  const handleOnDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }

      const sourceColId = source.droppableId;
      const destColId = destination.droppableId;
      const updatedColumns = { ...columns };

      if (sourceColId === destColId) {
        const items = Array.from(updatedColumns[sourceColId]);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        updatedColumns[sourceColId] = items;
      } else {
        const sourceItems = Array.from(updatedColumns[sourceColId]);
        const destItems = Array.from(updatedColumns[destColId]);
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        updatedColumns[sourceColId] = sourceItems;
        updatedColumns[destColId] = destItems;
      }

      setColumns(updatedColumns);

      const movedWidgetId = result.draggableId;
      const finalApiIndex = updatedColumns[destColId].findIndex(
        (w) => w.id === movedWidgetId,
      );

      const res = await Api.PUT("/u/dashboard/widget/item/{id}/position", {
        body: {
          index: finalApiIndex,
          column: destColId === "col-0" ? 0 : 1,
        },
        params: { path: { id: movedWidgetId } },
      });

      if (res.error) {
        apiToast(res);
        await load();
      }
    },
    [columns, apiToast, load],
  );

  return { columns, handleOnDragEnd };
}
