import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)

    if (ok) {
      navigate('/admin')
    } else {
      setError('Credenciales incorrectas')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20">
      <h1 className="text-xl mb-4">Login</h1>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button className="bg-black text-white px-4 py-2 w-full">
        Entrar
      </button>
    </form>
  )
}
