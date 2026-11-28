import { useState } from 'react'
import { taskSchema } from '../schemas/taskSchema.js'
import Icon from './Icon.jsx'
import './TaskForm.css'

const emptyTask = {
  title: '',
  description: '',
  category: '',
  priority: 'Medium',
  status: 'To do',
  dueDate: '',
}

function TaskForm({ onTaskCreated, onCancel }) {
  const [values, setValues] = useState(emptyTask)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSuccess('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = taskSchema.safeParse(values)
    if (!result.success) {
      const nextErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field && !nextErrors[field]) nextErrors[field] = issue.message
      })
      setErrors(nextErrors)
      setSuccess('')
      return
    }

    onTaskCreated(result.data)
    setValues(emptyTask)
    setErrors({})
    setSuccess('Your task has been added to the workspace.')
  }

  return (
    <section className="task-form-card" aria-labelledby="task-form-title">
      <div className="task-form-heading">
        <div>
          <p className="eyebrow">NEW TASK</p>
          <h2 id="task-form-title">Create a task</h2>
          <p>Give your team a clear next step.</p>
        </div>
        <button type="button" className="form-close-button" onClick={onCancel} aria-label="Close task form">
          <Icon name="close" size={18} />
        </button>
      </div>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field form-field-wide">
          <label htmlFor="task-title">Task title</label>
          <input
            id="task-title"
            name="title"
            value={values.title}
            onChange={updateField}
            maxLength={80}
            placeholder="e.g. Plan the product launch"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'task-title-error' : undefined}
          />
          {errors.title && <span className="field-error" id="task-title-error">{errors.title}</span>}
        </div>
        <div className="form-field form-field-wide">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            name="description"
            value={values.description}
            onChange={updateField}
            maxLength={500}
            rows={3}
            placeholder="Add a few details to help your team get started..."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'task-description-error' : undefined}
          />
          {errors.description && <span className="field-error" id="task-description-error">{errors.description}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="task-category">Category</label>
          <select
            id="task-category"
            name="category"
            value={values.category}
            onChange={updateField}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'task-category-error' : undefined}
          >
            <option value="">Select category</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
          {errors.category && <span className="field-error" id="task-category-error">{errors.category}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="task-due-date">Due date</label>
          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={updateField}
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? 'task-due-date-error' : undefined}
          />
          {errors.dueDate && <span className="field-error" id="task-due-date-error">{errors.dueDate}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            name="priority"
            value={values.priority}
            onChange={updateField}
            aria-invalid={Boolean(errors.priority)}
            aria-describedby={errors.priority ? 'task-priority-error' : undefined}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && <span className="field-error" id="task-priority-error">{errors.priority}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            name="status"
            value={values.status}
            onChange={updateField}
            aria-invalid={Boolean(errors.status)}
            aria-describedby={errors.status ? 'task-status-error' : undefined}
          >
            <option value="To do">To do</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
          </select>
          {errors.status && <span className="field-error" id="task-status-error">{errors.status}</span>}
        </div>
        <div className="form-actions form-field-wide">
          <p className="form-feedback" role="status">{success}</p>
          <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="primary-button">Create task</button>
        </div>
      </form>
    </section>
  )
}

export default TaskForm
