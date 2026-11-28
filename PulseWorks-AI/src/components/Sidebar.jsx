import Icon from './Icon.jsx'
import './Sidebar.css'

const navigation = [
  { label: 'Dashboard', icon: 'grid' },
  { label: 'Tasks', icon: 'tasks' },
  { label: 'Analytics', icon: 'chart' },
]

function Sidebar({ activePage, isOpen, taskCount, onNavigate }) {
  return (
    <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`} aria-label="Main navigation">
      <p className="sidebar-label">WORKSPACE</p>
      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <button
            type="button"
            key={item.label}
            className={`nav-item${activePage === item.label || (item.label === 'Tasks' && activePage === 'Completed tasks') ? ' nav-item-active' : ''}`}
            onClick={() => onNavigate(item.label)}
            aria-current={activePage === item.label || (item.label === 'Tasks' && activePage === 'Completed tasks') ? 'page' : undefined}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
            {item.label === 'Tasks' && <span className="nav-count">{taskCount}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <p className="sidebar-label">PREFERENCES</p>
        <button
          type="button"
          className={`nav-item${activePage === 'Settings' ? ' nav-item-active' : ''}`}
          onClick={() => onNavigate('Settings')}
          aria-current={activePage === 'Settings' ? 'page' : undefined}
        >
          <Icon name="settings" size={18} />
          <span>Settings</span>
        </button>
        <div className="sidebar-help">
          <div className="help-spark" aria-hidden="true">✦</div>
          <strong>Need a hand?</strong>
          <p>Visit our help center for tips and answers.</p>
          <a href="mailto:support@pulseworks.ai">Get help <span aria-hidden="true">→</span></a>
        </div>
        <p className="sidebar-version">PulseWorks AI <span>·</span> v1.0</p>
      </div>
    </aside>
  )
}

export default Sidebar
