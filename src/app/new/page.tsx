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
    <section className='mx-auto max-w-xl space-y-6'>
      <header className='space-y-1'>
        <p className='text-sm uppercase tracking-[0.3em] text-slate-500'>Create</p>
        <h1 className='text-3xl font-semibold text-slate-100'>Add a new todo</h1>
        <p className='text-sm text-slate-400'>
          Titles can stay short; the home list revalidates immediately after save.
        </p>
      </header>
      <NewTodoForm createTodoAction={createTodo} />
    </section>
  )
}
