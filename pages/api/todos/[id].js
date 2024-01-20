import { prisma } from "@/db"

export default async function handler(req, res) {
    const todoId = req.query.id;

    if (req.method === 'GET') {
        try {
            const todo = await prisma.todo.findUnique({
                where: { id: todoId }
            });
            if (todo) {
                res.status(200).json(todo);
            } else {
                res.status(404).json({ message: "Todo not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch todo", error });
        }
    } else if (req.method === 'PUT') {
        const { title, complete } = req.body;
        try {
            const updatedTodo = await prisma.todo.update({
                where: { id: todoId },
                data: { title, complete }
            });
            res.status(200).json(updatedTodo);
        } catch (error) {
            res.status(500).json({ message: "Failed to update todo", error });
        }
    } else if (req.method === 'DELETE') {
        try {
            await prisma.todo.delete({
                where: { id: todoId }
            });
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ message: "Failed to delete todo", error });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
