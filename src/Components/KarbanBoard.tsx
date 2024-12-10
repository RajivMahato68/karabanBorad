import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Column from "./Column";
import TaskCard from "./TaskCard";
import { Task } from "../types";

export type Id = string | number;

interface ColumnType {
  id: Id;
  title: string;
}

function KarbanBoard() {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  function createNewColumn() {
    const columnToAdd: ColumnType = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    setColumns((prevColumns) => prevColumns.filter((col) => col.id !== id));
    setTasks((prevTasks) => prevTasks.filter((task) => task.columnId !== id));
  }

  function generateId(): Id {
    return Math.floor(Math.random() * 100001);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    } else if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (active.data.current?.type === "Column") {
      setColumns((columns) => {
        const activeIndex = columns.findIndex((col) => col.id === activeId);
        const overIndex = columns.findIndex((col) => col.id === overId);
        return arrayMove(columns, activeIndex, overIndex);
      });
    } else if (active.data.current?.type === "Task") {
      const updatedTasks = tasks.map((task) =>
        task.id === activeTask?.id ? { ...task, columnId: overId } : task
      );
      setTasks(updatedTasks);
    }

    setActiveColumn(null);
    setActiveTask(null);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto flex gap-4">
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                deleteColumn={deleteColumn}
                tasks={tasks.filter((task) => task.columnId === column.id)}
                setTasks={setTasks}
              />
            ))}
          </SortableContext>
          <button
            onClick={createNewColumn}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          >
            <FaPlus className="text-white mt-1" /> Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && <Column column={activeColumn} />}
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KarbanBoard;
