'use client'

import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'

/*
 * Familiar PERN muscle memory still applies here: build the form as a client
 * component, post to a server action, and let React/Next handle streaming UI
 * updates. useFormState gives us the same feedback loop you would normally
 * wire up with a fetch + JSON error response.
 */
export type CreateTodoFormState = {
  error?: string
}

type NewTodoFormProps = {
  createTodoAction: (
    state: CreateTodoFormState,
    formData: FormData
  ) => Promise<CreateTodoFormState>
}

export function NewTodoForm({ createTodoAction }: NewTodoFormProps) {
  const [formState, formAction] = useFormState(createTodoAction, { error: undefined })

  return (
    <form action={formAction} className='space-y-6'>
      <label className='flex flex-col gap-2 text-lg font-medium'>
        Title
        <input
          type='text'
          name='title'
          autoFocus
          required
          maxLength={120}
          className='rounded border border-slate-700 bg-slate-900 px-3 py-2 text-base text-slate-100 placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300'
          placeholder='Walk the dog, pick up groceries...'
        />
      </label>
      {formState?.error && (
        <p role='alert' className='text-sm text-red-300'>
          {formState.error}
        </p>
      )}
      <div className='flex flex-wrap gap-3'>
        <SubmitButton />
        <Link
          href='/'
          className='inline-flex items-center justify-center rounded border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300'
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type='submit'
      disabled={pending}
      className='inline-flex items-center justify-center rounded bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 disabled:cursor-not-allowed disabled:opacity-70'
    >
      {pending ? 'Saving...' : 'Save todo'}
    </button>
  )
}
