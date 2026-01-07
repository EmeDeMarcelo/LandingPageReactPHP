import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import { alertSuccess, alertError } from '../../lib/alert'

export default function BannerForm({ banner, onSuccess, onCancel }) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [isActive, setIsActive] = useState(1)
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Resetear formulario al cambiar banner o cancelar
  useEffect(() => {
    if (banner) {
      setTitle(banner.title)
      setSubtitle(banner.subtitle || '')
      setIsActive(banner.is_active)
      setImage(banner.image || '')
    } else {
      setTitle('')
      setSubtitle('')
      setIsActive(1)
      setImage('')
    }
  }, [banner])

  const handleImageUpload = async (file) => {
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + '/banners/upload.php',
        {
          method: 'POST',
          credentials: 'include',
          body: formData
        }
      )
      const data = await response.json()
      if (data?.path) setImage(data.path)
    } catch (err) {
      alertError('Error', 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return

    // 🔹 VALIDACIÓN FRONTEND
    if (!title || title.trim().length < 3) {
      alertError('Error', 'El título debe tener al menos 3 caracteres')
      return
    }
    if (!image) {
      alertError('Error', 'Debes seleccionar una imagen')
      return
    }

    setSaving(true)

    try {
      const payload = {
        title,
        subtitle,
        is_active: isActive,
        image
      }

      if (banner) {
        payload.id = banner.id
        await apiFetch('/banners/update.php', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
      } else {
        await apiFetch('/banners/create.php', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
      }

      alertSuccess('Banner guardado correctamente')
      onSuccess()
    } catch (err) {
      alertError('Error', err?.message || 'No se pudo guardar el banner')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    // Limpiar formulario al cancelar
    setTitle('')
    setSubtitle('')
    setIsActive(1)
    setImage('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow">
      <h2 className="text-lg mb-4">
        {banner ? 'Editar Banner' : 'Nuevo Banner'}
      </h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Título"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Subtítulo"
        value={subtitle}
        onChange={e => setSubtitle(e.target.value)}
      />

      {/* Botón visible de upload */}
      <label
        htmlFor="imageUpload"
        className="block mb-2 px-4 py-2 bg-blue-600 text-white text-center cursor-pointer rounded hover:bg-blue-700"
      >
        {image ? 'Cambiar imagen' : 'Seleccionar imagen'}
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleImageUpload(e.target.files[0])}
      />

      {uploading && (
        <p className="text-sm text-gray-500 mb-2">Subiendo imagen...</p>
      )}

      {image && (
        <img
          src={import.meta.env.VITE_PUBLIC_URL + image}
          alt="Preview"
          className="h-24 mb-2 border"
        />
      )}

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={isActive === 1}
          onChange={e => setIsActive(e.target.checked ? 1 : 0)}
        />
        Activo
      </label>

      <div className="flex gap-2">
        <button
          className="bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={uploading || saving}
        >
          Guardar
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 px-4 py-2"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
