import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Forgot from './pages/Forgot.jsx'
import Reset from './pages/Reset.jsx'
import Accounts from './pages/Accounts.jsx'
import Checking from './pages/Checking.jsx'
import Savings from './pages/Savings.jsx'
import PayTransfer from './pages/PayTransfer.jsx'
import Profile from './pages/Profile.jsx'
import SecurityCenter from './pages/SecurityCenter.jsx'
import HelpSupport from './pages/HelpSupport.jsx'
import { api } from './api.js'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [me, setMe] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    if (!token) { setMe(null); return }
    api('/api/users/me').then(setMe).catch(()=>setMe(null))
  }, [token])

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setMe(null)
    navigate('/login')
  }

  const onLogin = t => { localStorage.setItem('token',t); setToken(t); navigate('/') }

  return (
    <>
      {/* Top red bar */}
      <div className="topbar">
        <div className="wrap">
          <div className="logo">
            <div className="logo-mark">≡</div>
            <div style={{fontSize:18, letterSpacing:.3}}>AGILE BANK</div>
          </div>

          <nav className="toplinks">
            <NavLink to="/" end>Accounts</NavLink>
            <NavLink to="/pay">Pay &amp; Transfer</NavLink>
            <NavLink to="/security">Security Center</NavLink>
            <NavLink to="/help">Help &amp; Support</NavLink>
          </nav>

          <div className="topright">
            {me && <span className="badge">{me.email}</span>}
            {!token && <NavLink to="/login">Login</NavLink>}
            {!token && <NavLink to="/signup">Sign up</NavLink>}
            {token && <button className="btn btn-ghost" onClick={logout}>Log out</button>}
          </div>
        </div>
      </div>

      {/* Secondary tabs like BoA */}
      <div className="tabs">
        <div className="tab"><NavLink to="/" end className={({isActive})=> isActive?'active':''}>Dashboard</NavLink></div>
        <div className="tab"><NavLink to="/accounts/checking" className={({isActive})=> isActive?'active':''}>Checking</NavLink></div>
        <div className="tab"><NavLink to="/accounts/savings" className={({isActive})=> isActive?'active':''}>Savings</NavLink></div>
        <div className="tab"><NavLink to="/profile" className={({isActive})=> isActive?'active':''}>Profile &amp; Settings</NavLink></div>
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={<Accounts token={token} />} />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />

          <Route path="/accounts/checking" element={<Checking token={token} />} />
          <Route path="/accounts/savings" element={<Savings token={token} />} />

          <Route path="/pay" element={<PayTransfer token={token} />} />
          <Route path="/profile" element={<Profile token={token} me={me} setMe={setMe} />} />
          <Route path="/security" element={<SecurityCenter token={token} me={me} />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="*" element={<Dashboard token={token} />} />
        </Routes>

        <div className="footer">© {new Date().getFullYear()} AGILE BANK — demo UI</div>
      </div>
    </>
  )
}
