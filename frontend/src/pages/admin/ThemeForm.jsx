import { useEffect, useState } from 'react'
import { apiPost, apiPut } from '../../lib/api'
import { alertSuccess, alertError } from '../../lib/alert'

export default function ThemeForm({ theme, onSuccess, onCancel }) {
  const defaultColors = {
    primaryColor: '#1F2937',
    secondaryColor: '#F59E0B',
    backgroundColor: '#F3F4F6',
    textMainColor: '#111827',
    textSecondaryColor: '#6B7280',
    textDetailColor: '#9CA3AF',
    bannerTitleColor: '#FFFFFF',
    bannerSubtitleColor: '#E5E7EB',
    paginationActiveColor: 'rgba(255,255,255,1)',
    cardBackgroundColor: '#FFFFFF',
    cardBorderColor: '#D1D5DB',
    cardHoverColor: '#FBBF24',
    footerBackgroundColor: '#1F2937',
    footerTextColor: '#FFFFFF',
    shadowColor: 'rgba(0,0,0,0.2)',
    borderRadius: '12px'
  }

  const [name, setName] = useState('')
  const [colors, setColors] = useState(defaultColors)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (theme) {
      setName(theme.name)
      setColors(theme.settings || defaultColors)
    } else {
      setName('')
      setColors(defaultColors)
    }
  }, [theme])

  const handleColorChange = (e) => {
    setColors({ ...colors, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return
    if (!name.trim()) return alertError('Error', 'El nombre del tema es obligatorio')

    setSaving(true)
    try {
      const payload = { name, settings: colors, is_active: 0 }

      if (theme) {
        await apiPut(`/theme/update.php?id=${theme.id}`, payload)
      } else {
        await apiPost('/theme/create.php', payload)
      }

      alertSuccess(`Tema ${theme ? 'actualizado' : 'creado'} correctamente`)
      onSuccess()
    } catch (err) {
      alertError('Error', err?.message || 'No se pudo guardar el tema')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => { if (onCancel) onCancel() }

  const Preview = () => (
    <div className="p-4 border rounded shadow" style={{ backgroundColor: colors.backgroundColor, borderRadius: colors.borderRadius }}>
      <h3 style={{ color: colors.textMainColor }}>Título de Banner</h3>
      <p style={{ color: colors.textSecondaryColor }}>Subtítulo de Banner</p>
      <div
        className="mt-2 p-2"
        style={{
          backgroundColor: colors.cardBackgroundColor,
          border: `1px solid ${colors.cardBorderColor}`,
          borderRadius: colors.borderRadius,
          boxShadow: `0 2px 6px ${colors.shadowColor}`
        }}
      >
        <h4 style={{ color: colors.primaryColor }}>Card Título</h4>
        <p style={{ color: colors.textSecondaryColor }}>Descripción corta</p>
      </div>
      <footer className="mt-2 p-2" style={{ backgroundColor: colors.footerBackgroundColor, color: colors.footerTextColor }}>Footer</footer>
    </div>
  )

  const colorKeys = [
    'primaryColor','secondaryColor','backgroundColor','textMainColor','textSecondaryColor','textDetailColor',
    'bannerTitleColor','bannerSubtitleColor','paginationActiveColor','cardBackgroundColor','cardBorderColor',
    'cardHoverColor','footerBackgroundColor','footerTextColor','shadowColor','borderRadius'
  ]

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow">
      <h2 className="text-lg mb-4">{theme ? 'Editar Tema' : 'Nuevo Tema'}</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 max-h-[70vh] overflow-y-auto p-2 border rounded">
          <input
            className="border p-2 mb-4 w-full"
            placeholder="Nombre del tema"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {colorKeys.map((key) => (
              <div key={key} className="flex items-center gap-2">
                <label className="w-32 truncate capitalize" title={key}>{key}</label>
                <input
                  type={key === 'borderRadius' ? 'text' : 'color'}
                  name={key}
                  value={colors[key]}
                  onChange={handleColorChange}
                  className={key === 'borderRadius' ? 'flex-1 border p-1 rounded min-w-[80px] max-w-[150px]' : 'w-10 h-8 border rounded'}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-2">
          <Preview />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-black text-white px-4 py-2 disabled:opacity-50" disabled={saving}>Guardar</button>
        {onCancel && <button type="button" onClick={handleCancel} className="bg-gray-300 px-4 py-2">Cancelar</button>}
      </div>
    </form>
  )
}
