import { useMemo, useState } from 'react'
import SystemBanner from './components/SystemBanner.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import TaskCard from './components/TaskCard.jsx'
import TaskForm from './components/TaskForm.jsx'
import Analytics from './components/Analytics.jsx'
import './App.css'

const initialTasks = [
  {
    id: 1,
    title: 'Finalize onboarding flow',
    description: 'Review the latest onboarding screens and confirm the handoff states.',
    category: 'Design',
    priority: 'High',
    status: 'In progress',
    dueDate: '2026-11-29',
  },
  {
    id: 2,
    title: 'Prepare Q4 product update',
    description: 'Gather launch notes and key product metrics for the customer update.',
    category: 'Marketing',
    priority: 'Medium',
    status: 'To do',
    dueDate: '2026-12-02',
  },
  {
    id: 3,
    title: 'Review API documentation',
    description: 'Check the new endpoint examples for accuracy and consistency.',
    category: 'Engineering',
    priority: 'Low',
    status: 'To do',
    dueDate: '2026-12-04',
  },
  {
    id: 4,
    title: 'Ship workspace permissions',
    description: 'Verify role-based access and merge the final permissions updates.',
    category: 'Engineering',
    priority: 'High',
    status: 'Completed',
    dueDate: '2026-11-25',
  },
]

const pageCopy = {
  Dashboard: ['Good morning, Alex', 'Here’s what’s happening across your workspace today.'],
  Tasks: ['All tasks', 'Keep your team’s work moving forward.'],
  'Completed tasks': ['Completed tasks', 'A look at the work your team has finished.'],
  Analytics: ['Workspace analytics', 'A live snapshot of activity from your connected data source.'],
  Settings: ['Workspace settings', 'Manage your workspace preferences.'],
}

const todayLabel = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date()).toUpperCase()

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [activePage, setActivePage] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [toast, setToast] = useState('')

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesPage = activePage !== 'Completed tasks' || task.status === 'Completed'
      const matchesSearch =
        !query ||
        `${task.title} ${task.description} ${task.category}`.toLowerCase().includes(query)
      return matchesPage && matchesSearch
    })
  }, [activePage, search, tasks])

  const handleTaskCreated = (task) => {
    setTasks((currentTasks) => [{ ...task, id: Date.now() }, ...currentTasks])
    setToast('Task created successfully.')
    window.setTimeout(() => setToast(''), 3500)
  }

  const updateTaskStatus = (taskId, status) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    )
  }

  const deleteTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  const [title, description] = pageCopy[activePage]
  const completedCount = tasks.filter((task) => task.status === 'Completed').length
  const activeCount = tasks.filter((task) => task.status !== 'Completed').length

  return (
    <div className="app-shell">
      <SystemBanner />
      <Navbar
        search={search}
        onSearchChange={setSearch}
        onMenuClick={() => setShowSidebar((visible) => !visible)}
        onHomeClick={() => setActivePage('Dashboard')}
      />
      <div className="workspace">
        <Sidebar
          activePage={activePage}
          isOpen={showSidebar}
          taskCount={tasks.length}
          onNavigate={(page) => {
            setActivePage(page)
            setShowSidebar(false)
          }}
        />
        {showSidebar && (
          <button
            type="button"
            className="sidebar-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setShowSidebar(false)}
          />
        )}
        <main className="main-content" id="dashboard">
          <div className="page-heading">
            <div>
              <p className="eyebrow">{activePage === 'Dashboard' ? todayLabel : 'WORKSPACE'}</p>
              <h1>{title}</h1>
              <p className="page-description">{description}</p>
            </div>
            {activePage !== 'Settings' && activePage !== 'Analytics' && (
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowTaskForm((visible) => !visible)}
                aria-expanded={showTaskForm}
              >
                <span aria-hidden="true">+</span>
                {showTaskForm ? 'Close form' : 'New task'}
              </button>
            )}
          </div>

          {activePage === 'Dashboard' && (
            <section className="overview-grid" aria-label="Task overview">
              <article className="overview-card">
                <span className="overview-icon icon-lilac" aria-hidden="true">◷</span>
                <div><p>Active tasks</p><strong>{activeCount}</strong></div>
                <span className="overview-note">Across your workspace</span>
              </article>
              <article className="overview-card">
                <span className="overview-icon icon-mint" aria-hidden="true">✓</span>
                <div><p>Completed</p><strong>{completedCount}</strong></div>
                <span className="overview-note">Nice work, team</span>
              </article>
              <article className="overview-card">
                <span className="overview-icon icon-peach" aria-hidden="true">↗</span>
                <div>
                  <p>Due this week</p>
                  <strong>
                    {tasks.filter((task) => {
                      if (task.status === 'Completed') return false
                      const [year, month, day] = task.dueDate.split('-').map(Number)
                      const due = Date.UTC(year, month - 1, day)
                      const now = new Date()
                      const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
                      const daysUntilDue = (due - today) / 86400000
                      return daysUntilDue >= 0 && daysUntilDue <= 7
                    }).length}
                  </strong>
                </div>
                <span className="overview-note">Keep things on track</span>
              </article>
            </section>
          )}

          {showTaskForm && activePage !== 'Settings' && activePage !== 'Analytics' && (
            <TaskForm
              onTaskCreated={handleTaskCreated}
              onCancel={() => setShowTaskForm(false)}
            />
          )}

          {toast && <p className="toast-message" role="status">{toast}</p>}

          {activePage === 'Settings' ? (
            <section className="settings-card">
              <div>
                <h2>Workspace preferences</h2>
                <p>Personalize how you keep up with work in PulseWorks AI.</p>
              </div>
              <label className="settings-row">
                <span><strong>Email notifications</strong><small>Receive updates when a task is assigned to you.</small></span>
                <input type="checkbox" defaultChecked aria-label="Email notifications" />
              </label>
              <label className="settings-row">
                <span><strong>Weekly summary</strong><small>Get a Monday summary of your team's progress.</small></span>
                <input type="checkbox" aria-label="Weekly summary" />
              </label>
            </section>
          ) : activePage === 'Analytics' ? (
            <Analytics />
          ) : (
            <section className="task-section">
              <div className="section-heading">
                <div>
                  <h2>{activePage === 'Completed tasks' ? 'Recently completed' : 'Your tasks'}</h2>
                  <p>{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'} in view</p>
                </div>
                <label className="filter-label">
                  <span className="sr-only">Filter tasks by status</span>
                  <select
                    aria-label="Filter tasks by status"
                    onChange={(event) => {
                      if (event.target.value === 'all') setActivePage('Tasks')
                      else setActivePage(event.target.value)
                    }}
                    value={activePage === 'Completed tasks' ? 'Completed tasks' : 'all'}
                  >
                    <option value="all">All tasks</option>
                    <option value="Completed tasks">Completed</option>
                  </select>
                </label>
              </div>
              {visibleTasks.length > 0 ? (
                <div className="task-list">
                  {visibleTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={updateTaskStatus}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span aria-hidden="true">✦</span>
                  <h3>No tasks found</h3>
                  <p>Try a different search or create a new task to get started.</p>
                  <button type="button" className="text-button" onClick={() => setShowTaskForm(true)}>
                    Create a task
                  </button>
                </div>
              )}
            </section>
          )}
          <footer className="page-footer">Made for focused teams <span aria-hidden="true">·</span> PulseWorks AI</footer>
        </main>
      </div>
    </div>
  )
}

export default App
