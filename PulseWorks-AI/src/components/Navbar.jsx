import { useState } from 'react'
import Icon from './Icon.jsx'
import './Navbar.css'

function Navbar({ search, onSearchChange, onMenuClick, onHomeClick }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="navbar">
      <button type="button" className="mobile-menu-button" onClick={onMenuClick} aria-label="Toggle navigation">
        <Icon name="menu" />
      </button>
      <a className="navbar-brand" href="#dashboard" aria-label="PulseWorks AI dashboard" onClick={onHomeClick}>
        <span className="navbar-logo" aria-hidden="true"><span /></span>
        <span>pulseworks<span className="brand-ai">.ai</span></span>
      </a>
      <div className="navbar-search">
        <Icon name="search" size={18} />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
        <kbd>⌘ K</kbd>
      </div>
      <div className="navbar-actions">
        <div className="notification-wrap">
          <button
            type="button"
            className="icon-button notification-button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <Icon name="bell" size={19} />
            <span className="notification-dot" />
          </button>
          {notificationsOpen && (
            <div className="notification-popover" role="status">
              <strong>You’re all caught up</strong>
              <p>New task updates will appear here.</p>
            </div>
          )}
        </div>
        <span className="navbar-separator" />
        <div className="profile-wrap">
          <button
            type="button"
            className="profile-button"
            aria-label="Alex Morgan, account profile"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
          >
            <span className="avatar">AM</span>
            <span className="profile-copy"><strong>Alex Morgan</strong><small>Workspace admin</small></span>
            <span className="profile-chevron" aria-hidden="true">⌄</span>
          </button>
          {profileOpen && (
            <div className="profile-popover" role="status">
              <span className="avatar">AM</span>
              <span><strong>Alex Morgan</strong><small>alex@pulseworks.ai</small></span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
