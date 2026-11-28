import Icon from './Icon.jsx'
import './TaskCard.css'

function formatDueDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
    new Date(year, month - 1, day),
  )
}

function TaskCard({ task, onStatusChange, onDelete }) {
  const isComplete = task.status === 'Completed'

  return (
    <article className={`task-card${isComplete ? ' task-card-completed' : ''}`}>
      <button
        type="button"
        className={`task-check${isComplete ? ' task-check-checked' : ''}`}
        aria-label={isComplete ? `Reopen ${task.title}` : `Complete ${task.title}`}
        onClick={() => onStatusChange(task.id, isComplete ? 'To do' : 'Completed')}
      >
        {isComplete ? <Icon name="check" size={14} /> : null}
      </button>
      <div className="task-card-main">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            <span aria-hidden="true" />{task.priority}
          </span>
        </div>
        <p className="task-description">{task.description}</p>
        <div className="task-metadata">
          <span className="category-badge">{task.category}</span>
          <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
            {task.status}
          </span>
          <span className="task-due-date"><Icon name="calendar" size={14} /> Due {formatDueDate(task.dueDate)}</span>
        </div>
      </div>
      <button
        type="button"
        className="task-delete-button"
        aria-label={`Delete ${task.title}`}
        onClick={() => onDelete(task.id)}
      >
        <Icon name="trash" size={16} />
      </button>
    </article>
  )
}

export default TaskCard
