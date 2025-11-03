import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Checking(){
  const [accts, setAccts] = useState([])
  useEffect(()=>{ api('/api/accounts/me').then(setAccts).catch(()=>{}) },[])
  const list = accts.filter(a=>a.type==='CHECKING')

  return (
    <section className="section">
      <h1 className="hero-title">Checking</h1>
      {list.map(a=>(
        <div key={a.id} className="card" style={{marginBottom:12}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div style={{fontWeight:800, color:'var(--brand-blue)'}}>Account #{a.id}</div>
            <div style={{fontSize:24, fontWeight:800}}>${Number(a.balance).toFixed(2)}</div>
          </div>
        </div>
      ))}
    </section>
  )
}
