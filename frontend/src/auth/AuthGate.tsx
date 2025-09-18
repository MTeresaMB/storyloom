// frontend/src/auth/AuthGate.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => setSession(sess))
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  if (loading) return null
  if (!session) return <AuthView />
  return <>{children}</>
}

function AuthView() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin }
      })
      if (error) throw error
      setInfo('Link sent. Check your email to continue.')
    } catch (err: any) {
      setError(err?.message ?? 'Authentication error')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded border w-96 space-y-3">
        <h1 className="text-xl font-semibold">Enter with Magic Link</h1>

        <input
          className="w-full px-3 py-2 border rounded"
          type="email"
          placeholder="you@email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-green-600">{info}</p>}

        <button className="w-full bg-blue-600 text-white rounded py-2">Send link</button>
      </form>
    </div>
  )
}

export function LogoutButton() {
  return (
    <button
      className="border rounded px-3 py-1 text-sm"
      onClick={async () => {
        await supabase.auth.signOut()
        window.location.reload()
      }}
    >
      Logout
    </button>
  )
}