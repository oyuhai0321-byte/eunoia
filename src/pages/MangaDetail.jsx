import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase/config'
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'

export default function MangaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const mangaDoc = await getDoc(doc(db, 'manga', id))
      if (mangaDoc.exists()) {
        setManga({ id: mangaDoc.id, ...mangaDoc.data() })
      }
      const chaptersSnap = await getDocs(
        query(collection(db, 'manga', id, 'chapters'), orderBy('chapterNumber'))
      )
      const chaptersData = chaptersSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      setChapters(chaptersData)
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Ачаалж байна...</div>
  if (!manga) return <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Manga олдсонгүй</div>

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF' }}>
      <nav style={{ background: 'white', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#8EC5FF' }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#8EC5FF' }}>EUNOIA</h1>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
          <img
            src={manga.cover}
            alt={manga.title}
            style={{ width: '200px', borderRadius: '16px', objectFit: 'cover' }}
          />
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1F2937', marginBottom: '8px' }}>{manga.title}</h2>
            <span style={{ background: '#EEF6FF', color: '#8EC5FF', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
              {manga.genre}
            </span>
            <p style={{ color: '#6B7280', marginTop: '16px', lineHeight: '1.7' }}>{manga.description}</p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>
            Chapters ({chapters.length})
          </h3>
          {chapters.length === 0 ? (
            <p style={{ color: '#9CA3AF' }}>Chapter байхгүй байна</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chapters.map(chapter => (
                <div
                  key={chapter.id}
                  onClick={() => navigate(`/manga/${id}/chapter/${chapter.id}`)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #eee', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ fontWeight: '600', color: '#1F2937' }}>Chapter {chapter.chapterNumber}: {chapter.title}</span>
                  <span style={{ color: '#8EC5FF', fontSize: '18px' }}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}