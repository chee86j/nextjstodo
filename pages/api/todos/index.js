import { prisma } from "@/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Fetch all Todos
    try {
      const todos = await prisma.todo.findMany({
        orderBy: { createdAt: "desc" }, // Optional: Order by created date
      });
      res.status(200).json(todos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      res.status(500).json({ message: "Failed to fetch todos", error });
    }
  } 
  
  else if (req.method === 'POST') {
    // Create a new Todo
    const { title, priority = "Medium", dueDate } = req.body;

    // Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "Invalid title" });
    }

    try {
      const newTodo = await prisma.todo.create({
        data: {
          title,
          complete: false,
          priority, // Defaults to "Medium" if not provided
          dueDate: dueDate ? new Date(dueDate) : null, // Parse dueDate if provided
        },
      });
      res.status(201).json(newTodo);
    } catch (error) {
      console.error("Failed to create todo:", error);
      res.status(500).json({ message: "Failed to create todo", error });
    }
  } 
  
  else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


/* API Routes: Next.js provides a built-in API routes feature, 
allowing you to create a RESTful API within your Next.js application. 
This file (index.js) under pages/api/todos creates an API endpoint 
at /api/todos. This is a serverless function that runs on the server side.

Serverless Functions: Each API route in Next.js is a serverless lambda 
function. This means the function runs on-demand in response to requests, 
scaling automatically without server management. Your handler function is 
an example of this.

Built-in Request and Response Objects: Next.js provides built-in req 
(request) and res (response) objects, simplifying the handling of HTTP 
requests. Your function uses req.method to determine the type of HTTP 
request and res to send back responses.

Simplified Routing: By simply placing a JavaScript file in the pages/api 
directory, Next.js automatically handles the routing. The file path 
determines the endpoint's URL.

Prisma Integration for Database Operations: Next.js seamlessly integrates 
with various tools and libraries. In your case, it's integrated with Prisma - 
an ORM (Object-Relational Mapping) tool. This makes database operations like 
fetching (findMany) and creating (create) data straightforward and efficient.

Handling Different HTTP Methods: Next.js allows you to handle different HTTP 
methods (GET, POST, etc.) in the same file. In your code, you're handling GET 
requests to fetch todos and POST requests to create new todos, demonstrating 
how a single API route can serve multiple purposes.
*/