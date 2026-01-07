import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-slate-900 text-white p-4">
        <h2 className="text-xl font-bold mb-1">Admin</h2>
        <p className="text-sm mb-6">{user?.name}</p>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/banners"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`
            }
          >
            Banners
          </NavLink>

          {/* Nuevo link al mantenedor de temas */}
          <NavLink
            to="/admin/themes"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`
            }
          >
            Temas
          </NavLink>
          
          <NavLink
            to="/admin/services"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`
            }
          >
            Servicios
          </NavLink>

          <NavLink
            to="/admin/contact-forms"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`
            }
          >
            Formularios
          </NavLink>

          <NavLink
            to="/admin/quotes"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${isActive ? 'bg-slate-700' : 'hover:bg-slate-800'}`
            }
          >
            Cotizaciones
          </NavLink>

        </nav>

        <button
          onClick={logout}
          className="bg-red-600 mt-6 px-3 py-2 rounded text-sm"
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  )
}
