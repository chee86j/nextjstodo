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
}

export function TodoItem({ id, title, complete, toggleTodo }: TodoItemProps) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextCompleteState = event.target.checked
    startTransition(() => {
      toggleTodo(id, nextCompleteState)
    })
  }

  const checkboxId = `todo-${id}`

  return (
    <li className='flex items-center gap-3 py-2'>
      <input
        id={checkboxId}
        type='checkbox'
        defaultChecked={complete}
        className='peer h-4 w-4 cursor-pointer accent-slate-300'
        aria-label={`Mark ${title} as ${complete ? 'incomplete' : 'complete'}`}
        onChange={handleChange}
        disabled={isPending}
      />
      <label
        htmlFor={checkboxId}
        className='flex-1 text-lg peer-checked:text-slate-500 peer-checked:line-through'
      >
        {title}
      </label>
    </li>
  )
}
