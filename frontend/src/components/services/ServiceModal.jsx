import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

export default function ServiceModal({ service, onClose }) {
  const { activeTheme } = useTheme();

  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState(null);


  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoadingImages(true);

        const res = await apiFetch(
          `/public/service-images.php?service_id=${service.id}`
        );

        if (res?.data) setImages(res.data);
      } catch (e) {
        console.error("Error cargando galería", e);
      } finally {
        setLoadingImages(false);
      }
    };

    loadImages();
  }, [service.id]);

  useEffect(() => {
    const handleEsc = e => {
      if (e.key === "Escape") {
        if (fullscreenImage) {
          setFullscreenImage(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [fullscreenImage, onClose]);


  if (!activeTheme) return null;

  const s = activeTheme.settings;

  // Estilos personalizados para el scrollbar usando los colores del tema
  const scrollbarStyles = `
    .service-modal-scroll::-webkit-scrollbar {
      width: 8px;
    }
    .service-modal-scroll::-webkit-scrollbar-track {
      background: ${s.cardBorderColor}20;
      border-radius: 4px;
    }
    .service-modal-scroll::-webkit-scrollbar-thumb {
      background: ${s.cardBorderColor}80;
      border-radius: 4px;
      transition: background 0.2s;
    }
    .service-modal-scroll::-webkit-scrollbar-thumb:hover {
      background: ${s.primaryColor || s.cardBorderColor};
    }
    /* Firefox */
    .service-modal-scroll {
      scrollbar-width: thin;
      scrollbar-color: ${s.cardBorderColor}80 ${s.cardBorderColor}20;
    }
  `;

  return (
    <>
      {/* Estilos personalizados del scrollbar */}
      <style>{scrollbarStyles}</style>
      
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        aria-describedby="service-modal-description"
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={onClose}
          aria-hidden="true"
        />

      {/* Wrapper */}
      <div
        className="relative w-full max-w-4xl max-h-[95vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Card */}
        <div
          className="rounded-xl flex flex-col max-h-[95vh] overflow-hidden"
          style={{
            backgroundColor: s.cardBackgroundColor,
            border: `1px solid ${s.cardBorderColor}`,
            boxShadow: `0 12px 40px ${s.shadowColor}`,
          }}
        >
          {/* Header - Fixed */}
          <div
            className="flex justify-between items-start p-4 sm:p-6 border-b flex-shrink-0"
            style={{ borderColor: s.cardBorderColor }}
          >
            <div className="flex-1 pr-4">
              <h3
                id="service-modal-title"
                className="text-xl sm:text-2xl font-bold"
                style={{ color: s.textMainColor }}
              >
                {service.title}
              </h3>
              {service.subtitle && (
                <p
                  className="text-xs sm:text-sm font-medium mt-1"
                  style={{ color: s.primaryColor }}
                >
                  {service.subtitle}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold hover:opacity-70 transition-opacity"
              style={{ 
                backgroundColor: s.cardBorderColor + "40",
                color: s.textMainColor 
              }}
              aria-label="Cerrar modal"
              title="Cerrar (ESC)"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1 service-modal-scroll">

            {/* Imagen principal */}
            {service.image && (
              <div className="w-full h-48 sm:h-64 md:h-72 overflow-hidden">
                <img
                  src={normalizeImageUrl(service.image)}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Error cargando imagen principal:", service.image);
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Contenido - Descripción */}
            {(service.long_description || service.description) && (
              <div className="p-4 sm:p-6 border-b" style={{ borderColor: s.cardBorderColor }}>
                <h4 
                  className="text-sm font-semibold mb-3 uppercase tracking-wide"
                  style={{ color: s.textMainColor }}
                >
                  Descripción
                </h4>
                <p
                  id="service-modal-description"
                  className="text-sm sm:text-base leading-relaxed whitespace-pre-line"
                  style={{ color: s.textSecondaryColor }}
                >
                  {service.long_description || service.description}
                </p>
              </div>
            )}

            {/* Galería - Solo se muestra si hay imágenes */}
            {(loadingImages || images.length > 0) && (
              <div className="p-4 sm:p-6 min-h-[200px]">
                <h4 
                  className="text-sm font-semibold mb-4 uppercase tracking-wide"
                  style={{ color: s.textMainColor }}
                >
                  Galería de Imágenes {images.length > 0 && `(${images.length})`}
                </h4>
                
                {loadingImages ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-32 rounded-lg animate-pulse"
                        style={{ backgroundColor: s.cardBorderColor }}
                      />
                    ))}
                  </div>
                ) : images.length > 0 ? (
                  <div className="w-full">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={16}
                      slidesPerView={1.2}
                      navigation
                      pagination={{ clickable: true }}
                      observer={true}
                      observeParents={true}
                      observeSlideChildren={true}
                      watchOverflow={true}
                      breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                      }}
                      onInit={(swiper) => {
                        // Forzar actualización después de la inicialización
                        setTimeout(() => {
                          swiper.update();
                          swiper.updateSlides();
                        }, 100);
                      }}
                    >
                      {images.map((img, index) => (
                        <SwiperSlide key={img.id}>
                          <div className="relative group h-40">
                            <img
                              src={normalizeImageUrl(img.image)}
                              alt={`${service.title} - imagen ${index + 1}`}
                              loading="lazy"
                              onClick={() => setFullscreenImage(img.image)}
                              className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition shadow-md"
                              onError={(e) => {
                                console.error("Error cargando imagen de galería:", img.image);
                                e.target.style.display = "none";
                              }}
                            />
                            <div 
                              className="absolute inset-0 rounded-lg flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                            >
                              <span 
                                className="text-white text-xs bg-black bg-opacity-70 px-3 py-1.5 rounded"
                              >
                                Click para ampliar
                              </span>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Image */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de imagen"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
            onClick={() => setFullscreenImage(null)}
            aria-hidden="true"
          />

          {/* Image container */}
          <div className="relative max-w-7xl max-h-[95vh] mx-auto">
            <img
              src={normalizeImageUrl(fullscreenImage)}
              alt={`${service.title} - vista ampliada`}
              className="max-h-[95vh] max-w-full w-auto rounded-xl shadow-2xl"
              onError={(e) => {
                console.error("Error cargando imagen fullscreen:", fullscreenImage);
                e.target.style.display = "none";
              }}
            />

            {/* Close button */}
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold hover:opacity-80 transition-opacity shadow-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#000",
              }}
              aria-label="Cerrar vista ampliada"
              title="Cerrar (ESC)"
            >
              ✕
            </button>

            {/* Image counter */}
            {images.length > 1 && (
              <div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "#000",
                }}
              >
                {images.findIndex(img => img.image === fullscreenImage) + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}

      </div>
    </>
  );
}
