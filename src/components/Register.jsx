import React, { useState } from 'react'

export default function Register({ onRegistered }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('client')

  const submit = (e) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('fh_users') || '[]')
    users.push({ id: `u${users.length + 1}`, name, email, password, role })
    localStorage.setItem('fh_users', JSON.stringify(users))
    if (onRegistered) onRegistered()
  }

  return (
    <div className="auth-card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
        <button type="submit">Create Account</button>
      </form>
    </div>
  )
}
