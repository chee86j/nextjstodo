"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      title: formData.get("title")?.toString().trim(),
      priority: formData.get("priority"),
      tags: formData.get("tags")?.toString().split(",").map((tag) => tag.trim()),
      dueDate: formData.get("dueDate"),
      recurrence: formData.get("recurrence"),
      attachmentUrl: formData.get("attachmentUrl"),
    };

    if (!data.title) {
      alert("Title is required!");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      router.push("/");
    } catch (error) {
      console.error("Error creating todo:", error);
      alert("Failed to create todo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="flex justify-between items-center mb-4 text-black">
        <h1 className="text-2xl">New Todo</h1>
      </header>
      <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
        <input
          type="text"
          name="title"
          placeholder="Todo Title"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
          required
          aria-label="Todo Title"
        />
        <select
          name="priority"
          defaultValue="Medium"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
          aria-label="Priority"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
          aria-label="Tags (comma-separated)"
        />
        <input
          type="date"
          name="dueDate"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
          aria-label="Due Date"
        />
        <input
          type="text"
          name="recurrence"
          placeholder="Recurrence"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
          aria-label="Recurrence"
        />
        <input
          type="text"
          name="attachmentUrl"
          placeholder="Attachment URL"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
          aria-label="Attachment URL"
        />
        <div className="flex gap-1 justify-end">
          <Link href="/">
            <a className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none">
              Cancel
            </a>
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          >
            {isSaving ? "Saving..." : "Create"}
          </button>
        </div>
      </form>
    </>
  );
}
