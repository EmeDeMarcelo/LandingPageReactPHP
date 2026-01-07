import { useEffect, useState } from "react"
import { apiFetch, apiDelete } from "../../lib/api"
import { useTheme } from "../../context/ThemeContext"
import { alertConfirm, alertSuccess } from "../../lib/alert"
import ThemeForm from "./ThemeForm"

export default function AdminThemes() {
  const [themes, setThemes] = useState([])
  const [editing, setEditing] = useState(null)
  const { activeTheme, setActiveTheme } = useTheme()

  const loadThemes = async () => {
    const res = await apiFetch("/theme/list.php")
    console.log("API /theme/list.php:", res)

    if (res?.data) {
      const arr = Array.isArray(res.data) ? res.data : Object.values(res.data)

      const formatted = arr.map(t => ({
        ...t,
        settings: typeof t.settings === 'string' ? JSON.parse(t.settings || '{}') : t.settings || {}
      }))
      setThemes(formatted)
    }
  }

  useEffect(() => { loadThemes() }, [])

  const handleDelete = async (id) => {
    const result = await alertConfirm('Eliminar tema', 'Esta acción no se puede deshacer')
    if (!result.isConfirmed) return

    await apiDelete(`/theme/delete.php?id=${id}`)
    alertSuccess('Tema eliminado')
    setThemes(prev => prev.filter(t => t.id !== id))
    if (activeTheme?.id === id) setActiveTheme(null)
  }

  const activateTheme = async (id) => {
    await apiFetch(`/theme/activate.php?id=${id}`)
    const res = await apiFetch("/theme/active.php")
    if (res?.data) setActiveTheme(res.data)

    setThemes(prev => prev.map(t => ({ ...t, is_active: t.id === id ? 1 : 0 })))
  }

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Mantenedor de Temas</h2>

      <ThemeForm
        theme={editing}
        onSuccess={() => { setEditing(null); loadThemes() }}
        onCancel={() => setEditing(null)}
      />

      <table className="w-full table-auto border-collapse rounded-lg shadow-lg mt-6">
        <thead>
          <tr className="bg-blue-600 text-white rounded-t-lg">
            <th className="p-4 text-left">Nombre</th>
            <th className="p-4 text-center">Activo</th>
            <th className="p-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {themes.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No hay temas cargados.
              </td>
            </tr>
          )}
          {themes.map((t) => (
            <tr key={t.id} className="hover:bg-gray-100 transition-all duration-300">
              <td className="p-4 border-b">{t.name}</td>
              <td className="p-4 border-b text-center">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-white ${t.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
                >
                  {t.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="p-4 border-b text-center flex justify-center gap-3">
                {!t.is_active && (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition-all duration-300"
                    onClick={() => activateTheme(t.id)}
                  >
                    Activar
                  </button>
                )}
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none transition-all duration-300"
                  onClick={() => setEditing(t)}
                >
                  Editar
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition-all duration-300"
                  onClick={() => handleDelete(t.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
