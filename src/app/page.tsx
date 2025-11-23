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
    <main className='mx-auto flex max-w-4xl flex-col gap-10 px-4 py-12'>
      <header className='flex flex-wrap items-start justify-between gap-4'>
        <div className='space-y-3'>
          <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Next todo</p>
          <h1 className='text-4xl font-semibold text-slate-50'>Keep it light, stay on track.</h1>
          <p className='max-w-2xl text-sm text-slate-300'>
            A minimal, Next.js-inspired checklist with server actions, optimistic toggles, and a
            crisp monochrome surface that mirrors the Next logo.
          </p>
        </div>
        <Link
          className='inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
          href='/new'
        >
          + New todo
        </Link>
      </header>

      <section className='rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_-45px_rgba(0,0,0,0.9)] backdrop-blur'>
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4'>
          <div className='space-y-1'>
            <p className='text-xs uppercase tracking-[0.28em] text-slate-400'>Inbox</p>
            <h2 className='text-2xl font-semibold text-white'>Today&apos;s focus</h2>
          </div>
          <span className='rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100'>
            {todos.length} {todos.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {todos.length === 0 ? (
          <div className='flex flex-col items-start gap-3 px-1 py-6 text-slate-300'>
            <p className='text-lg font-semibold text-white'>Zero clutter.</p>
            <p className='text-sm'>
              Add your first task to keep momentum. Titles stay short; toggles update instantly.
            </p>
            <Link
              className='inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
              href='/new'
            >
              Create a todo
            </Link>
          </div>
        ) : (
          <ul className='divide-y divide-white/5' aria-live='polite'>
            {todos.map(todo => (
              <TodoItem key={todo.id} {...todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
