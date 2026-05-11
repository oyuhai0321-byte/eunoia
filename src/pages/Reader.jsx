import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

export default function Reader() {
  const { mangaId, chapterId } = useParams()
  const navigate = useNavigate()
  const [chapter, setChapter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChapter = async () => {
      const chapterDoc = await getDoc(doc(db, 'manga', mangaId, 'chapters', chapterId))
      if (chapterDoc.exists()) {
        setChapter({ id: chapterDoc.id, ...chapterDoc.data() })
      }
      setLoading(false)
    }
    fetchChapter()
  }, [mangaId, chapterId])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Ачаалж байна...</div>
  if (!chapter) return <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>Chapter олдсонгүй</div>

  return (
    <div style={{ minHeight: '100vh', background: '#111' }}>
   <nav style={{ background: '#1a1a1a', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <button
          onClick={() => navigate(`/manga/${mangaId}`)}
          style={{ background: 'none', border: 'none', color: '#8EC5FF', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
        >
          ← Буцах
        </button>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>
          Chapter {chapter.chapterNumber}: {chapter.title}
        </span>
        <span style={{ color: '#6B7280', fontSize: '13px' }}>{chapter.pages?.length} хуудас</span>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
        {chapter.pages?.length === 0 ? (
          <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '40px' }}>Зураг байхгүй байна</p>
        ) : (
          chapter.pages?.map((page, index) => (
            <img
              key={index}
              src={page}
              alt={`Хуудас ${index + 1}`}
              style={{ width: '100%', display: 'block', marginBottom: '4px' }}
            />
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '32px' }}>
        <button
          onClick={() => navigate(`/manga/${mangaId}`)}
          style={{ background: '#8EC5FF', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 32px', fontWeight: '700', cursor: 'pointer', fontSize: '15px' }}
        >
          ← Manga руу буцах
        </button>
      </div>
    </div>
  )
}