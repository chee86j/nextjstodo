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
          className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 shadow-[0_10px_35px_-24px_rgba(0,0,0,0.8)] transition focus-visible:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
          placeholder='Ship landing page, fix navbar, book flights...'
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
          className='inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
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
      className='inline-flex items-center justify-center rounded-full border border-white/20 bg-white text-sm font-semibold text-slate-900 transition hover:border-white/40 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-70'
    >
      {pending ? 'Saving...' : 'Save todo'}
    </button>
  )
}
