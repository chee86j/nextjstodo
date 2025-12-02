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
  createdAt: string
  dueAt: string | null
  completedAt: string | null
  toggleTodo: (id: string, complete: boolean) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  updateTodo: (id: string, title: string, dueAt: string | null) => Promise<void>
}

type TimeMarkerVariant = 'default' | 'muted' | 'warning' | 'danger' | 'success'

type TimeMarkerConfig = {
  key: string
  label: string
  value: string
  hint?: string
  variant: TimeMarkerVariant
  titleAttr?: string
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
const fullDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const timeMarkerVariantStyles: Record<TimeMarkerVariant, string> = {
  default: 'border-white/15 bg-white/5 text-white',
  muted: 'border-white/10 bg-slate-900/40 text-slate-300',
  warning: 'border-amber-400/40 bg-amber-400/10 text-amber-100',
  danger: 'border-red-400/40 bg-red-500/10 text-red-100',
  success: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100',
}

function formatDateTime(date: Date): string {
  return dateTimeFormatter.format(date)
}

function formatRelativeDifference(targetDate: Date, baseDate: Date): string {
  const diffInMs = targetDate.getTime() - baseDate.getTime()
  const diffInMinutes = Math.round(diffInMs / 60000)

  if (Math.abs(diffInMinutes) < 60) {
    return relativeTimeFormatter.format(diffInMinutes, 'minute')
  }

  const diffInHours = Math.round(diffInMinutes / 60)
  if (Math.abs(diffInHours) < 24) {
    return relativeTimeFormatter.format(diffInHours, 'hour')
  }

  const diffInDays = Math.round(diffInHours / 24)
  return relativeTimeFormatter.format(diffInDays, 'day')
}

function parseDateOrNull(value: string | null): Date | null {
  if (!value) {
    return null
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatFullDate(date: Date): string {
  return fullDateTimeFormatter.format(date)
}

function formatDateTimeLocalInputValue(value: string | null): string {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const tzOffsetMinutes = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - tzOffsetMinutes * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

export function TodoItem({
  id,
  title,
  complete,
  createdAt,
  dueAt,
  completedAt,
  toggleTodo,
  deleteTodo,
  updateTodo,
}: TodoItemProps) {
  const [draftTitle, setDraftTitle] = useState(title)
  const [draftDueAt, setDraftDueAt] = useState(() => formatDateTimeLocalInputValue(dueAt))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startToggleTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isSaving, startSaveTransition] = useTransition()

  useEffect(() => {
    // Keep the draft in sync when the server streams back an updated title.
    setDraftTitle(title)
  }, [title])

  useEffect(() => {
    setDraftDueAt(formatDateTimeLocalInputValue(dueAt))
  }, [dueAt])

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

    const nextDueAtValue = draftDueAt && draftDueAt.trim().length > 0 ? draftDueAt : null

    startSaveTransition(() => {
      updateTodo(id, draftTitle, nextDueAtValue)
        .then(() => setIsEditing(false))
        .catch(() => {
          setErrorMessage('Unable to save changes. Please try again.')
        })
    })
  }

  const handleCancelEdit = () => {
    setErrorMessage(null)
    setDraftTitle(title)
    setDraftDueAt(formatDateTimeLocalInputValue(dueAt))
    setIsEditing(false)
  }

  const isMutating = isPending || isDeleting || isSaving
  const checkboxId = `todo-${id}`
  const createdAtDate = parseDateOrNull(createdAt) ?? new Date()
  const dueAtDate = parseDateOrNull(dueAt)
  const completedAtDate = parseDateOrNull(completedAt)
  const now = new Date()

  const dueVariant: TimeMarkerVariant = (() => {
    if (!dueAtDate) {
      return 'muted'
    }

    if (complete) {
      return 'success'
    }

    if (dueAtDate.getTime() < now.getTime()) {
      return 'danger'
    }

    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    return dueAtDate.getTime() <= nextDay.getTime() ? 'warning' : 'default'
  })()

  const dueValue = dueAtDate ? formatDateTime(dueAtDate) : 'No due date'
  const dueHint = dueAtDate ? formatRelativeDifference(dueAtDate, now) : 'Add a target date'

  const completedVariant: TimeMarkerVariant =
    complete && completedAtDate ? 'success' : complete ? 'warning' : 'muted'
  const completedValue =
    complete && completedAtDate
      ? formatDateTime(completedAtDate)
      : complete
        ? 'Timestamp unavailable'
        : 'Not completed'
  const completedHint =
    complete && completedAtDate
      ? formatRelativeDifference(completedAtDate, now)
      : complete
        ? 'Toggle off/on to refresh the timestamp'
        : 'Mark complete once this is finished'

  const createdValue = formatDateTime(createdAtDate)
  const createdHint = formatRelativeDifference(createdAtDate, now)
  const createdFullValue = formatFullDate(createdAtDate)
  const dueFullValue = dueAtDate ? formatFullDate(dueAtDate) : 'No due date set'
  const completedFullValue =
    complete && completedAtDate ? formatFullDate(completedAtDate) : completedValue

  const markerConfigs: TimeMarkerConfig[] = [
    {
      key: 'created',
      label: 'Created',
      value: createdValue,
      hint: createdHint,
      variant: 'muted',
      titleAttr: createdFullValue,
    },
    {
      key: 'due',
      label: 'Due',
      value: dueValue,
      hint: dueHint,
      variant: dueVariant,
      titleAttr: dueFullValue,
    },
    {
      key: 'completed',
      label: 'Completed',
      value: completedValue,
      hint: completedHint,
      variant: completedVariant,
      titleAttr: completedFullValue,
    },
  ]

  return (
    <li className='py-4' aria-busy={isMutating}>
      <div className='flex flex-col gap-4'>
        <div className='md:grid md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,170px))_auto] md:items-start md:gap-4'>
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
                  <label className='block text-xs uppercase tracking-[0.2em] text-slate-400'>
                    Due date
                  </label>
                  <input
                    type='datetime-local'
                    value={draftDueAt}
                    onChange={event => {
                      setErrorMessage(null)
                      setDraftDueAt(event.target.value)
                    }}
                    disabled={isMutating}
                    className='w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-base text-white shadow-[0_10px_35px_-24px_rgba(0,0,0,0.8)] transition focus-visible:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-70'
                  />
                  <p className='text-[0.7rem] text-slate-400'>
                    Clearing the field removes the due date entirely.
                  </p>
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
          </div>
          {!isEditing
            ? markerConfigs.map(marker => (
                <TimeMarker
                  key={`${id}-${marker.key}-desktop`}
                  label={marker.label}
                  value={marker.value}
                  hint={marker.hint}
                  variant={marker.variant}
                  titleAttr={marker.titleAttr}
                  className='hidden md:flex md:flex-col md:justify-center'
                />
              ))
            : null}
          <div className='mt-4 flex flex-col gap-2 md:mt-0 md:items-end md:justify-center'>
            {!isEditing ? (
              <button
                type='button'
                onClick={() => {
                  setErrorMessage(null)
                  setDraftTitle(title)
                  setDraftDueAt(formatDateTimeLocalInputValue(dueAt))
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
        {!isEditing ? (
          <div className='grid gap-3 text-xs md:hidden'>
            {markerConfigs.map(marker => (
              <TimeMarker
                key={`${id}-${marker.key}-mobile`}
                label={marker.label}
                value={marker.value}
                hint={marker.hint}
                variant={marker.variant}
                titleAttr={marker.titleAttr}
              />
            ))}
          </div>
        ) : null}
      </div>
      {errorMessage ? (
        <p className='text-sm text-red-300' role='status' aria-live='polite'>
          {errorMessage}
        </p>
      ) : null}
    </li>
  )
}

function TimeMarker({
  label,
  value,
  hint,
  variant,
  titleAttr,
  className = '',
}: {
  label: string
  value: string
  hint?: string
  variant: TimeMarkerVariant
  titleAttr?: string
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border px-3 py-2 text-xs ${timeMarkerVariantStyles[variant]} ${className}`}
      role='group'
      aria-label={`${label} marker`}
      title={titleAttr}
    >
      <p className='text-[0.58rem] uppercase tracking-[0.3em] text-white/60'>{label}</p>
      <p className='text-sm font-semibold leading-tight text-current'>{value}</p>
      {hint ? <p className='text-[0.7rem] text-current opacity-80'>{hint}</p> : null}
    </div>
  )
}
