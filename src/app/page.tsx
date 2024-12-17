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
  priority: string;
  dueDate: string | null;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState("Medium");
  const [newTodoDueDate, setNewTodoDueDate] = useState("");
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
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTodoTitle,
          complete: false,
          priority: newTodoPriority,
          dueDate: newTodoDueDate || null,
        }),
      });
      if (!response.ok) throw new Error("Failed to create todo");
      setNewTodoTitle("");
      setNewTodoPriority("Medium");
      setNewTodoDueDate("");
      await fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleEdit = async (id: string, newTitle: string, newPriority: string, newDueDate: string | null) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          priority: newPriority,
          dueDate: newDueDate || null,
          complete: currentTodo?.complete,
        }),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      await fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsEditing(false);
      setCurrentTodo(null);
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete todo");
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const openEditModal = (todo: Todo) => {
    setCurrentTodo(todo);
    setIsEditing(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Todos</h1>
        <Link
          className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          href="/new"
        >
          New
        </Link>
      </header>

      {/* New Todo Form */}
      <form onSubmit={handleCreateTodo} className="flex gap-2 flex-col mb-4">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Enter a new Todo"
          className="border border-slate-300 bg-transparent rounded px-2 py-1"
          required
        />
        <select
          value={newTodoPriority}
          onChange={(e) => setNewTodoPriority(e.target.value)}
          className="border border-slate-300 bg-transparent rounded px-2 py-1"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={newTodoDueDate}
          onChange={(e) => setNewTodoDueDate(e.target.value)}
          className="border border-slate-300 bg-transparent rounded px-2 py-1"
        />
        <button
          type="submit"
          className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700"
        >
          Create
        </button>
      </form>

      {/* Todo List */}
      <ul className="pl-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            {...todo}
            toggleTodo={toggleTodo}
            onEdit={(id, title) => handleEdit(id, title, todo.priority, todo.dueDate)}
            onDelete={handleDelete}
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

      {/* Edit Modal */}
      {isEditing && currentTodo && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <input
            type="text"
            value={currentTodo.title}
            onChange={(e) => setCurrentTodo({ ...currentTodo, title: e.target.value })}
          />
          <button
            onClick={() => handleEdit(currentTodo.id, currentTodo.title, currentTodo.priority, currentTodo.dueDate)}
          >
            Save
          </button>
        </Modal>
      )}
    </>
  );
}


          
