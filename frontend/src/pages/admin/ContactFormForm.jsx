import { useEffect, useState } from 'react'
import { apiPost, apiPut } from '../../lib/api'
import { alertSuccess, alertError } from '../../lib/alert'

export default function ContactFormForm({ form, onSuccess, onCancel }) {
  const [name, setName] = useState('')
  const [version, setVersion] = useState('1.0')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (form) {
      setName(form.name || '')
      setVersion(form.version || '1.0')
      setDescription(form.description || '')
      setIsActive(form.is_active === 1 || form.is_active === true)
    } else {
      setName('')
      setVersion('1.0')
      setDescription('')
      setIsActive(false)
    }
  }, [form])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return
    if (!name.trim()) return alertError('Error', 'El nombre del formulario es obligatorio')

    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        version: version.trim(),
        description: description.trim() || null,
        is_active: isActive ? 1 : 0
      }

      if (form?.id) {
        await apiPut(`/contactForms/update.php`, { id: form.id, ...payload })
        alertSuccess('Formulario actualizado correctamente')
      } else {
        await apiPost('/contactForms/create.php', payload)
        alertSuccess('Formulario creado correctamente')
      }

      onSuccess()
    } catch (err) {
      alertError('Error', err?.message || 'No se pudo guardar el formulario')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4">
        {form ? 'Editar Formulario' : 'Nuevo Formulario'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Nombre descriptivo del formulario"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Versión *</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Versión del formulario (ej: 1.0)"
            value={version}
            onChange={e => setVersion(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Descripción (opcional)</label>
        <textarea
          className="border p-2 w-full rounded"
          rows="3"
          placeholder="Descripción opcional del formulario"
          value={description}
          onChange={e => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="isActiveForm"
          className="mr-2"
          checked={isActive}
          onChange={e => setIsActive(e.target.checked)}
        />
        <label htmlFor="isActiveForm" className="text-sm font-medium">Activo (se usará en el landing page)</label>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Formulario'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

