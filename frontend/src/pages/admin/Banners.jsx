// src/pages/admin/Banners.jsx
import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api'
import BannerForm from './BannerForm'
import { alertConfirm, alertSuccess } from '../../lib/alert'
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

// Aquí va SortableRow
function SortableRow({ banner, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: banner.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <tr ref={setNodeRef} style={style} className="border-t">
      <td className="p-2 cursor-grab" {...listeners} {...attributes}>
        &#x2630; {/* icono de “handle” */}
      </td>
      <td className="p-2">{banner.title}</td>
      <td className="p-2">{banner.is_active ? 'Sí' : 'No'}</td>
      <td className="p-2 flex gap-2">
        <button className="text-red-600 hover:underline" onClick={() => onDelete(banner.id)}>
          Eliminar
        </button>
        <button className="text-blue-600 hover:underline" onClick={() => onEdit(banner)}>
          Editar
        </button>
      </td>
    </tr>
  )
}

export default function Banners() {
  const [banners, setBanners] = useState([])
  const [editing, setEditing] = useState(null)

  const loadBanners = async () => {
    const res = await apiFetch('/banners/list.php')
    if (res?.data) {
      const sorted = res.data.sort((a, b) => a.position - b.position)
      setBanners(sorted)
    }
  }

  useEffect(() => { loadBanners() }, [])

  const handleDelete = async (id) => {
    const result = await alertConfirm('Eliminar banner', 'Esta acción no se puede deshacer')
    if (!result.isConfirmed) return

    await apiFetch('/banners/delete.php', {
      method: 'POST',
      body: JSON.stringify({ id })
    })

    alertSuccess('Banner eliminado')
    loadBanners()
  }

  const sensors = useSensors(
    useSensor(PointerSensor)
  )

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = banners.findIndex(b => b.id === active.id)
    const newIndex = banners.findIndex(b => b.id === over.id)

    const newBanners = arrayMove(banners, oldIndex, newIndex)
    setBanners(newBanners)

    // Guardar orden en DB
    await apiFetch('/banners/update_order.php', {
      method: 'POST',
      body: JSON.stringify({ order: newBanners.map(b => b.id) })
    })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Banners</h1>

      <BannerForm
        banner={editing}
        onSuccess={() => { setEditing(null); loadBanners() }}
        onCancel={() => setEditing(null)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={banners.map(b => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <table className="w-full bg-white shadow table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Título</th>
                <th className="p-2 text-left">Activo</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b, index) => (
                <SortableRow
                  key={b.id}
                  banner={b}
                  index={index}
                  onDelete={handleDelete}
                  onEdit={setEditing}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  )
}
