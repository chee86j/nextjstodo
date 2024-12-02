import { prisma } from "@/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const todos = await prisma.todo.findMany({
        include: { tags: true }, // Include related tags
      });
      res.status(200).json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ message: "Failed to fetch todos", error });
    }
  } else if (req.method === "POST") {
    const { title, priority, tags, dueDate, recurrence, attachmentUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    try {
      const newTodo = await prisma.todo.create({
        data: {
          title,
          complete: false,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          recurrence,
          attachmentUrl,
          tags: {
            create: tags.map((tag) => ({ name: typeof tag === "string" ? tag : tag.name })), // Adjust for both cases
          },
        },
      });
      res.status(201).json(newTodo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ message: "Failed to create todo", error });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

