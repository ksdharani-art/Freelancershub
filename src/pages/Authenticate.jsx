import React, { useState } from 'react'
import Login from './login'
import Register from '../components/Register'

export default function Authenticate() {
  const [mode, setMode] = useState('login')
  return (
    <div className="auth-wrapper">
      <div className="auth-switch">
        <button onClick={() => setMode('login')}>Login</button>
        <button onClick={() => setMode('register')}>Register</button>
      </div>
      {mode === 'login' ? <Login /> : <Register />}
    </div>
  )
}
