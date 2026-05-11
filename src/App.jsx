import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import Admin from './pages/Admin'
import MangaDetail from './pages/MangaDetail'
import Reader from './pages/Reader'

function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/manga/:id" element={user ? <MangaDetail /> : <Navigate to="/login" />} />
        <Route path="/manga/:mangaId/chapter/:chapterId" element={user ? <Reader /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App