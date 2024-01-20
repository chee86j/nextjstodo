"use client"

import React, { useState } from 'react';

type TodoItemProps = {
  id: string;
  title: string;
  complete: boolean;
  toggleTodo: (id: string, complete: boolean) => void;
  onEdit: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ id, title, complete, toggleTodo, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSave = () => {
    onEdit(id, editedTitle);
    setIsEditing(false);
  };

  return (
    <li className="flex gap-1 items-center">
      <input
        id={id}
        type="checkbox"
        className="cursor-pointer peer"
        checked={complete}
        onChange={(e) => toggleTodo(id, e.target.checked)}
      />
      {isEditing ? (
        <input 
          type="text" 
          value={editedTitle} 
          onChange={(e) => setEditedTitle(e.target.value)}
          className='text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700'
        />
      ) : (
        <label htmlFor={id} className="cursor-pointer peer-checked:line-through peer-checked:text-slate-500">
          {title}
        </label>
      )}
      {isEditing ? (
        <button onClick={handleSave} className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
        >Save</button>
      ) : (
        <button onClick={() => setIsEditing(true)} className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
        >Edit</button>
      )}
      <button onClick={() => onDelete(id)} className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
>Delete</button>
    </li>
  );
}
