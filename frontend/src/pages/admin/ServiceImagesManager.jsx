import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { alertConfirm, alertError, alertSuccess } from "../../lib/alert";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* =========================
   Helper: Normalizar ruta de imagen
========================= */
const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return "";
  
  const publicUrl = import.meta.env.VITE_PUBLIC_URL || "";
  
  // Si la ruta ya es una URL completa, retornarla
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  // Normalizar: asegurar que la ruta tenga / inicial
  const normalizedPath = imagePath.startsWith("/") ? imagePath : "/" + imagePath;
  
  // Asegurar que VITE_PUBLIC_URL no tenga barra final duplicada
  const baseUrl = publicUrl.endsWith("/") ? publicUrl.slice(0, -1) : publicUrl;
  
  return baseUrl + normalizedPath;
};

/* =========================
   Sortable Image Item
========================= */
function SortableImage({ image, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative border rounded overflow-hidden bg-white"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-black/60 text-white px-2 py-1 text-xs cursor-grab rounded z-10"
      >
        ☰
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(image)}
        className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded z-10"
      >
        ✕
      </button>

      <img
        src={normalizeImageUrl(image.image)}
        alt=""
        className="w-full h-40 object-cover"
        onError={(e) => {
          console.error("Error cargando imagen:", image.image);
          e.target.style.display = "none";
        }}
      />
    </div>
  );
}

/* =========================
   Manager
========================= */
export default function ServiceImagesManager({ serviceId }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* ---------- Load ---------- */
  const loadImages = async () => {
    try {
      const res = await apiFetch(
        `/serviceImages/list.php?service_id=${serviceId}`
      );

      // 🔍 Validar formato de respuesta
      if (!res) {
        console.error("Error: respuesta vacía del servidor");
        alertError("Error", "No se recibió respuesta del servidor");
        setImages([]);
        return;
      }

      // 🔍 Validar estructura de respuesta
      if (res.success === false) {
        const errorMsg = res.message || "Error al cargar las imágenes";
        console.error("Error del servidor:", errorMsg);
        alertError("Error", errorMsg);
        setImages([]);
        return;
      }

      // 🔍 Validar que data sea un array
      if (res.success === true && Array.isArray(res.data)) {
        console.log("✅ Imágenes cargadas:", res.data.length);
        setImages(res.data);
      } else if (res.data && Array.isArray(res.data)) {
        // Fallback: si viene data directamente (compatibilidad)
        console.log("⚠️ Formato de respuesta no estándar, usando data directamente");
        setImages(res.data);
      } else {
        console.error("Error: formato de respuesta inválido", res);
        alertError("Error", "Formato de respuesta inválido del servidor");
        setImages([]);
      }
    } catch (err) {
      console.error("Error cargando imágenes:", err);
      alertError(
        "Error",
        err?.message || "No se pudieron cargar las imágenes. Verifica la conexión."
      );
      setImages([]);
    }
  };


  useEffect(() => {
    if (serviceId) loadImages();
  }, [serviceId]);

  /* ---------- Upload ---------- */
  const handleUpload = async (files) => {
    if (!files || !files.length) return;

    const formData = new FormData();
    formData.append("service_id", serviceId);

    Array.from(files).forEach((file) => {
      formData.append("images[]", file);
    });

    setUploading(true);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/serviceImages/upload.php",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data?.error || data?.message || "Error subiendo imágenes";
        alertError("Error", errorMsg);
        return;
      }

      if (data?.success) {
        const uploadedCount = data?.uploaded?.length || 0;
        const errorCount = data?.errors?.length || 0;
        
        if (uploadedCount > 0) {
          if (errorCount > 0) {
            alertError(
              "Subida parcial",
              `${uploadedCount} imagen(es) subida(s) correctamente. ${errorCount} error(es).`
            );
          } else {
            alertSuccess(`${uploadedCount} imagen(es) subida(s) correctamente`);
          }
          loadImages();
        } else {
          const errorMsg = data?.errors?.join(", ") || "No se pudieron subir las imágenes";
          alertError("Error", errorMsg);
        }
      } else {
        alertError("Error", "No se pudieron subir las imágenes");
      }
    } catch (err) {
      console.error("Error en upload:", err);
      alertError("Error", "Error de conexión al subir imágenes");
    } finally {
      setUploading(false);
    }
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (image) => {
    const result = await alertConfirm(
      "Eliminar imagen",
      "La imagen se eliminará definitivamente"
    );

    if (!result.isConfirmed) return;

    try {
      const res = await apiFetch("/serviceImages/delete.php", {
        method: "POST",
        body: JSON.stringify({ id: image.id }),
      });

      if (res?.success !== false) {
        alertSuccess("Imagen eliminada correctamente");
        loadImages();
      } else {
        const errorMsg = res?.error || res?.message || "Error al eliminar la imagen";
        alertError("Error", errorMsg);
      }
    } catch (err) {
      console.error("Error eliminando imagen:", err);
      alertError("Error", err?.message || "No se pudo eliminar la imagen");
    }
  };

  /* ---------- Drag ---------- */
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);

    const newOrder = arrayMove(images, oldIndex, newIndex);
    setImages(newOrder);

    await apiFetch("/serviceImages/update_order.php", {
      method: "POST",
      body: JSON.stringify({
        order: newOrder.map((img) => img.id),
      }),
    });
  };

  /* ---------- Render ---------- */
  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg mb-2">Galería del servicio</h3>

      {/* Upload */}
      <label className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
        Agregar imágenes
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </label>

      {uploading && (
        <p className="text-sm text-gray-500 mb-2">Subiendo imágenes...</p>
      )}

      {/* Gallery */}
      {images.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((img) => (
                <SortableImage
                  key={img.id}
                  image={img}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-sm text-gray-500">
          Este servicio aún no tiene imágenes
        </p>
      )}
    </div>
  );
}
