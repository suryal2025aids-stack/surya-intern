import { useEffect, useState } from 'react'
import './SystemBanner.css'

function getLocalTime() {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date())
}

function SystemBanner() {
  const [time, setTime] = useState(getLocalTime)
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const updateTime = () => setTime(getLocalTime())
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    const intervalId = window.setInterval(updateTime, 1000)

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return (
    <div className="system-banner" aria-label="System status">
      <div className="system-brand">
        <span className="brand-mark" aria-hidden="true"><span /></span>
        <span>PulseWorks <strong>AI</strong></span>
      </div>
      <div className="system-details">
        <span className="system-clock"><span aria-hidden="true">◷</span> Local time <strong>{time}</strong></span>
        <span className="system-divider" aria-hidden="true" />
        <span className={`connection-status ${isOnline ? 'is-online' : 'is-offline'}`} role="status">
          <span className="connection-dot" aria-hidden="true" />
          {isOnline ? 'All systems operational' : 'You are offline'}
        </span>
      </div>
    </div>
  )
}

export default SystemBanner
