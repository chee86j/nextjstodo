import React, { useState } from "react";

type TodoItemProps = {
  id: string;
  title: string;
  complete: boolean;
  priority: string;
  dueDate: string | null;
  tags: string[]; // New field for tags
  toggleTodo: (id: string, complete: boolean) => void;
  onEdit: (id: string, newTitle: string, newPriority: string, newDueDate: string | null, newTags: string[]) => void; // Updated type
  onDelete: (id: string) => void;
};

export function TodoItem({
  id,
  title,
  complete,
  priority,
  dueDate,
  tags,
  toggleTodo,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedPriority, setEditedPriority] = useState(priority || "Medium");
  const [editedDueDate, setEditedDueDate] = useState(dueDate || "");
  const [editedTags, setEditedTags] = useState(tags.join(", ")); // Manage tags as a comma-separated string

    // Save changes when editing is done
  const handleSave = () => {
    const tagsArray = editedTags.split(",").map((tag) => tag.trim());
    onEdit(id, editedTitle, editedPriority, editedDueDate || null, tagsArray);
    setIsEditing(false);
  };

  return (
    <li className="flex flex-col gap-2 p-2 border rounded bg-slate-800">
      {/* Top Section: Checkbox, Title, Buttons */}
      <div className="flex items-center justify-between">
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
            className="text-slate-300 px-2 py-1 rounded bg-slate-700 focus:outline-none"
          />
        ) : (
          <label
            htmlFor={id}
            className={`cursor-pointer ${complete ? "line-through text-slate-500" : "text-white"}`}
          >
            {title}
          </label>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-2 text-green-500 hover:bg-green-700 rounded focus:outline-none"
              title="Save Changes"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-500 hover:bg-blue-700 rounded focus:outline-none"
              title="Edit Task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-red-500 hover:bg-red-700 rounded focus:outline-none"
            title="Delete Task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editable Fields */}
      {isEditing ? (
        <div className="flex flex-col gap-2 mt-2">
          {/* Priority Selector */}
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            className="border rounded px-2 py-1 bg-slate-700 text-white focus:outline-none"
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
            className="border rounded px-2 py-1 bg-slate-700 text-white focus:outline-none"
          />

          <input
            type="text"
            value={editedTags}
            onChange={(e) => setEditedTags(e.target.value)}
            className="border rounded px-2 py-1 bg-slate-700 text-white focus:outline-none"
            placeholder="Add tags (comma-separated)"
          />
        </div>
      ) : (
        <div className="text-sm text-slate-400 flex gap-2 mt-1">
          <span>Priority: {priority || "Medium"}</span>
          <span>
            Due Date: {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
          </span>
          <span>Tags: {tags.join(", ") || "No tags"}</span>
        </div>
      )}
    </li>
  );
}
