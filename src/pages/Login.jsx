import { useState } from 'react'
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError('Алдаа гарлаа: ' + err.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', padding: '40px', width: '100%', maxWidth: '420px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', textAlign: 'center', marginBottom: '8px' }}>EUNOIA</h1>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '24px' }}>
          {isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}
        </p>

        {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            placeholder="И-мэйл"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '12px 16px', outline: 'none', fontSize: '14px' }}
          />
          <input
            type="password"
            placeholder="Нууц үг"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '12px 16px', outline: 'none', fontSize: '14px' }}
          />
          <button
            type="submit"
            style={{ background: '#8EC5FF', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
          >
            {isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '16px' }}>
          {isLogin ? 'Бүртгэл байхгүй юу?' : 'Бүртгэлтэй юу?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#8EC5FF', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' }}
          >
            {isLogin ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </p>
      </div>
    </div>
  )
}