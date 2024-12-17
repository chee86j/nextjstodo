import React, { useState } from "react";

type TodoItemProps = {
  id: string;
  title: string;
  complete: boolean;
  priority: string; // New field for priority
  dueDate: string | null; // New field for due date
  toggleTodo: (id: string, complete: boolean) => void;
  onEdit: (id: string, newTitle: string, newPriority: string, newDueDate: string | null) => void;
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
  const [editedPriority, setEditedPriority] = useState(priority || "Medium");
  const [editedDueDate, setEditedDueDate] = useState(dueDate || "");

  // Save changes when editing is done
  const handleSave = () => {
    onEdit(id, editedTitle, editedPriority, editedDueDate || null);
    setIsEditing(false);
  };

  return (
    <li className="flex flex-col gap-2 p-2 border rounded">
      {/* Top Section: Checkbox, Title, Buttons */}
      <div className="flex items-center gap-2">
        {/* Checkbox to toggle complete status */}
        <input
          id={id}
          type="checkbox"
          className="cursor-pointer peer"
          checked={complete}
          onChange={() => toggleTodo(id, !complete)}
        />

        {/* Editable Title */}
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="text-slate-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 focus:outline-none"
          />
        ) : (
          <label
            htmlFor={id}
            className="cursor-pointer peer-checked:line-through peer-checked:text-slate-500"
          >
            {title}
          </label>
        )}

        {/* Action Buttons */}
        {isEditing ? (
          <button
            onClick={handleSave}
            className="border text-green-400 px-2 py-1 rounded hover:bg-green-700 focus:outline-none"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="border text-blue-400 px-2 py-1 rounded hover:bg-blue-700 focus:outline-none"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => onDelete(id)}
          className="border text-red-400 px-2 py-1 rounded hover:bg-red-700 focus:outline-none"
        >
          Delete
        </button>
      </div>

      {/* Priority and Due Date Section */}
      {isEditing ? (
        <div className="flex gap-2 mt-2">
          {/* Priority Selector */}
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            className="border rounded px-2 py-1 bg-slate-800 text-white focus:outline-none"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Due Date Input */}
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
            className="border rounded px-2 py-1 bg-slate-800 text-white focus:outline-none"
          />
        </div>
      ) : (
        <div className="text-sm text-slate-400 flex gap-2 mt-1">
          <span>Priority: {priority || "Medium"}</span>
          <span>
            Due Date: {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
          </span>
        </div>
      )}
    </li>
  );
}
