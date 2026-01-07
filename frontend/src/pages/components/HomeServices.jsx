import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { apiFetch } from "../../lib/api";

import ThemeCard from "../../components/theme/ThemeCard";
import ServiceCardSkeleton from "../../components/services/ServiceCardSkeleton";
import ServiceModal from "../../components/services/ServiceModal";

export default function HomeServices() {
  const { activeTheme } = useTheme();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      const res = await apiFetch("/public/services.php");
      if (res?.data) setServices(res.data);
      setLoading(false);
    };

    loadServices();
  }, []);


  if (!activeTheme) return null;

  return (
    <>
      <section
        className="py-12 px-4"
        style={{ backgroundColor: activeTheme.settings.backgroundColor }}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: activeTheme.settings.textMainColor }}
          >
            Nuestros Servicios
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? [...Array(3)].map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))
              : services.map(service => (
                <div
                  key={service.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedService(service)}
                >
                  <ThemeCard
                    title={service.title}
                    subtitle={service.subtitle}
                    description={service.short_description}
                    image={service.image}
                    theme={activeTheme}
                  />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}
