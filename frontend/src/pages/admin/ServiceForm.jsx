import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { alertSuccess, alertError } from "../../lib/alert";
import ServiceImagesManager from "./ServiceImagesManager";


export default function ServiceForm({ service, onSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(1);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* =========================
    Load edit data
  ========================= */
  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setSubtitle(service.subtitle || "");
      setShortDescription(service.short_description || "");
      setLongDescription(service.long_description || "");
      setImage(service.image || "");
      setIsActive(service.is_active);
    } else {
      resetForm();
    }
  }, [service]);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setShortDescription("");
    setLongDescription("");
    setImage("");
    setIsActive(1);
  };

  /* =========================
    Upload image
  ========================= */
  const handleImageUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/services/upload.php",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();
      if (data?.path) {
        setImage(data.path);
      } else {
        throw new Error("Error subiendo imagen");
      }
    } catch (err) {
      alertError("Error", "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  /* =========================
    Submit
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    // 🔐 VALIDACIONES
    if (!title || title.trim().length < 3) {
      alertError("Error", "El título debe tener al menos 3 caracteres");
      return;
    }

    if (!shortDescription || shortDescription.trim().length < 10) {
      alertError(
        "Error",
        "La descripción corta debe tener al menos 10 caracteres"
      );
      return;
    }

    if (!image) {
      alertError("Error", "Debes subir una imagen principal");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title,
        subtitle,
        short_description: shortDescription,
        long_description: longDescription,
        image,
        is_active: isActive,
      };

      if (service) {
        payload.id = service.id;
        await apiFetch("/services/update.php", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/services/create.php", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      alertSuccess("Servicio guardado correctamente");
      resetForm();
      onSuccess();
    } catch (err) {
      alertError("Error", err?.message || "No se pudo guardar el servicio");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
    Render
  ========================= */
  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow">
      <h2 className="text-lg mb-4">
        {service ? "Editar Servicio" : "Nuevo Servicio"}
      </h2>

      {/* Título */}
      <input
        className="border p-2 w-full mb-2"
        placeholder="Título del servicio"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Subtítulo */}
      <input
        className="border p-2 w-full mb-2"
        placeholder="Subtítulo (opcional)"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />

      {/* Descripción corta */}
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Descripción corta (visible en la card)"
        rows={2}
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
      />

      {/* Descripción larga */}
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Descripción larga (modal)"
        rows={4}
        value={longDescription}
        onChange={(e) => setLongDescription(e.target.value)}
      />

      {/* Upload imagen */}
      <label
        htmlFor="imageUpload"
        className="block mb-2 px-4 py-2 bg-blue-600 text-white text-center cursor-pointer rounded hover:bg-blue-700"
      >
        {image ? "Cambiar imagen principal" : "Seleccionar imagen principal"}
      </label>

      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />

      {uploading && (
        <p className="text-sm text-gray-500 mb-2">Subiendo imagen...</p>
      )}

      {image && (
        <img
          src={import.meta.env.VITE_PUBLIC_URL + image}
          alt="Preview"
          className="h-32 mb-2 border rounded object-cover"
        />
      )}

      {/* =========================
    Galería del servicio
========================= */}
      {service && service.id && (
        <ServiceImagesManager serviceId={service.id} />
      )}

      {/* Activo */}
      <label className="flex items-center gap-2 mb-4 mt-6">
        <input
          type="checkbox"
          checked={Boolean(isActive)}
          onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
        />
        Activo
      </label>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={saving || uploading}
        >
          Guardar
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              onCancel();
            }}
            className="bg-gray-300 px-4 py-2"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
