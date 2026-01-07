// src/pages/admin/Services.jsx
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import ServiceForm from "./ServiceForm";
import { alertConfirm, alertSuccess } from "../../lib/alert";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* =========================
   Sortable Row
========================= */
function SortableRow({ service, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t bg-white">
      <td
        className="p-2 cursor-grab text-center"
        {...listeners}
        {...attributes}
      >
        &#x2630;
      </td>

      <td className="p-2">
        <div className="font-medium">{service.title}</div>
        {service.subtitle && (
          <div className="text-xs text-gray-500">{service.subtitle}</div>
        )}
      </td>

      <td className="p-2 text-sm text-gray-600">
        {service.short_description}
      </td>

      <td className="p-2 text-center">
        {service.is_active ? "Sí" : "No"}
      </td>

      <td className="p-2 flex gap-2 justify-center">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => onEdit(service)}
        >
          Editar
        </button>

        <button
          className="text-red-600 hover:underline"
          onClick={() => onDelete(service.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}

/* =========================
   Page
========================= */
export default function Services() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);

  /* ---------- Load ---------- */
  const loadServices = async () => {
  const res = await apiFetch("/services/list.php");

  if (!res?.data) return;

  const sorted = [...res.data].sort(
    (a, b) => a.position - b.position
  );

  setServices(sorted);
};


  useEffect(() => {
    loadServices();
  }, []);

  /* ---------- Delete ---------- */
  const handleDelete = async (id) => {
    const result = await alertConfirm(
      "Eliminar servicio",
      "Esta acción no se puede deshacer"
    );

    if (!result.isConfirmed) return;

    await apiFetch("/services/delete.php", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    alertSuccess("Servicio eliminado");
    loadServices();
  };

  /* ---------- Drag ---------- */
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = services.findIndex((s) => s.id === active.id);
    const newIndex = services.findIndex((s) => s.id === over.id);

    const newOrder = arrayMove(services, oldIndex, newIndex);
    setServices(newOrder);

    await apiFetch("/services/update_order.php", {
      method: "POST",
      body: JSON.stringify({
        order: newOrder.map((s) => s.id),
      }),
    });
  };

  /* ---------- Render ---------- */
  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Servicios</h1>

      <ServiceForm
        service={editing}
        onSuccess={() => {
          setEditing(null);
          loadServices();
        }}
        onCancel={() => setEditing(null)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={services.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <table className="w-full shadow table-auto bg-gray-100">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 w-10"></th>
                <th className="p-2">Título</th>
                <th className="p-2">Descripción corta</th>
                <th className="p-2 text-center w-20">Activo</th>
                <th className="p-2 text-center w-32">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service) => (
                <SortableRow
                  key={service.id}
                  service={service}
                  onDelete={handleDelete}
                  onEdit={setEditing}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
