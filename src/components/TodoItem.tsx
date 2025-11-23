'use client'

import { ChangeEvent, useTransition } from 'react'

/*

 ChangeEvent<HTMLInputElement> is just a TypeScript label you put on an event
 parameter so the compiler knows the event came from an <input>. That way, 
 TypeScript lets you use properties like event.target.checked without complaining. 
 It’s purely for better type checking and editor help; it doesn’t change how the code runs.


 useTransition is a React hook that helps keep the UI responsive when you kick off something 
 that might take longer (like a server action). You call startTransition(() => { async work  
 }), and React handles it in a “transition” so fast UI updates aren’t blocked. The hook also 
 gives you an isPending boolean that stays true until the work finishes, which you can use 
 to disable the checkbox briefly or show a loading state. It’s simpler than managing extra 
 state with useState/useEffect and keeps UI interactions snappy.

 Todo item row responsible for rendering the checkbox + label pairing and
 invoking the provided server action when completion state changes.
*/
type TodoItemProps = {
  id: string
  title: string
  complete: boolean
  toggleTodo: (id: string, complete: boolean) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
}

export function TodoItem({ id, title, complete, toggleTodo, deleteTodo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextCompleteState = event.target.checked
    startTransition(() => {
      toggleTodo(id, nextCompleteState)
    })
  }

  const handleDelete = () => {
    const userConfirmedDelete = window.confirm(`Delete "${title}"?`)
    if (!userConfirmedDelete) {
      return
    }

    startDeleteTransition(() => {
      deleteTodo(id)
    })
  }

  const checkboxId = `todo-${id}`

  return (
    <li className='flex items-start gap-4 py-4'>
      <input
        id={checkboxId}
        type='checkbox'
        defaultChecked={complete}
        className='peer mt-1 h-5 w-5 cursor-pointer rounded-md border border-white/20 bg-slate-900 accent-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
        aria-label={`Mark ${title} as ${complete ? 'incomplete' : 'complete'}`}
        onChange={handleChange}
        disabled={isPending || isDeleting}
      />
      <label
        htmlFor={checkboxId}
        className='flex-1 space-y-2 text-lg font-medium leading-relaxed text-white transition peer-checked:text-slate-500 peer-checked:line-through'
      >
        {title}
        <span className='block text-xs uppercase tracking-[0.2em] text-slate-400'>
          {complete ? 'Completed' : 'Active'}
        </span>
      </label>
      <button
        type='button'
        onClick={handleDelete}
        aria-label={`Delete ${title}`}
        disabled={isPending || isDeleting}
        className='rounded-full border border-red-300/30 px-3 py-1 text-xs font-semibold text-red-100 transition hover:border-red-200/60 hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isDeleting ? 'Deleting…' : 'Delete'}
      </button>
    </li>
  )
}
