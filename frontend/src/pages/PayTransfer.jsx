import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function PayTransfer(){
  const [accts, setAccts] = useState([])
  const [fromId, setFrom] = useState('')
  const [toId, setTo]   = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(()=>{ api('/api/accounts/me').then(setAccts).catch(()=>{}) },[])

  async function submit(e){
    e.preventDefault()
    setMsg(null); setErr(null)
    try{
      await api('/api/transfers', { method:'POST', body: { fromId: Number(fromId), toId: Number(toId), amount: Number(amount), memo }})
      setMsg('Transfer complete.')
      setAmount(''); setMemo('')
      // refresh balances
      setTimeout(()=>api('/api/accounts/me').then(setAccts), 200)
    }catch(ex){ setErr(ex.message) }
  }

  return (
    <section className="section">
      <h1 className="hero-title">Pay &amp; Transfer</h1>
      <div className="card">
        <form className="form" onSubmit={submit}>
          <div className="grid-2">
            <div>
              <label className="label">From account</label>
              <select className="input" value={fromId} onChange={e=>setFrom(e.target.value)} required>
                <option value="" disabled>Select account</option>
                {accts.map(a=> <option key={a.id} value={a.id}>{a.type} • #{a.id} • ${Number(a.balance).toFixed(2)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">To account</label>
              <select className="input" value={toId} onChange={e=>setTo(e.target.value)} required>
                <option value="" disabled>Select account</option>
                {accts.map(a=> <option key={a.id} value={a.id}>{a.type} • #{a.id} • ${Number(a.balance).toFixed(2)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div>
              <label className="label">Amount (USD)</label>
              <input className="input" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="25.00" required />
            </div>
            <div>
              <label className="label">Memo (optional)</label>
              <input className="input" value={memo} onChange={e=>setMemo(e.target.value)} placeholder="Dinner" />
            </div>
          </div>
          <button className="btn btn-primary">Submit transfer</button>
          {msg && <div style={{color:'#065f46', fontWeight:600}}>{msg}</div>}
          {err && <div style={{color:'#b91c1c', fontWeight:600}}>{err}</div>}
        </form>
      </div>
    </section>
  )
}
