import { prisma } from "@/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const todos = await prisma.todo.findMany();
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch todos", error });
    }
  } else if (req.method === 'POST') {
    const { title, priority, tags, dueDate, recurrence, attachmentUrl } = req.body;
    try {
      const newTodo = await prisma.todo.create({
        data: { 
          title, 
          complete: false,
          priority,
          tags,
          dueDate: dueDate ? new Date(dueDate) : null,
          recurrence,
          attachmentUrl
        }
      });
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ message: "Failed to create todo", error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
