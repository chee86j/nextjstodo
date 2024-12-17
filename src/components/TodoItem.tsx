import React, { useState } from "react";

type TodoItemProps = {
  id: string;
  title: string;
  complete: boolean;
  priority: string; // New field for priority
  dueDate: string | null; // New field for due date
  toggleTodo: (id: string, complete: boolean) => void;
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({
  id,
  title,
  complete,
  priority,
  dueDate,
  toggleTodo,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSave = () => {
    onEdit(id, editedTitle);
    setIsEditing(false);
  };

  return (
    <li className="flex flex-col gap-1 p-2 border rounded">
      <div className="flex items-center gap-2">
        {/* Checkbox to toggle completion */}
        <input
          id={id}
          type="checkbox"
          className="cursor-pointer peer"
          checked={complete}
          onChange={() => toggleTodo(id, !complete)} // Toggle the complete state
        />

        {/* Editable Title */}
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700"
          />
        ) : (
          <label
            htmlFor={id}
            className="cursor-pointer peer-checked:line-through peer-checked:text-slate-500"
          >
            {title}
          </label>
        )}

        {/* Edit and Save Buttons */}
        {isEditing ? (
          <button
            onClick={handleSave}
            className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          >
            Edit
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => onDelete(id)}
          className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
        >
          Delete
        </button>
      </div>

      {/* Display Priority and Due Date */}
      <div className="text-sm text-slate-400 flex gap-2 mt-1">
        <span>Priority: {priority || "Medium"}</span>
        <span>
          Due Date:{" "}
          {dueDate
            ? new Date(dueDate).toLocaleDateString()
            : "No due date"}
        </span>
      </div>
    </li>
  );
}
