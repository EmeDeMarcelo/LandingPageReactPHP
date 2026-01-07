import { useEffect, useState } from 'react'
import { apiFetch, apiPost } from '../../lib/api'
import { alertConfirm, alertSuccess, alertError } from '../../lib/alert'
import ContactFormFieldForm from './ContactFormFieldForm'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableFieldRow({ field, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <tr ref={setNodeRef} style={style} className="border-t bg-white">
      <td
        className="p-2 cursor-grab text-center w-10"
        {...listeners}
        {...attributes}
      >
        &#x2630;
      </td>
      <td className="p-2 font-medium">{field.field_label}</td>
      <td className="p-2 text-sm text-gray-600">{field.field_name}</td>
      <td className="p-2 text-center text-sm">{field.field_type}</td>
      <td className="p-2 text-center">
        {field.is_required ? 'Sí' : 'No'}
      </td>
      <td className="p-2 flex gap-2 justify-center w-32">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => onEdit(field)}
        >
          Editar
        </button>
        <button
          className="text-red-600 hover:underline"
          onClick={() => onDelete(field.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  )
}

export default function ContactFormFieldsManager({ formId }) {
  const [fields, setFields] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadFields = async () => {
    if (!formId) {
      setFields([])
      return
    }
    setLoading(true)
    try {
      const res = await apiFetch(`/contactFormFields/list.php?form_id=${formId}`)
      if (res?.success && res?.data) {
        setFields(res.data)
      }
    } catch (err) {
      alertError('Error', 'No se pudieron cargar los campos del formulario')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFields()
  }, [formId])

  const handleDelete = async (fieldId) => {
    const result = await alertConfirm('Eliminar campo', 'Esta acción no se puede deshacer')
    if (!result.isConfirmed) return

    try {
      await apiPost('/contactFormFields/delete.php', { id: fieldId })
      alertSuccess('Campo eliminado')
      loadFields()
    } catch (err) {
      alertError('Error', err?.message || 'No se pudo eliminar el campo')
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = fields.findIndex(f => f.id === active.id)
    const newIndex = fields.findIndex(f => f.id === over.id)

    const newOrder = arrayMove(fields, oldIndex, newIndex)
    setFields(newOrder)

    try {
      await apiPost('/contactFormFields/update_order.php', {
        order: newOrder.map(f => f.id)
      })
      alertSuccess('Orden de campos actualizada')
    } catch (err) {
      alertError('Error', err?.message || 'No se pudo actualizar el orden de los campos')
      loadFields()
    }
  }

  const sensors = useSensors(useSensor(PointerSensor))

  if (!formId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <p className="text-yellow-800">Selecciona un formulario para gestionar sus campos</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Campos del Formulario</h3>
        {!editing && (
          <button
            onClick={() => setEditing({})}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Agregar Campo
          </button>
        )}
      </div>

      {editing && (
        <ContactFormFieldForm
          formId={formId}
          field={editing}
          onSuccess={() => {
            setEditing(null)
            loadFields()
          }}
          onCancel={() => setEditing(null)}
        />
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando campos...</p>
        </div>
      ) : fields.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No hay campos definidos para este formulario.</p>
          <p className="text-gray-400 text-sm mt-2">Haz clic en "+ Agregar Campo" para empezar.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full shadow table-auto bg-gray-100 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3 w-10"></th>
                  <th className="p-3">Etiqueta</th>
                  <th className="p-3">Nombre Técnico</th>
                  <th className="p-3 text-center w-24">Tipo</th>
                  <th className="p-3 text-center w-24">Obligatorio</th>
                  <th className="p-3 text-center w-32">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {fields.map(field => (
                  <SortableFieldRow
                    key={field.id}
                    field={field}
                    onDelete={handleDelete}
                    onEdit={setEditing}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

