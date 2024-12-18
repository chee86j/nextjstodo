"use client";

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

  // Fetch all Todos
  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Toggle a Todo's 'complete' state
  const toggleTodo = async (id: string, complete: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complete }),
      });
      if (!response.ok) throw new Error("Failed to toggle todo");
      await fetchTodos();
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // Edit a Todo
  const handleEdit = async (id: string, newTitle: string, newPriority: string, newDueDate: string | null) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          priority: newPriority || "Medium",
          dueDate: newDueDate || null,
          complete: currentTodo?.complete ?? false,
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

  // Delete a Todo
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
      <header className="flex flex-col items-center gap-4 mb-6 text-center">
        <h1 className="text-4xl font-bold text-slate-300">
          🚀 Supercharge Your Productivity
        </h1>
        <p className="text-lg text-slate-400 max-w-md">
          Welcome to the **Next.js Todo App**! Manage tasks effortlessly, set
          priorities, and never miss a deadline again. Simple. Fast. Efficient.
        </p>
        <Link
          className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition"
          href="/new"
        >
          ➕ Add a New Task
        </Link>
      </header>

      {/* Todo List */}
      <section className="max-w-4xl mx-auto">
        {todos.length === 0 ? (
          <p className="text-slate-400 text-center">No tasks yet! Add your first one now 🚀</p>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                {...todo}
                toggleTodo={toggleTodo}
                onEdit={(id, title, priority, dueDate) => handleEdit(id, title, priority, dueDate)}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </section>
          {/* with server components built inside Next.js, we don't have 
          to use useQuery or make a fetch request to get the data. We can
          just pass the data to the component as props. As long as we are
          using the app router we have the ability to call server code 
          and send the data to the component as props.

          As long as your code doesn't do anything on the client side,
          (useEffect, useState, or event listenser, etc.), it's going to
          run on the server. If you do have client side code, you can use
          the "use client" keyword to run the code on the client side.
          */ }
  
        {/* Edit Modal */}
        {isEditing && currentTodo && (
          <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
            <input
              type="text"
              value={currentTodo.title}
              onChange={(e) => setCurrentTodo({ ...currentTodo, title: e.target.value })}
            />
            <select
              value={currentTodo.priority}
              onChange={(e) => setCurrentTodo({ ...currentTodo, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              type="date"
              value={currentTodo.dueDate || ""}
              onChange={(e) => setCurrentTodo({ ...currentTodo, dueDate: e.target.value })}
            />
            <button onClick={() => handleEdit(currentTodo.id, currentTodo.title, currentTodo.priority, currentTodo.dueDate)}>
              Save
            </button>
          </Modal>
        )}
      </>
    );
  }