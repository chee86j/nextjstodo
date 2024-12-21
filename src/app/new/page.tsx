import { prisma } from "@/db";
import { redirect } from "next/navigation";
import Link from "next/link";

/* Next.js routing function is based on the file system.
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
      <header className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-300 mb-2">
          Create Your Next Todo 🚀
        </h1>
        <p className="text-slate-400">
          Stay organized and efficient by creating a new task with priority and deadlines.
        </p>
      </header>

      <form action={createTodo} className="max-w-xl mx-auto flex flex-col gap-4 bg-slate-800 p-6 rounded shadow-lg">
        {/* Title Input */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-slate-300 mb-1">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter your task title"
            className="border border-slate-300 bg-transparent rounded px-3 py-2 outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Priority Select */}
        <div className="flex flex-col">
          <label htmlFor="priority" className="text-slate-300 mb-1">
            Priority Level
          </label>
          <select
            id="priority"
            name="priority"
            className="border border-slate-300 bg-transparent rounded px-3 py-2 outline-none focus:border-blue-500"
            defaultValue="Medium"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Due Date Input */}
        <div className="flex flex-col">
          <label htmlFor="dueDate" className="text-slate-300 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            className="border border-slate-300 bg-transparent rounded px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Link
            href=".."
            className="px-4 py-2 border border-slate-300 text-slate-300 rounded hover:bg-slate-700 focus:bg-slate-700 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition"
          >
            Create
          </button>
        </div>
      </form>
    </>
  );
}
