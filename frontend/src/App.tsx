import { useEffect, useState } from 'react'
import { trpc } from './trpc'

function App() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    trpc.health
      .query()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main>
      <h1>Recipes</h1>
      <p>Backend health check: {status}</p>
    </main>
  )
}

export default App
