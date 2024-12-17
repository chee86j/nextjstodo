import { prisma } from "@/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { parse } from "path"

/*  Next.js routing function is based on the file system.
    The /new route is defined in src/app/new/page.tsx.
*/

async function createTodo(data: FormData) {
  "use server";

  const title = data.get("title")?.valueOf();
  const priority = data.get("priority")?.valueOf();
  const dueDate = data.get("dueDate")?.valueOf();

  // Validate the title
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error("Invalid Title");
  }

  // Validate the priority
  const validPriorities = ["Low", "Medium", "High"];
  if (typeof priority !== "string" || !validPriorities.includes(priority)) {
    throw new Error("Invalid Priority");
  }

  // Parse the dueDate (if provided)
  let parsedDueDate = null;
  if (typeof dueDate === "string" && dueDate.trim().length > 0) {
    parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      throw new Error("Invalid Due Date");
    }
  }

  // Create the Todo in the database
  await prisma.todo.create({
    data: {
      title,
      complete: false,
      priority,
      dueDate: parsedDueDate,
    },
  });

  redirect("/");
}


export default function Page() {
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Create New Todo</h1>
      </header>

      <form action={createTodo} className="flex gap-2 flex-col">
        {/* Title Input */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
          required
        />

        {/* Priority Select */}
        <select
          name="priority"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
          defaultValue="Medium"
          required
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Due Date Input */}
        <input
          type="date"
          name="dueDate"
          className="border border-slate-300 bg-transparent rounded px-2 py-1 outline-none focus-within:border-slate-100"
        />

        {/* Buttons */}
        <div className="flex gap-1 justify-end">
          <Link
            href=".."
            className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          >
            Create
          </button>
        </div>
      </form>
    </>
  );
}