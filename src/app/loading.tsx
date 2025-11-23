import React from 'react'

/*
 * App Router automatically streams loading.tsx while Prisma is still fetching.
 * Think of it like the skeleton UI you might show in a PERN app before the API
 * responds, except Next.js wires it up for us via React Suspense boundaries.
 */
export default function Loading() {
  const placeholderRows = Array.from({ length: 4 }, (_, index) => index)

  return (
    <section
      className='mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12'
      aria-busy='true'
      aria-live='polite'
    >
      <header className='space-y-3'>
        <div className='h-4 w-24 rounded-full bg-white/10' />
        <div className='h-10 w-72 rounded-full bg-white/10' />
        <div className='h-4 w-96 max-w-full rounded-full bg-white/10' />
      </header>

      <div className='rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_70px_-45px_rgba(0,0,0,0.9)] backdrop-blur'>
        <div className='mb-4 h-9 w-full rounded-xl bg-white/10' />
        <ul className='space-y-3'>
          {placeholderRows.map(row => (
            <li key={row} className='flex items-center gap-4'>
              <span className='h-5 w-5 rounded-md border border-white/15 bg-white/5' />
              <span className='h-5 flex-1 rounded-full bg-white/10' />
              <span className='h-5 w-20 rounded-full bg-white/10' />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
