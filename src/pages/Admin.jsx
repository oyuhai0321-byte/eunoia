import { useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const navigate = useNavigate()
  const [mangaList, setMangaList] = useState([])
  const [form, setForm] = useState({ title: '', description: '', genre: '', cover: '' })
  const [chapterForm, setChapterForm] = useState({ mangaId: '', chapterNumber: '', title: '', pages: '' })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('manga')

  useEffect(() => {
    fetchManga()
  }, [])

  const fetchManga = async () => {
    const snapshot = await getDocs(collection(db, 'manga'))
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setMangaList(data)
  }

  const handleAddManga = async () => {
    if (!form.title) return
    setLoading(true)
    await addDoc(collection(db, 'manga'), {
      ...form,
      createdAt: new Date().toISOString()
    })
    setForm({ title: '', description: '', genre: '', cover: '' })
    await fetchManga()
    setLoading(false)
  }

  const handleAddChapter = async () => {
    if (!chapterForm.mangaId || !chapterForm.chapterNumber) return
    setLoading(true)
    const pages = chapterForm.pages.split('\n').map(p => p.trim()).filter(p => p)
    await addDoc(collection(db, 'manga', chapterForm.mangaId, 'chapters'), {
      chapterNumber: Number(chapterForm.chapterNumber),
      title: chapterForm.title,
      pages: pages,
      createdAt: new Date().toISOString()
    })
    setChapterForm({ mangaId: '', chapterNumber: '', title: '', pages: '' })
    setLoading(false)
    alert('Chapter амжилттай нэмэгдлээ!')
  }

  const handleDeleteManga = async (id) => {
    await deleteDoc(doc(db, 'manga', id))
    await fetchManga()
  }

  const tabStyle = (tab) => ({
    padding: '10px 24px',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    background: activeTab === tab ? '#8EC5FF' : '#EEF6FF',
    color: activeTab === tab ? 'white' : '#8EC5FF',
    transition: 'all 0.2s'
  })

  return (
    <div style={{ minHeight: '100vh', background: '#F8FBFF', padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#8EC5FF' }}>Admin Dashboard</h1>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '14px' }}>← Нүүр хуудас</button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button style={tabStyle('manga')} onClick={() => setActiveTab('manga')}>Manga нэмэх</button>
        <button style={tabStyle('chapter')} onClick={() => setActiveTab('chapter')}>Chapter нэмэх</button>
        <button style={tabStyle('list')} onClick={() => setActiveTab('list')}>Manga жагсаалт</button>
      </div>

      {activeTab === 'manga' && (
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>Manga нэмэх</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input placeholder="Гарчиг" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '10px 16px', outline: 'none', fontSize: '14px' }} />
            <input placeholder="Тайлбар" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '10px 16px', outline: 'none', fontSize: '14px' }} />
            <input placeholder="Төрөл (Action, Fantasy...)" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}
              style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '10px 16px', outline: 'none', fontSize: '14px' }} />
            <input placeholder="Cover зургийн URL" value={form.cover} onChange={e => setForm({ ...form, cover: e.target.value })}
              style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '10px 16px', outline: 'none', fontSize: '14px' }} />
            <button onClick={handleAddManga} disabled={loading}
              style={{ background: '#8EC5FF', color: 'white', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
              {loading ? 'Нэмж байна...' : 'Нэмэх'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'chapter' && (
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>Chapter нэмэх</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <select value={chapterForm.mangaId} onChange={e => setChapterForm({ ...chapterForm, mangaId: e.target.value })}
              style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '10px 16px', outline: 'none', fontSize: '14px' }}>
              <option value="">Manga сонгох</option>
              {mangaList.map(manga => (
                <option key={manga.id} value={manga.id}>{manga.title}</option>
              ))}
            </select>
            <input placeholder="Chapter дугаар (1, 2, 3...)" value={chapterForm.chapterNumber}
              onChange={e => setChapterForm({ ...chapterForm, chapterNumber: e.target.value })}
              style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '10px 16px', outline: 'none', fontSize: '14px' }} />
            <input placeholder="Chapter гарчиг" value={chapterForm.title}
              onChange={e => setChapterForm({ ...chapterForm, title: e.target.value })}
              style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '10px 16px', outline: 'none', fontSize: '14px' }} />
            <textarea
              placeholder="Зургийн URL-үүд (мөр тус бүрд нэг URL)"
              value={chapterForm.pages}
              onChange={e => setChapterForm({ ...chapterForm, pages: e.target.value })}
              rows={6}
              style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '10px 16px', outline: 'none', fontSize: '14px', resize: 'vertical' }}
            />
            <button onClick={handleAddChapter} disabled={loading}
              style={{ background: '#8EC5FF', color: 'white', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
              {loading ? 'Нэмж байна...' : 'Chapter нэмэх'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'list' && (
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', marginBottom: '16px' }}>Manga жагсаалт</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mangaList.map(manga => (
              <div key={manga.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee', borderRadius: '12px', padding: '12px 16px' }}>
                <div>
                  <p style={{ fontWeight: '700', color: '#1F2937' }}>{manga.title}</p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{manga.genre}</p>
                </div>
                <button onClick={() => handleDeleteManga(manga.id)}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '14px' }}>
                  Устгах
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}