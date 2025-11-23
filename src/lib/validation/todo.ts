/*
 * Lightweight validation helpers so folks coming from Express or Prisma land
 * can still guard their data before it hits a Next.js server action. By
 * centralizing these checks here we can reuse them for toggle/create flows
 * and keep future schema tweaks in one spot.
 */
const todoIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export type ToggleTodoInput = {
  id: string
  complete: boolean
}

export type CreateTodoInput = {
  title: string
}

export type DeleteTodoInput = {
  id: string
}

export function parseToggleTodoInput(id: unknown, complete: unknown): ToggleTodoInput {
  if (typeof id !== 'string' || !todoIdPattern.test(id)) {
    throw new Error('Invalid todo identifier supplied to toggle action.')
  }

  if (typeof complete !== 'boolean') {
    throw new Error('Todo completion flag must be a boolean.')
  }

  return { id, complete }
}

export function parseCreateTodoInput(title: unknown): CreateTodoInput {
  if (typeof title !== 'string') {
    throw new Error('Todo title must be provided as plain text.')
  }

  const sanitizedTitle = title.trim().replace(/\s+/g, ' ')

  if (sanitizedTitle.length === 0) {
    throw new Error('Todo title cannot be empty.')
  }

  if (sanitizedTitle.length > 120) {
    throw new Error('Todo title must be under 120 characters.')
  }

  return { title: sanitizedTitle }
}

export function parseDeleteTodoInput(id: unknown): DeleteTodoInput {
  if (typeof id !== 'string' || !todoIdPattern.test(id)) {
    throw new Error('Invalid todo identifier supplied to delete action.')
  }

  return { id }
}
