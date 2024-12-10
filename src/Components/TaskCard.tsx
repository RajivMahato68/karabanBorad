import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDelete, MdEdit } from "react-icons/md";
import { useState } from "react";

interface Task {
  id: number | string;
  columnId: number | string;
  content: string;
}

interface Props {
  task: Task;
  deleteTask: (id: number | string) => void;
  editTask: (id: number | string, newContent: string) => void;
}

function TaskCard({ task, deleteTask, editTask }: Props) {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: task.id,
      data: { type: "Task", task },
    });

  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(task.content);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    editTask(task.id, newContent);
    setIsEditing(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 bg-black rounded shadow flex justify-between items-center gap-2"
    >
      {isEditing ? (
        <input
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="border rounded p-1 flex-grow text-black"
          style={{ color: "black" }} // Ensures text color is black
        />
      ) : (
        <span>{task.content}</span>
      )}
      <div className="flex gap-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-500 text-black p-1 rounded"
          >
            Save
          </button>
        ) : (
          <MdEdit
            onClick={handleEdit}
            className="cursor-pointer text-blue-500"
          />
        )}
        <MdDelete
          onClick={() => deleteTask(task.id)}
          className="cursor-pointer text-red-500"
        />
      </div>
    </div>
  );
}

export default TaskCard;
