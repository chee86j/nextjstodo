'use client'

import { ChangeEvent, FormEvent, useEffect, useState, useTransition } from 'react'

/*
 * Client-side row that keeps each todo interactive: toggle completion, rename inline, or delete.
 * useTransition provides pending flags so the UI stays responsive while server actions run.
 * useState holds a draft title and any errors so learners can see how to surface failures inline.
 */
type TodoItemProps = {
  id: string
  title: string
  complete: boolean
  toggleTodo: (id: string, complete: boolean) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  updateTodo: (id: string, title: string) => Promise<void>
}

export function TodoItem({
  id,
  title,
  complete,
  toggleTodo,
  deleteTodo,
  updateTodo,
}: TodoItemProps) {
  const [draftTitle, setDraftTitle] = useState(title)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startToggleTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isSaving, startSaveTransition] = useTransition()

  useEffect(() => {
    // Keep the draft in sync when the server streams back an updated title.
    setDraftTitle(title)
  }, [title])

  const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null)
    const nextCompleteState = event.target.checked
    startToggleTransition(() => {
      toggleTodo(id, nextCompleteState).catch(() => {
        setErrorMessage('Unable to update this todo. Please try again.')
      })
    })
  }

  const handleDelete = () => {
    setErrorMessage(null)
    const userConfirmedDelete = window.confirm(`Delete "${title}"?`)
    if (!userConfirmedDelete) {
      return
    }

    startDeleteTransition(() => {
      deleteTodo(id).catch(() => {
        setErrorMessage('Unable to delete this todo. Please try again.')
      })
    })
  }

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    startSaveTransition(() => {
      updateTodo(id, draftTitle)
        .then(() => setIsEditing(false))
        .catch(() => {
          setErrorMessage('Unable to rename this todo. Please try again.')
        })
    })
  }

  const handleCancelEdit = () => {
    setErrorMessage(null)
    setDraftTitle(title)
    setIsEditing(false)
  }

  const isMutating = isPending || isDeleting || isSaving
  const checkboxId = `todo-${id}`

  return (
    <li className='py-4' aria-busy={isMutating}>
      <div className='flex items-start gap-4'>
        <input
          id={checkboxId}
          type='checkbox'
          checked={complete}
          className='peer mt-1 h-5 w-5 cursor-pointer rounded-md border border-white/20 bg-slate-900 accent-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
          aria-label={`Mark ${title} as ${complete ? 'incomplete' : 'complete'}`}
          onChange={handleToggle}
          disabled={isMutating || isEditing}
        />
        <div className='flex-1 space-y-2'>
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className='space-y-3'>
              <label className='block text-xs uppercase tracking-[0.2em] text-slate-400'>
                Rename todo
              </label>
              <input
                type='text'
                value={draftTitle}
                onChange={event => {
                  setErrorMessage(null)
                  setDraftTitle(event.target.value)
                }}
                autoFocus
                maxLength={120}
                disabled={isMutating}
                className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-base text-white shadow-[0_10px_35px_-24px_rgba(0,0,0,0.8)] transition focus-visible:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-70'
              />
              <div className='flex flex-wrap gap-2'>
                <button
                  type='submit'
                  disabled={isMutating}
                  className='inline-flex items-center justify-center rounded-full border border-white/30 bg-white px-3 py-1 text-xs font-semibold text-slate-900 transition hover:border-white/50 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type='button'
                  onClick={handleCancelEdit}
                  disabled={isMutating}
                  className='inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60'
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className='text-lg font-medium leading-relaxed text-white transition peer-checked:text-slate-500 peer-checked:line-through'>
                {title}
              </p>
              <span className='block text-xs uppercase tracking-[0.2em] text-slate-400'>
                {complete ? 'Completed' : 'Active'}
              </span>
            </>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          {!isEditing ? (
            <button
              type='button'
              onClick={() => {
                setErrorMessage(null)
                setDraftTitle(title)
                setIsEditing(true)
              }}
              disabled={isMutating}
              className='rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60'
            >
              Edit
            </button>
          ) : null}
          <button
            type='button'
            onClick={handleDelete}
            aria-label={`Delete ${title}`}
            disabled={isMutating}
            className='rounded-full border border-red-300/30 px-3 py-1 text-xs font-semibold text-red-100 transition hover:border-red-200/60 hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      {errorMessage ? (
        <p className='mt-2 text-sm text-red-300' role='status' aria-live='polite'>
          {errorMessage}
        </p>
      ) : null}
    </li>
  )
}
