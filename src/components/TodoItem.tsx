import React from 'react';

type TodoItemProps = {
  id: string;
  title: string;
  complete: boolean;
  priority: string;
  tags: { id: string; name: string }[];
  dueDate?: string;
  recurrence?: string;
  attachmentUrl?: string;
  toggleTodo: (id: string, complete: boolean) => void;
  onEditClick: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({
  id,
  title,
  complete,
  priority,
  tags,
  dueDate,
  recurrence,
  attachmentUrl,
  toggleTodo,
  onEditClick,
  onDelete,
}: TodoItemProps) {
  const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString() : null;

  return (
    <li className="flex gap-4 items-center p-2 border-b border-gray-300">
      <input
        id={id}
        type="checkbox"
        checked={complete}
        onChange={() => toggleTodo(id, !complete)}
        className="cursor-pointer peer"
        aria-label={`Mark ${title} as ${complete ? 'incomplete' : 'complete'}`}
      />
      <label
        htmlFor={id}
        className="cursor-pointer peer-checked:line-through peer-checked:text-gray-500"
      >
        {title}
        <div className="text-sm text-gray-600">
          Priority: {priority} | Tags: {tags.map(tag => tag.name).join(', ')}
          {formattedDueDate && ` | Due: ${formattedDueDate}`}
          {recurrence && ` | Recurrence: ${recurrence}`}
          {attachmentUrl && ` | Attachment: ${attachmentUrl}`}
        </div>
      </label>
      <button
        onClick={() => onEditClick(id)}
        className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white focus:outline-none"
        aria-label={`Edit ${title}`}
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(id)}
        className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white focus:outline-none"
        aria-label={`Delete ${title}`}
      >
        Delete
      </button>
    </li>
  );
}
