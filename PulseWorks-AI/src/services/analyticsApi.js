import { z } from 'zod'
import { getAnalyticsApiUrl } from '../config/api.js'

const todoSchema = z.strictObject({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string().min(1).max(500),
  completed: z.boolean(),
})

const todosSchema = z.array(todoSchema).min(1).max(500)

export async function fetchAnalytics(signal) {
  const response = await fetch(getAnalyticsApiUrl(), {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Analytics request failed (HTTP ${response.status}).`)
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new Error('The analytics API returned invalid JSON.')
  }

  const result = todosSchema.safeParse(payload)
  if (!result.success) {
    throw new Error('The analytics API returned data in an unexpected format.')
  }

  const todos = result.data
  const userStats = new Map()
  let completed = 0

  for (const todo of todos) {
    const stats = userStats.get(todo.userId) ?? { total: 0, completed: 0 }
    stats.total += 1
    if (todo.completed) {
      stats.completed += 1
      completed += 1
    }
    userStats.set(todo.userId, stats)
  }

  return {
    total: todos.length,
    completed,
    pending: todos.length - completed,
    users: [...userStats.entries()]
      .sort(([left], [right]) => left - right)
      .map(([userId, stats]) => ({ userId, ...stats })),
  }
}
