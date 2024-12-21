import { prisma } from "@/db";

export default async function handler(req, res) {
  const todoId = req.query.id;

  if (req.method === "GET") {
    try {
      // Fetch a single Todo by ID
      const todo = await prisma.todo.findUnique({
        where: { id: todoId },
      });
      if (todo) {
        res.status(200).json(todo);
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    } catch (error) {
      console.error("Error fetching todo:", error);
      res.status(500).json({ message: "Failed to fetch todo", error: error.message });
    }
  } else if (req.method === "PUT") {
    const { title, complete, priority, dueDate, tags } = req.body;

    // Input Validation
    if (title && typeof title !== "string") {
      return res.status(400).json({ message: "Invalid 'title' value. Must be a string." });
    }
    if (complete !== undefined && typeof complete !== "boolean") {
      return res.status(400).json({ message: "Invalid 'complete' value. Must be a boolean." });
    }
    if (priority && typeof priority !== "string") {
      return res.status(400).json({ message: "Invalid 'priority' value. Must be a string." });
    }
    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ message: "Invalid 'dueDate' value. Must be a valid date." });
    }
    if (tags && typeof tags !== "string") {
      return res.status(400).json({ message: "Invalid 'tags' value. Must be a string." });
    }

    try {
      console.log("Updating todo with data:", { title, complete, priority, dueDate, tags });

      // Update the Todo with optional fields
      const updatedTodo = await prisma.todo.update({
        where: { id: todoId },
        data: {
          ...(title && { title }),
          ...(complete !== undefined && { complete }),
          ...(priority && { priority }),
          ...(dueDate && { dueDate: new Date(dueDate) }),
          ...(tags && { tags }), // Store tags as a comma-separated string
        },
      });

      res.status(200).json(updatedTodo);
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ message: "Failed to update todo", error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.todo.delete({
        where: { id: todoId },
      });
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ message: "Failed to delete todo", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/* Dynamic API Routes: Next.js supports dynamic routing, and this feature extends 
to API routes. The [id].js file creates a dynamic route (/api/todos/:id), where 
:id is a variable part of the URL. This allows you to handle requests for specific 
todos based on their unique identifier.

Serverless Function per Endpoint: Similar to other API routes in Next.js, this file 
represents a serverless function that handles requests to a specific endpoint. This 
serverless architecture is ideal for scalability and efficiency.

Handling Different HTTP Methods: The file demonstrates handling multiple HTTP methods 
(GET, PUT, DELETE) within a single API route. This is a powerful feature for creating 
RESTful APIs where different methods on the same URL perform different operations:

    GET for fetching a specific todo.
    PUT for updating a specific todo.
    DELETE for deleting a specific todo.

Prisma for Database Operations: The integration with Prisma ORM makes database 
interactions straightforward. Your code efficiently handles different database 
based on the request method, showcasing how Next.js works seamlessly with external 
libraries and databases.

Query Parameters: Next.js automatically parses and provides query parameters (in 
this case, id from the route /api/todos/[id]). This is used to perform operations 
on a specific resource, demonstrating Next.js's easy handling of dynamic data.

*/