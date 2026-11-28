const defaultAnalyticsApiUrl = 'https://jsonplaceholder.typicode.com/todos'

export function getAnalyticsApiUrl() {
  const configuredUrl = import.meta.env.VITE_ANALYTICS_API_URL || defaultAnalyticsApiUrl
  let url

  try {
    url = new URL(configuredUrl)
  } catch {
    throw new Error('The analytics API URL is not a valid URL.')
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('The analytics API URL must use HTTP or HTTPS.')
  }

  return url.toString()
}
