"use client" 
/* to run code on the client side. this is necessary 
for hooks like useEffect and useState 
*/

import { TodoItem } from "@/components/TodoItem";
import { Modal } from "@/components/Modal";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define the Todo type
type Todo = {
  id: string;
  title: string;
  complete: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
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
    // Existing toggleTodo implementation
  };

  const handleCreateTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodoTitle, complete: false }),
      });
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      setNewTodoTitle("");
      await fetchTodos();
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleEdit = async (id: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, complete: currentTodo?.complete }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      // Refresh the todos list
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

  if (!isLoading && todos.length === 0) {
    return (
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
          <button
            type="submit"
            className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          >
            Create
          </button>
        </form>
      </div>
    );
  }
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Todos</h1>
        {/* integration with Next.js's built-in routing system. This 
        allows for client-side transitions to different pages without 
        a full page reload. */}
        <Link
          className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          href="/new"
        >
          New
        </Link>
      </header>
      <ul className="pl-4">
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} toggleTodo={toggleTodo} onEdit={handleEdit}
          onDelete={handleDelete}/>
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
              />
              <button onClick={() => handleEdit(currentTodo.id, currentTodo.title)}>Save</button>
            </Modal>
          )}
        </>
      );
    }