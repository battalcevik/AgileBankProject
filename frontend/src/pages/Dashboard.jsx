import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard({token}){
  const [me, setMe] = useState(null)
  const [accounts, setAccounts] = useState([])

  useEffect(()=>{
    if(!token) return
    fetch('/api/users/me', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r=>r.json()).then(setMe)
    fetch('/api/accounts/me', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r=>r.json()).then(setAccounts)
  }, [token])

  if(!token) return (
    <section className="section">
      <div className="card">
        Please <Link className="link" to="/login">log in</Link> to see your dashboard.
      </div>
    </section>
  )

  return (
    <section className="section">
      <h1 className="hero-title">Your accounts</h1>

      {me && (
        <div className="card" style={{marginBottom:14}}>
          <div style={{fontWeight:800, color:'var(--brand-blue)', fontSize:18}}>
            {me.firstName} {me.lastName}
          </div>
          <div style={{color:'var(--muted)'}}>{me.email}</div>
          <div style={{marginTop:8}}>{me.address} · {me.phone}</div>
        </div>
      )}

      <div className="card-grid">
        {accounts.map(a=>(
          <div key={a.id} className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
              <div style={{fontWeight:800}}>{a.type}</div>
              <div style={{color:'var(--muted)', fontSize:12}}>Account #{a.id}</div>
            </div>
            <div style={{marginTop:8, fontSize:26, fontWeight:800, color:'var(--brand-blue)'}}>
              ${Number(a.balance).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
