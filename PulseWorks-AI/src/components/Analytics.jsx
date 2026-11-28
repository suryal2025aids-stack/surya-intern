import { useEffect, useState } from 'react'
import { fetchAnalytics } from '../services/analyticsApi.js'
import './Analytics.css'

function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    Promise.resolve()
      .then(() => {
        if (controller.signal.aborted) return null
        return fetchAnalytics(controller.signal)
      })
      .then((result) => {
        if (!result || controller.signal.aborted) return
        setAnalytics(result)
        setIsLoading(false)
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Analytics could not be loaded. Please try again.')
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [retry])

  if (isLoading) {
    return (
      <section className="analytics-state" aria-busy="true" aria-live="polite">
        <span className="analytics-spinner" aria-hidden="true" />
        <p>Loading workspace analytics…</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="analytics-state analytics-error" role="alert">
        <h2>Analytics are unavailable</h2>
        <p>{error}</p>
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setIsLoading(true)
            setError('')
            setRetry((value) => value + 1)
          }}
        >
          Try again
        </button>
      </section>
    )
  }

  const completionRate = Math.round((analytics.completed / analytics.total) * 100)

  return (
    <section className="analytics-content" aria-label="Workspace analytics">
      <div className="analytics-summary">
        <article className="analytics-stat">
          <span className="analytics-stat-icon icon-lilac" aria-hidden="true">▤</span>
          <div><p>Total items</p><strong>{analytics.total}</strong></div>
          <span className="analytics-stat-note">From connected data</span>
        </article>
        <article className="analytics-stat">
          <span className="analytics-stat-icon icon-mint" aria-hidden="true">✓</span>
          <div><p>Completed</p><strong>{analytics.completed}</strong></div>
          <span className="analytics-stat-note">{completionRate}% completion rate</span>
        </article>
        <article className="analytics-stat">
          <span className="analytics-stat-icon icon-peach" aria-hidden="true">◷</span>
          <div><p>Remaining</p><strong>{analytics.pending}</strong></div>
          <span className="analytics-stat-note">Items remaining</span>
        </article>
      </div>

      <section className="analytics-chart" aria-labelledby="analytics-chart-title">
        <div className="analytics-chart-heading">
          <div>
            <h2 id="analytics-chart-title">Completion by team member</h2>
            <p>Completed items compared with each member’s total.</p>
          </div>
          <span className="analytics-source">External API</span>
        </div>
        <ul className="analytics-user-list">
          {analytics.users.map(({ userId, total, completed }) => {
            const percent = Math.round((completed / total) * 100)
            return (
              <li className="analytics-user-row" key={userId}>
                <span className="analytics-user-name">Member {userId}</span>
                <div
                  className="analytics-progress"
                  role="progressbar"
                  aria-label={`Member ${userId} completion`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={percent}
                >
                  <span style={{ width: `${percent}%` }} />
                </div>
                <span className="analytics-user-count">{completed} / {total}</span>
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}

export default Analytics
