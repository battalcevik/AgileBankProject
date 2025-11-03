import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Profile(){
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', address:'', phone:'' })
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(()=>{
    api('/api/users/me').then((u)=>{
      setForm({ firstName:u.firstName, lastName:u.lastName, email:u.email, address:u.address, phone:u.phone })
    }).catch(()=>{})
  },[])

  const update = (k,v)=> setForm({...form, [k]: v})

  async function save(e){
    e.preventDefault(); setMsg(null); setErr(null)
    try{
      const u = await api('/api/users/me', { method:'PUT', body: { address: form.address, phone: form.phone } })
      setMsg('Profile updated.')
    }catch(ex){ setErr(ex.message) }
  }

  return (
    <section className="section">
      <h1 className="hero-title">Profile &amp; Settings</h1>
      <div className="card">
        <form className="form" onSubmit={save}>
          <div className="grid-2">
            <div><label className="label">First name</label><input className="input" value={form.firstName} disabled /></div>
            <div><label className="label">Last name</label><input className="input" value={form.lastName} disabled /></div>
          </div>
          <div><label className="label">Email</label><input className="input" value={form.email} disabled /></div>
          <div><label className="label">Address</label><input className="input" value={form.address} onChange={e=>update('address',e.target.value)} /></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e=>update('phone',e.target.value)} /></div>
          <button className="btn btn-primary">Save changes</button>
          {msg && <div style={{color:'#065f46', fontWeight:600}}>{msg}</div>}
          {err && <div style={{color:'#b91c1c', fontWeight:600}}>{err}</div>}
        </form>
      </div>
    </section>
  )
}
