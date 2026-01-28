'use client'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase/client'
import { useRouter } from 'next/navigation'

type Feedback = {
  id: string
  title: string
  description: string
  status: string
  category: string | null
  priority: string | null
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const router = useRouter()

  const fetchFeedbacks = async () => {
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setFeedbacks(data)
  }

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
        return
      }

      setUserId(data.user.id)
      await fetchFeedbacks()
      setLoading(false)
    }

    init()
  }, [router])

  const handleSubmit = async () => {
    if (!userId) return
    if (!title || !description) {
      alert('Title and description are required')
      return
    }

    await supabase.from('feedback').insert({
      user_id: userId,
      title,
      description,
    })
    setTitle('')
    setDescription('')
    fetchFeedbacks()
  }


  if (loading) return <p className="loading">Loading...</p>

  return (
    <div className="container">
      <div className="dashboard-container">
        <div className="card header-card">
          <div>
            <h1>Feedback Dashboard</h1>
            <p className="header-subtitle">Track and manage your submitted feedback.</p>
          </div>
          <button
            className="logout-btn"
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/login')
            }}
          >
            Logout
          </button>
        </div>

        <div className="card">
          <h2>Submit Feedback</h2>
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="textarea"
            placeholder="Describe your feedback"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="primary-btn"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        <div className="card">
          <h2>Your Feedback</h2>

          {feedbacks.length === 0 && (
            <p className="empty-text">No feedback yet. Start by submitting one above.</p>
          )}

          {feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-item">
              <p className="feedback-title">{fb.title}</p> 
              <p className="feedback-status"> Status: <span>{fb.status}</span> </p>

              {fb.status === 'Processed' && (
                <p className="feedback-meta">
                  {fb.category} · {fb.priority}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
