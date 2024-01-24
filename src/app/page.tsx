"use client" 
/* to run code on the client side. this is necessary 
for hooks like useEffect and useState 
*/

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TodoItem } from "@/components/TodoItem";
import { Modal } from "@/components/Modal";

// Define the Todo type with new fields
type Todo = {
  id: string;
  title: string;
  complete: boolean;
  priority: string;
  tags: string[];
  dueDate?: string; 
  recurrence?: string; 
  attachmentUrl?: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [newTodoPriority, setNewTodoPriority] = useState("Medium");
  const [newTodoTags, setNewTodoTags] = useState("");
  const [newTodoDueDate, setNewTodoDueDate] = useState("");
  const [newTodoRecurrence, setNewTodoRecurrence] = useState("");
  const [newTodoAttachmentUrl, setNewTodoAttachmentUrl] = useState("");
  /* Manages its own state and lifecycle, allowing for dynamic 
  and interactive user interfaces. This is a key strength of 
  React used within a Next.js framework.
  */

  /* Define fetchTodos inside the component scope.
  Client-side data fetching, where you make an HTTP request 
  to your own Next.js API route. */
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleTodo = async (id: string, complete: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ complete }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }
      await fetchTodos();
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
    }
  };

  const handleCreateTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTodoTitle, 
          complete: false,
          priority: newTodoPriority,
          tags: newTodoTags.split(',').map(tag => tag.trim()), // Split and trim tags
          dueDate: newTodoDueDate,
          recurrence: newTodoRecurrence,
          attachmentUrl: newTodoAttachmentUrl
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      // Reset form fields
      setNewTodoTitle("");
      setNewTodoPriority("Medium");
      setNewTodoTags("");
      setNewTodoDueDate("");
      setNewTodoRecurrence("");
      setNewTodoAttachmentUrl("");
      await fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleEdit = async (
    id: string, 
    newTitle: string, 
    newPriority: string, 
    newTags: string[], 
    newDueDate?: string, 
    newRecurrence?: string, 
    newAttachmentUrl?: string
  ) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: newTitle, 
          complete: currentTodo?.complete,
          priority: newPriority,
          tags: newTags,
          dueDate: newDueDate,
          recurrence: newRecurrence,
          attachmentUrl: newAttachmentUrl
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      await fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setIsEditing(false);
      setCurrentTodo(null);
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  

  const openEditModal = (todo: Todo) => {
    setCurrentTodo(todo);
    setIsEditing(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Todos</h1>
        <Link href="/new" className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none">
          New
        </Link>
      </header>

      {todos.length === 0 && !isLoading && (
        <div>
          <h1 className="text-2xl">Welcome to Next.js Todo. Add Some!</h1>
          <form onSubmit={handleCreateTodo} className="flex gap-2 flex-col">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              name="title"
              className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
              placeholder="Enter A New Todo"
            />
            {/* Additional Inputs for New Todo */}
            <select
              name="priority"
              value={newTodoPriority}
              onChange={(e) => setNewTodoPriority(e.target.value)}
              className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              type="text"
              value={newTodoTags}
              onChange={(e) => setNewTodoTags(e.target.value)}
              name="tags"
              className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
              placeholder="Tags (comma-separated)"
            />
            <input
              type="date"
              value={newTodoDueDate}
              onChange={(e) => setNewTodoDueDate(e.target.value)}
              name="dueDate"
              className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
            />
            <input
              type="text"
              value={newTodoRecurrence}
              onChange={(e) => setNewTodoRecurrence(e.target.value)}
              name="recurrence"
              className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
              placeholder="Recurrence"
            />
            <input
              type="text"
              value={newTodoAttachmentUrl}
              onChange={(e) => setNewTodoAttachmentUrl(e.target.value)}
              name="attachmentUrl"
              className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
              placeholder="Attachment URL"
            />
            <button
              type="submit"
              className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
            >
              Create
            </button>
          </form>
        </div>
      )}

      <ul className="pl-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            toggleTodo={toggleTodo}
            onDelete={handleDelete}
            onEditClick={() => openEditModal(todo)}
          />
          /* with server components built inside Next.js, we don't have 
          to use useQuery or make a fetch request to get the data. We can
          just pass the data to the component as props. As long as we are
          using the app router we have the ability to call server code 
          and send the data to the component as props.

          As long as your code doesn't do anything on the client side,
          (useEffect, useState, or event listenser, etc.), it's going to
          run on the server. If you do have client side code, you can use
          the "use client" keyword to run the code on the client side.
          */
        ))}
      </ul>

      {/* Modal for editing a todo */}
      {isEditing && currentTodo && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <input
            type="text"
            value={currentTodo.title}
            onChange={(e) => setCurrentTodo({ ...currentTodo, title: e.target.value })}
            placeholder="Title"
          />
          <select
            value={currentTodo.priority}
            onChange={(e) => setCurrentTodo({ ...currentTodo, priority: e.target.value })}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="text"
            value={currentTodo.tags.join(', ')}
            onChange={(e) => setCurrentTodo({ ...currentTodo, tags: e.target.value.split(',').map(tag => tag.trim()) })}
            placeholder="Tags (comma-separated)"
          />
          <input
            type="date"
            value={currentTodo.dueDate || ''}
            onChange={(e) => setCurrentTodo({ ...currentTodo, dueDate: e.target.value })}
            placeholder="Due Date"
          />
          <input
            type="text"
            value={currentTodo.recurrence || ''}
            onChange={(e) => setCurrentTodo({ ...currentTodo, recurrence: e.target.value })}
            placeholder="Recurrence"
          />
          <input
            type="text"
            value={currentTodo.attachmentUrl || ''}
            onChange={(e) => setCurrentTodo({ ...currentTodo, attachmentUrl: e.target.value })}
            placeholder="Attachment URL"
          />
          <button 
            onClick={() => currentTodo && handleEdit(
              currentTodo.id, 
              currentTodo.title, 
              currentTodo.priority, 
              currentTodo.tags, 
              currentTodo.dueDate, 
              currentTodo.recurrence, 
              currentTodo.attachmentUrl
            )}
            className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          >
            Save
          </button>
        </Modal>
      )}
    </>
  );
}