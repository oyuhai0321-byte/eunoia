import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { auth, db } from '../firebase/config'
import { signOut } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

function MangaCard({ manga }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/manga/${manga.id}`)}
      style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <img src={manga.cover} alt={manga.title} style={{ width: '100%' }} />
      <div style={{ padding: '12px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' }}>{manga.title}</h3>
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{manga.genre}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [mangaList, setMangaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchManga = async () => {
      const snapshot = await getDocs(collection(db, 'manga'))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMangaList(data)
      setLoading(false)
    }
    fetchManga()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
  }

const filteredManga = search.trim() === '' 
  ? mangaList 
  : mangaList.filter(manga =>
      manga.title && manga.title.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <nav style={{ background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#8EC5FF' }}>EUNOIA</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              style={{ background: '#F4C95D', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
            >
              Admin
            </button>
          )}
          <span style={{ color: '#6B7280', fontSize: '14px' }}>{user?.email}</span>
          <button
            onClick={handleLogout}
            style={{ background: '#8EC5FF', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
          >
            Гарах
          </button>
        </div>
      </nav>

      <div style={{ background: '#EEF6FF', padding: '64px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '800', color: '#1F2937', marginBottom: '12px' }}>EUNOIA</h2>
        <p style={{ color: '#6B7280', fontSize: '18px', marginBottom: '24px' }}>Таны унших дараагийн ертөнц</p>
        <input
          type="text"
          placeholder="Manga хайх..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ border: '1px solid #ddd', borderRadius: '24px', padding: '12px 24px', width: '100%', maxWidth: '480px', outline: 'none', fontSize: '16px', background: 'white' }}
        />
      </div>

      <div style={{ padding: '40px 32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#374151', marginBottom: '24px' }}>
          {search ? `"${search}" хайлтын үр дүн` : 'Алдартай Manga'}
        </h3>
        {loading ? (
          <p style={{ color: '#9CA3AF' }}>Ачаалж байна...</p>
        ) : filteredManga.length === 0 ? (
          <p style={{ color: '#9CA3AF' }}>Manga олдсонгүй</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
            {filteredManga.map(manga => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}