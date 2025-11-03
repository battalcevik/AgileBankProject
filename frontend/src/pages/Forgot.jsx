import React, { useState } from 'react'

export default function Forgot(){
  const [email, setEmail] = useState('admin@bank.local')
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)

  const submit = async e => {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/auth/forgot-password', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email})
    })
    const data = await res.json()
    if(res.ok) setToken(data.resetToken)
    else setError(data.error || 'Request failed')
  }

  return (<div>
    <h3>Forgot password</h3>
    <form onSubmit={submit} style={{display:'grid', gap:10, maxWidth:400}}>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <button>Request reset token</button>
    </form>
    {token && <div>Reset token (demo): <code>{token}</code></div>}
    {error && <div style={{color:'red'}}>{error}</div>}
  </div>)
}
