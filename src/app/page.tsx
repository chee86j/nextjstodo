import { TodoItem } from "@/components/TodoItem"
import { prisma } from "@/db"
import Link from "next/link"

function getTodos() {
  return prisma.todo.findMany()
}

async function toggleTodo(id: string, complete: boolean) {
  "use server"

  await prisma.todo.update({ where: { id }, data: { complete } })
}

export default async function Home() {
  const todos = await getTodos()

  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Todos</h1>
        <Link
          className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          href="/new" // this line is how we link to the new page
        >
          New
        </Link>
      </header>
      <ul className="pl-4">
        {todos.map(todo => ( // loop through the todos with map
          <TodoItem key={todo.id} {...todo} toggleTodo={toggleTodo} />
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
    </>
  )
}