import { MdDelete } from "react-icons/md";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { PiPlus } from "react-icons/pi";
import { column, Id, Task } from "../types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  column: {
    id: number | string;
    title: string;
  };
  deleteColumn: (id: number | string) => void;
  updateColumn: (id: number | string, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}

function Column({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  deleteTask,
  updateTask,
  tasks,
}: ColumnProps) {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border-rose-500 border-2 opacity-40"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* Column Header */}
      <div
        onClick={() => {
          setEditMode(true);
        }}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 border-columnBackgroundColor border-4 font-bold flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          <div>
            {!editMode && column.title}
            {editMode && (
              <input
                className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                value={newTitle} // Use newTitle for state management
                onChange={(e) => setNewTitle(e.target.value)} // Update local state
                autoFocus
                onBlur={() => {
                  setEditMode(false);
                  updateColumn(column.id, newTitle); // Update title in parent on blur
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditMode(false);
                    updateColumn(column.id, newTitle); // Update title in parent on Enter
                  }
                }}
              />
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering onClick of the column
            console.log("Delete button clicked for Column ID:", column.id);
            deleteColumn(column.id);
          }}
          className="text-2xl stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
        >
          <MdDelete />
        </button>
      </div>

      {/* Column Content */}
      <div
        className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent event propagation here
      >
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* Column Footer */}
      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
      >
        <PiPlus />
        Add Tasks
      </button>
    </div>
  );
}

export default Column;
