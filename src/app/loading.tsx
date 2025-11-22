import React from 'react'

/*
 * App Router automatically streams loading.tsx while Prisma is still fetching.
 * Think of it like the skeleton UI you might show in a PERN app before the API
 * responds, except Next.js wires it up for us via React Suspense boundaries.
 */
export default function Loading() {
  const placeholderRows = Array.from({ length: 4 }, (_, index) => index)

  return (
    <section className='space-y-4' aria-busy='true' aria-live='polite'>
      <header className='flex justify-between items-center mb-2'>
        <div className='h-8 w-32 rounded bg-slate-700/60' />
        <div className='h-8 w-16 rounded border border-slate-700/70' />
      </header>
      <ul className='pl-4 space-y-2'>
        {placeholderRows.map(row => (
          <li key={row} className='flex items-center gap-3'>
            <span className='h-4 w-4 rounded border border-slate-700/70' />
            <span className='h-5 flex-1 rounded bg-slate-700/50' />
          </li>
        ))}
      </ul>
    </section>
  )
}
