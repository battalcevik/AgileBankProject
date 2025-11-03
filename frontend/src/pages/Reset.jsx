import React, { useState } from 'react'

export default function Reset(){
  const [token, setToken] = useState('')
  const [pwd, setPwd] = useState('NewPassword123!')
  const [msg, setMsg] = useState(null)

  const submit = async e => {
    e.preventDefault()
    const res = await fetch('/api/auth/reset-password', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({token, newPassword: pwd})
    })
    const data = await res.json()
    if(res.ok) setMsg('Password reset successful!')
    else setMsg(data.error || 'Reset failed')
  }

  return (<div>
    <h3>Reset password</h3>
    <form onSubmit={submit} style={{display:'grid', gap:10, maxWidth:400}}>
      <input placeholder="Reset token" value={token} onChange={e=>setToken(e.target.value)} />
      <input type="password" placeholder="New password" value={pwd} onChange={e=>setPwd(e.target.value)} />
      <button>Reset</button>
    </form>
    {msg && <div>{msg}</div>}
  </div>)
}
