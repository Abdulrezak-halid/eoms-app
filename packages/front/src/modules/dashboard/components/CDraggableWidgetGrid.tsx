import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { CSSProperties, useRef } from "react";

import { IDtoWidgetResponse } from "../interfaces/IDtoDashboard";
import { CWidgetEditForm } from "../pages/CWidgetEditForm";

type IColumns = Record<string, IDtoWidgetResponse[]>;

interface IProps {
  columns: IColumns;
  onDragEnd: (result: DropResult) => void;
  onUpdate: () => void;
  onDelete: () => void;
  datetimeMin?: string;
  datetimeMax?: string;
}

export function CDraggableWidgetGrid({
  columns,
  onDragEnd,
  onUpdate,
  onDelete,
}: IProps) {
  // hide-overflow-workaround: Some workaround is applied to hide overflowed
  //   draggable widgets. It works with `fixed` normaly but it cannot be
  //   hidden.
  const refContainer = useRef<HTMLDivElement | null>(null);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        // See "hide-overflow-workaround" for ref and relative usage
        ref={refContainer}
        className="flex flex-col @lg:flex-row @lg:space-x-4 relative"
      >
        {Object.entries(columns).map(([colId, colWidgets]) => (
          <Droppable key={colId} droppableId={colId}>
            {(droppableProvided) => (
              <div
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                className="w-full @lg:w-1/2 flex flex-col min-w-0"
              >
                {colWidgets.map((widget, index) => (
                  <Draggable
                    key={widget.id}
                    draggableId={widget.id}
                    index={index}
                  >
                    {(draggableProvided, snapshot) => {
                      const containerSize =
                        refContainer.current?.getBoundingClientRect() || {
                          top: 0,
                          left: 0,
                        };

                      return (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          className="mb-4"
                          // See "hide-overflow-workaround" for style override
                          style={
                            snapshot.isDragging
                              ? {
                                  ...draggableProvided.draggableProps.style,
                                  position: "absolute",
                                  left:
                                    parseInt(
                                      (
                                        draggableProvided.draggableProps
                                          .style as CSSProperties
                                      )?.left as string,
                                    ) - containerSize.left,
                                  top:
                                    parseInt(
                                      (
                                        draggableProvided.draggableProps
                                          .style as CSSProperties
                                      )?.top as string,
                                    ) - containerSize.top,
                                }
                              : draggableProvided.draggableProps.style
                          }
                        >
                          <CWidgetEditForm
                            widget={widget}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            provided={draggableProvided}
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
