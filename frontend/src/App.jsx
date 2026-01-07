// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './router/ProtectedRoute'
import Banners from './pages/admin/Banners'
import AdminThemes from './pages/admin/AdminThemes' // import actualizado
import Services from './pages/admin/Services' // nuevo import
import ContactForms from './pages/admin/ContactForms'
import Quotes from './pages/admin/Quotes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Admin />} />
          <Route path="banners" element={<Banners />} />
          <Route path="themes" element={<AdminThemes />} />
          <Route path="services" element={<Services />} />
          <Route path="contact-forms" element={<ContactForms />} />
          <Route path="quotes" element={<Quotes />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
