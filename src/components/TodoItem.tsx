import React from 'react';

type TodoItemProps = {
  id: string;
  title: string;
  complete: boolean;
  priority: string;
  tags: string[];
  dueDate?: string;
  recurrence?: string;
  attachmentUrl?: string;
  toggleTodo: (id: string, complete: boolean) => void;
  onEditClick: () => void;
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
  onDelete
}: TodoItemProps) {

  return (
    <li className="flex gap-1 items-center">
      <input
        id={id}
        type="checkbox"
        checked={complete}
        onChange={() => toggleTodo(id, !complete)}
        className="cursor-pointer peer"
      />
      <label htmlFor={id} className="cursor-pointer peer-checked:line-through peer-checked:text-slate-500">
        {title} - Priority: {priority} - Tags: {tags.join(', ')}
        {dueDate && ` - Due: ${new Date(dueDate).toLocaleDateString()}`}
        {recurrence && ` - Recurrence: ${recurrence}`}
        {attachmentUrl && ` - Attachment: ${attachmentUrl}`}
      </label>
      <button onClick={() => onEditClick(id)} className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none">
        Edit
      </button>
      <button onClick={() => onDelete(id)} className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none">
        Delete
      </button>
    </li>
  );
}
