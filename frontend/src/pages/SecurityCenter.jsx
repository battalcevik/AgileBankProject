import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function SecurityCenter(){
  const [email,setEmail] = useState('')
  const [token,setToken] = useState('')
  const [msg,setMsg] = useState(null)
  const [err,setErr] = useState(null)
  const [sessionId,setSessionId] = useState('')

  useEffect(()=>{
    api('/api/users/me').then(u=> setEmail(u.email)).catch(()=>{})
    // show current session by pinging login with no effect? we'll expose it via /api/users/me/session later if needed
  },[])

  async function sendReset(){
    setMsg(null); setErr(null)
    try{
      const res = await api('/api/auth/forgot-password',{ method:'POST', body:{ email }})
      setToken(res.resetToken)
      setMsg('Reset token generated (demo: displayed below).')
    }catch(ex){ setErr(ex.message) }
  }

  async function applyReset(){
    setMsg(null); setErr(null)
    const newPassword = prompt('Enter new password:')
    if(!newPassword) return
    try{
      await api('/api/auth/reset-password',{ method:'POST', body:{ token, newPassword }})
      setMsg('Password updated. You can log out and sign in with the new password.')
    }catch(ex){ setErr(ex.message) }
  }

  return (
    <section className="section">
      <h1 className="hero-title">Security Center</h1>
      <div className="card">
        <div className="form">
          <div><strong>Signed in as:</strong> {email || '...'}</div>
          <div style={{fontSize:12, color:'var(--muted)'}}>Session ID is set server-side when you log in.</div>
          <div>
            <button className="btn btn-primary" onClick={sendReset}>Generate password reset token</button>
          </div>
          {token && (
            <div className="card" style={{background:'#f8fafc'}}>
              <div><strong>Demo reset token:</strong> {token}</div>
              <button className="btn btn-ghost" onClick={applyReset} style={{marginTop:8}}>Apply reset with this token</button>
            </div>
          )}
          {msg && <div style={{color:'#065f46', fontWeight:600}}>{msg}</div>}
          {err && <div style={{color:'#b91c1c', fontWeight:600}}>{err}</div>}
        </div>
      </div>
    </section>
  )
}
