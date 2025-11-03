import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [form, setForm] = useState({
    email:'user1@bank.local',
    password:'Password123!',
    firstName:'First',
    lastName:'Last',
    address:'123 Anywhere St',
    phone:'555-2221212',
    ssn7:'7654321'
  })
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  // SSN helpers
  const onSsnChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 7) // only digits, max 7
    update('ssn7', cleaned)
  }
  const ssnValid = useMemo(() => /^\d{7}$/.test(form.ssn7), [form.ssn7])

  const submit = async e => {
    e.preventDefault()
    setMsg(null); setErr(null)

    if (!ssnValid) {
      setErr('SSN must be exactly 7 digits.')
      return
    }

    setLoading(true)
    try{
      const res = await fetch('/api/auth/signup', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          phone: form.phone,
          ssn7: form.ssn7  // already cleaned
        })
      })
      const data = await res.json().catch(()=> ({}))
      if(res.ok){
        setMsg('Registered! Redirecting to login…')
        setTimeout(()=>navigate('/login'), 900)
      } else {
        setErr(data.error || data.message || `Signup failed (${res.status})`)
      }
    }catch(ex){
      setErr('Network error')
    }finally{
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <h1 className="hero-title">Create your AGILE BANK account</h1>
      <div className="card">
        <form onSubmit={submit} className="form" aria-label="Sign up form">
          <div>
            <label className="label" htmlFor="email">Email (unique)</label>
            <input
              id="email"
              className="input"
              value={form.email}
              onChange={e=>update('email', e.target.value)}
              placeholder="you@bank.com"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={form.password}
              onChange={e=>update('password', e.target.value)}
              required
            />
          </div>

          <div className="grid-2">
            <div>
              <label className="label" htmlFor="first">First name</label>
              <input
                id="first"
                className="input"
                value={form.firstName}
                onChange={e=>update('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="last">Last name</label>
              <input
                id="last"
                className="input"
                value={form.lastName}
                onChange={e=>update('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="address">Address</label>
            <input
              id="address"
              className="input"
              value={form.address}
              onChange={e=>update('address', e.target.value)}
              required
            />
          </div>

          <div className="grid-2">
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input
                id="phone"
                className="input"
                value={form.phone}
                onChange={e=>update('phone', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="ssn7">SSN (7 digits)</label>
              <input
                id="ssn7"
                className="input"
                value={form.ssn7}
                onChange={onSsnChange}
                inputMode="numeric"
                pattern="^[0-9]{7}$"
                title="Enter exactly 7 digits"
                maxLength={7}
                placeholder="e.g. 3321212"
                required
              />
            </div>
          </div>

          <button className="btn btn-primary" disabled={loading || !ssnValid}>
            {loading ? 'Creating…' : 'Create account'}
          </button>

          {msg && <div style={{color:'#065f46', fontWeight:600}} role="status" aria-live="polite">{msg}</div>}
          {err && <div style={{color:'#b91c1c', fontWeight:600}} role="alert">{err}</div>}
        </form>
      </div>
    </section>
  )
}
