import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login({onLogin}){
  const [email, setEmail] = useState('admin@bank.local')
  const [password, setPassword] = useState('Password123!')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null); setLoading(true)
    try{
      const res = await fetch('/api/auth/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({email, password})
      })
      const data = await res.json()
      if(res.ok){
        onLogin(data.token)
        navigate('/')
      } else {
        setError(data.error || 'Login failed')
      }
    }catch(err){
      setError('Network error')
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <h1 className="hero-title">Welcome to AGILE BANK</h1>
      <div className="card">
        <form onSubmit={submit} className="form" aria-label="Login form">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@bank.com" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Signing in…' : 'Login'}</button>
          {error && <div style={{color:'#b91c1c', fontWeight:600}}>{error}</div>}

          <div style={{display:'flex', justifyContent:'space-between', marginTop:6}}>
            <Link className="link" to="/forgot">Forgot password?</Link>
            <span>New user? <Link className="link" to="/signup">Sign up</Link></span>
          </div>
        </form>
      </div>
    </section>
  )
}
