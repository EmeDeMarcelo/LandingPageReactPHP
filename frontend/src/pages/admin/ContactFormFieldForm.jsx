import { useEffect, useState } from 'react'
import { apiPost, apiPut } from '../../lib/api'
import { alertSuccess, alertError } from '../../lib/alert'

const FIELD_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Teléfono' },
  { value: 'textarea', label: 'Área de texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Fecha' },
  { value: 'select', label: 'Select (opciones fijas)' },
  { value: 'service_select', label: 'Select de Servicios' }
]

export default function ContactFormFieldForm({ field, formId, onSuccess, onCancel }) {
  const [fieldName, setFieldName] = useState('')
  const [fieldLabel, setFieldLabel] = useState('')
  const [fieldType, setFieldType] = useState('text')
  const [isRequired, setIsRequired] = useState(false)
  const [helpText, setHelpText] = useState('')
  const [selectOptions, setSelectOptions] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (field) {
      setFieldName(field.field_name || '')
      setFieldLabel(field.field_label || '')
      setFieldType(field.field_type || 'text')
      setIsRequired(field.is_required === 1 || field.is_required === true)
      setHelpText(field.help_text || '')
      if (field.field_type === 'select' && field.field_options?.options) {
        setSelectOptions(field.field_options.options.join('\n'))
      } else {
        setSelectOptions('')
      }
    } else {
      setFieldName('')
      setFieldLabel('')
      setFieldType('text')
      setIsRequired(false)
      setHelpText('')
      setSelectOptions('')
    }
  }, [field])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (saving) return
    if (!formId) return alertError('Error', 'ID de formulario no proporcionado')
    if (!fieldName.trim()) return alertError('Error', 'El nombre técnico es obligatorio')
    if (!fieldLabel.trim()) return alertError('Error', 'La etiqueta es obligatoria')

    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(fieldName.trim())) {
      return alertError('Error', 'El nombre técnico debe empezar con una letra y contener solo letras, números o guiones bajos.')
    }

    setSaving(true)
    try {
      let fieldOptionsPayload = null
      if (fieldType === 'select') {
        fieldOptionsPayload = { options: selectOptions.split('\n').map(opt => opt.trim()).filter(opt => opt !== '') }
      } else if (fieldType === 'service_select') {
        fieldOptionsPayload = { service_select: true }
      }

      const payload = {
        form_id: formId,
        field_name: fieldName.trim(),
        field_label: fieldLabel.trim(),
        field_type: fieldType,
        field_options: fieldOptionsPayload,
        is_required: isRequired ? 1 : 0,
        help_text: helpText.trim() || null
      }

      if (field?.id) {
        await apiPut(`/contactFormFields/update.php`, { id: field.id, ...payload })
        alertSuccess('Campo actualizado correctamente')
      } else {
        await apiPost('/contactFormFields/create.php', payload)
        alertSuccess('Campo creado correctamente')
      }

      onSuccess()
    } catch (err) {
      alertError('Error', err?.message || 'No se pudo guardar el campo')
    } finally {
      setSaving(false)
    }
  }

  const showSelectOptions = fieldType === 'select'
  const showServiceSelect = fieldType === 'service_select'

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 shadow rounded">
      <h3 className="text-md font-semibold mb-3">
        {field ? 'Editar Campo' : 'Nuevo Campo'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre técnico * <span className="text-xs text-gray-500">(sin espacios, ej: nombre_cliente)</span>
          </label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="nombre_cliente"
            value={fieldName}
            onChange={e => setFieldName(e.target.value)}
            pattern="^[a-zA-Z][a-zA-Z0-9_]*$"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Etiqueta *</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Nombre visible del campo"
            value={fieldLabel}
            onChange={e => setFieldLabel(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Campo *</label>
          <select
            className="border p-2 w-full rounded"
            value={fieldType}
            onChange={e => setFieldType(e.target.value)}
            required
          >
            {FIELD_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center mt-6 md:mt-0">
          <input
            type="checkbox"
            id="isRequired"
            className="mr-2"
            checked={isRequired}
            onChange={e => setIsRequired(e.target.checked)}
          />
          <label htmlFor="isRequired" className="text-sm font-medium">Campo Obligatorio</label>
        </div>
      </div>

      {showSelectOptions && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Opciones del Select (una por línea)</label>
          <textarea
            className="border p-2 w-full rounded"
            rows="4"
            placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
            value={selectOptions}
            onChange={e => setSelectOptions(e.target.value)}
          ></textarea>
        </div>
      )}

      {showServiceSelect && (
        <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-800">
          Este campo se llenará automáticamente con los servicios activos.
        </div>
      )}

      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">Texto de Ayuda (opcional)</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Ej: Ingresa tu nombre completo"
          value={helpText}
          onChange={e => setHelpText(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar Campo'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

