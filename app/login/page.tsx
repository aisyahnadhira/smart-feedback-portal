'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setLoading(false)

    if (!error) router.push('/')
    else setError(error.message)
  }

  return (
    <div className="container">
      <div className="login-container">
        <h1>Welcome back</h1>
        <p className="login-subtitle">Sign in to access your feedback dashboard.</p>

        {error && (
          <p className="login-subtitle" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="primary-btn" disabled={loading || !email.trim() || !password}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
