import React from 'react'
import { TodoItem } from '@/components/TodoItem'
import { prisma } from '@/db'
import { parseDeleteTodoInput, parseToggleTodoInput } from '@/lib/validation/todo'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

async function getTodos() {
  return prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

/*
 * In classic PERN apps you would hit an Express route, flip a boolean, then
 * send back JSON. Server actions let us keep that same flow entirely on the
 * server: validate the payload, run Prisma, then tell Next.js to refresh the
 * cached home route so the UI reflects the latest data.
 */
async function toggleTodo(id: string, complete: boolean) {
  'use server'

  const { id: safeId, complete: nextCompleteValue } = parseToggleTodoInput(id, complete)

  try {
    await prisma.todo.update({ where: { id: safeId }, data: { complete: nextCompleteValue } })
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to toggle todo', error)
    throw new Error('Unable to update todo status right now. Please try again.')
  }
}

/*
 * Delete mirrors the toggle flow: validate input on the server, run the Prisma
 * mutation, then tell Next.js to invalidate the cached list. Treating this as
 * a server action keeps the client-side component lean and avoids shipping
 * extra fetch calls to the browser.
 */
async function deleteTodo(id: string) {
  'use server'

  const { id: safeId } = parseDeleteTodoInput(id)

  try {
    await prisma.todo.delete({ where: { id: safeId } })
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to delete todo', error)
    throw new Error('Unable to delete todo right now. Please try again.')
  }
}

export default async function Home() {
  const todos = await getTodos()

  return (
    <>
      <header className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl'>Todos</h1>
        <Link
          className='border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none'
          href='/new'
        >
          New
        </Link>
      </header>
      {todos.length === 0 ? (
        <p className='text-slate-400'>
          No todos yet.{' '}
          <Link className='underline decoration-dotted text-slate-200' href='/new'>
            Start by creating one.
          </Link>
        </p>
      ) : (
        <ul className='pl-4'>
          {todos.map(todo => (
            <TodoItem key={todo.id} {...todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          ))}
        </ul>
      )}
    </>
  )
}
