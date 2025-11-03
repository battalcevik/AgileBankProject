import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

export default function Accounts(){
  const [me, setMe] = useState(null)
  const [accts, setAccts] = useState([])

  useEffect(()=>{ api('/api/users/me').then(setMe).catch(() => {}) },[])
  useEffect(()=>{ api('/api/accounts/me').then(setAccts).catch(() => {}) },[])

  const checking = accts.filter(a=>a.type==='CHECKING')
  const savings  = accts.filter(a=>a.type==='SAVINGS')

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
        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <div style={{fontWeight:800}}>CHECKING</div>
            <Link className="link" to="/accounts/checking">Details</Link>
          </div>
          <div style={{marginTop:8, fontSize:26, fontWeight:800, color:'var(--brand-blue)'}}>
            ${checking.reduce((s,a)=>s+Number(a.balance||0),0).toFixed(2)}
          </div>
        </div>

        <div className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <div style={{fontWeight:800}}>SAVINGS</div>
            <Link className="link" to="/accounts/savings">Details</Link>
          </div>
          <div style={{marginTop:8, fontSize:26, fontWeight:800, color:'var(--brand-blue)'}}>
            ${savings.reduce((s,a)=>s+Number(a.balance||0),0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="tilegrid">
          <div className="tile">
            <h4>Pay Bills</h4>
            <p>Set up one-time or recurring payments.</p>
            <div style={{marginTop:10}}>
              <Link className="btn btn-primary" to="/pay">Pay &amp; Transfer</Link>
            </div>
          </div>
          <div className="tile">
            <h4>Security Center</h4>
            <p>Reset your password and manage sessions.</p>
            <div style={{marginTop:10}}><Link className="link" to="/security">Go to Security</Link></div>
          </div>
          <div className="tile">
            <h4>Help &amp; Support</h4>
            <p>Find FAQs and contact options.</p>
            <div style={{marginTop:10}}><Link className="link" to="/help">Get help</Link></div>
          </div>
        </div>
      </div>
    </section>
  )
}
