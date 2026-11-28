import { z } from 'zod'

const requiredText = (label, maxLength) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`)

const dueDateSchema = z
  .string()
  .trim()
  .min(1, 'Due date is required.')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid due date.')
  .refine((value) => {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    return (
      !Number.isNaN(date.getTime()) &&
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    )
  }, 'Enter a valid due date.')

export const taskSchema = z.strictObject({
  title: requiredText('Task title', 80),
  description: requiredText('Description', 500),
  category: z.enum(['Product', 'Design', 'Engineering', 'Marketing', 'Operations'], {
    error: 'Choose a task category.',
  }),
  priority: z.enum(['Low', 'Medium', 'High'], {
    error: 'Choose a priority.',
  }),
  status: z.enum(['To do', 'In progress', 'Completed'], {
    error: 'Choose a status.',
  }),
  dueDate: dueDateSchema,
})
