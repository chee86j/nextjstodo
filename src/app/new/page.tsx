import React from 'react'
import { prisma } from '@/db'
import { NewTodoForm, type CreateTodoFormState } from '@/components/NewTodoForm'
import { parseCreateTodoInput } from '@/lib/validation/todo'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/*
 * Traditional PERN create flows usually post to /todos, run validation, then
 * redirect back to the list. Server actions let us keep that exact rhythm
 * without setting up API routes—handle validation + Prisma write here, and
 * Next.js streams the revalidated homepage once we redirect.
 */
async function createTodo(
  _prevState: CreateTodoFormState,
  formData: FormData
): Promise<CreateTodoFormState> {
  'use server'

  const formTitle = formData.get('title')

  try {
    const { title } = parseCreateTodoInput(formTitle)
    await prisma.todo.create({ data: { title } })
  } catch (error) {
    console.error('Failed to create todo', error)
    return {
      error:
        error instanceof Error
          ? error.message
          : 'Unable to create todo right now. Please try again.',
    }
  }

  revalidatePath('/')
  redirect('/')
}

export default function NewTodoPage() {
  return (
    <main className='mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12'>
      <header className='space-y-3'>
        <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Create</p>
        <h1 className='text-4xl font-semibold text-white'>Capture a new todo</h1>
        <p className='max-w-2xl text-sm text-slate-300'>
          Keep titles concise. We validate input on the server, then refresh your list the moment
          the record saves—no reload required.
        </p>
      </header>

      <section className='rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_-45px_rgba(0,0,0,0.9)] backdrop-blur'>
        <NewTodoForm createTodoAction={createTodo} />
      </section>
    </main>
  )
}
