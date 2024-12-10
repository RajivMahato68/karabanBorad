import { MdDelete } from "react-icons/md";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import { Task } from "../types";

interface ColumnProps {
  column: {
    id: number | string;
    title: string;
  };
  deleteColumn: (id: number | string) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

function Column({ column, deleteColumn, tasks, setTasks }: ColumnProps) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: column.id,
      data: { type: "Column", column },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function createTask() {
    const newTask: Task = {
      id: Math.random(),
      columnId: column.id,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks((prev) => [...prev, newTask]);
  }

  function deleteTask(id: number | string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function editTask(id: number | string, newContent: string) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, content: newContent } : task
      )
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
      <div className="bg-mainBackgroundColor p-3 flex justify-between">
        <h3>{column.title}</h3>
        <MdDelete onClick={() => deleteColumn(column.id)} />
      </div>
      <div className="p-2 flex-grow">
        <SortableContext items={tasks.map((task) => task.id)}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              editTask={editTask}
            />
          ))}
        </SortableContext>
      </div>
      <button onClick={createTask} className="p-2 bg-gray-500 text-black">
        Add Task
      </button>
    </div>
  );
}

export default Column;
