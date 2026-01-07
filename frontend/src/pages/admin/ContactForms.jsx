import React, { useEffect, useState } from 'react'
import { apiFetch, apiPost } from '../../lib/api'
import { alertConfirm, alertSuccess, alertError } from '../../lib/alert'
import ContactFormForm from './ContactFormForm'
import ContactFormFieldsManager from './ContactFormFieldsManager'

export default function ContactForms() {
  const [forms, setForms] = useState([])
  const [editing, setEditing] = useState(null)
  const [selectedFormId, setSelectedFormId] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadForms = async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/contactForms/list.php')
      if (res?.success && res?.data) {
        setForms(res.data)
      }
    } catch (err) {
      alertError('Error', 'No se pudieron cargar los formularios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadForms()
  }, [])

  const handleActivate = async (formId) => {
    try {
      await apiPost('/contactForms/activate.php', { id: formId })
      alertSuccess('Formulario activado correctamente')
      loadForms()
    } catch (err) {
      alertError('Error', err?.message || 'No se pudo activar el formulario')
    }
  }

  const handleSelectForm = (formId) => {
    setSelectedFormId(formId === selectedFormId ? null : formId)
  }

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Mantenedor de Formularios
      </h2>

      <div className="flex justify-end mb-4">
        {!editing && (
          <button
            onClick={() => setEditing({})}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Nuevo Formulario
          </button>
        )}
      </div>

      {editing && (
        <ContactFormForm
          form={editing}
          onSuccess={() => {
            setEditing(null)
            loadForms()
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando formularios...</p>
        </div>
      ) : forms.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No hay formularios creados.</p>
          <p className="text-gray-400 text-sm mt-2">Haz clic en "+ Nuevo Formulario" para empezar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Versión
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activo
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {forms.map((form) => (
                <React.Fragment key={form.id}>
                  <tr className={selectedFormId === form.id ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleSelectForm(form.id)}
                          className="text-blue-600 hover:text-blue-900 mr-2"
                          title="Gestionar campos"
                        >
                          {selectedFormId === form.id ? '▼' : '▶'}
                        </button>
                        <div className="text-sm font-medium text-gray-900">{form.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {form.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          form.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {form.is_active ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {!form.is_active && (
                        <button
                          onClick={() => handleActivate(form.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Activar
                        </button>
                      )}
                      <button
                        onClick={() => setEditing(form)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                  {selectedFormId === form.id && (
                    <tr>
                      <td colSpan="4" className="p-4 bg-gray-100">
                        <ContactFormFieldsManager formId={form.id} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

