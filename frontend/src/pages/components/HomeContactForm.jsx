import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { apiFetch, apiPost } from '../../lib/api';
import { alertSuccess, alertError } from '../../lib/alert';

const FormSkeleton = () => {
  const { activeTheme } = useTheme();
  if (!activeTheme) return null;
  const s = activeTheme.settings;
  return (
    <div className="space-y-4 p-6 rounded-lg shadow-lg animate-pulse" style={{ backgroundColor: s.cardBackgroundColor }}>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
    </div>
  );
};

export default function HomeContactForm() {
  const { activeTheme } = useTheme();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadForm = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/public/contact-form.php');
        if (res?.success && res?.data) {
          setForm(res.data);
          const initialData = {};
          res.data.fields.forEach(field => {
            initialData[field.field_name] = '';
          });
          setFormData(initialData);

          const serviceSelectField = res.data.fields.find(f => f.field_type === 'service_select');
          if (serviceSelectField && serviceSelectField.services) {
            setServices(serviceSelectField.services);
          }
        } else {
          console.warn('No hay formulario de contacto activo.');
          setForm(null);
        }
      } catch (err) {
        console.error('Error al cargar el formulario de contacto:', err);
        setForm(null);
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, []);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (formErrors[fieldName]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    form.fields.forEach(field => {
      if (field.is_required && !formData[field.field_name]?.trim()) {
        errors[field.field_name] = `${field.field_label} es obligatorio.`;
      }
      if (field.field_type === 'email' && formData[field.field_name]?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.field_name].trim())) {
        errors[field.field_name] = 'Formato de email inválido.';
      }
      if (field.field_type === 'tel' && formData[field.field_name]?.trim() && !/^[0-9\s\-\(\)]+$/.test(formData[field.field_name].trim())) {
        errors[field.field_name] = 'Formato de teléfono inválido.';
      }
      if (field.field_type === 'number' && formData[field.field_name]?.trim() && isNaN(formData[field.field_name])) {
        errors[field.field_name] = 'Debe ser un número.';
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!validateForm()) {
      alertError('Error de validación', 'Por favor, corrige los errores en el formulario.');
      return;
    }

    setSubmitting(true);
    setFormErrors({});

    try {
      let serviceId = null;
      const serviceSelectField = form.fields.find(f => f.field_type === 'service_select');
      if (serviceSelectField && formData[serviceSelectField.field_name]) {
        serviceId = parseInt(formData[serviceSelectField.field_name]);
      }

      const payload = {
        form_id: form.id,
        service_id: serviceId,
        form_data: formData,
      };

      const res = await apiPost('/public/contact-form.php', payload);

      if (res?.success) {
        alertSuccess('Formulario enviado', 'Tu solicitud ha sido recibida. Te contactaremos pronto.');
        setSubmitted(true);
        setFormData({});
      } else {
        alertError('Error', res?.message || 'No se pudo enviar el formulario.');
      }
    } catch (err) {
      alertError('Error', err?.message || 'Error de conexión al enviar el formulario.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!activeTheme) return null;
  const s = activeTheme.settings;

  if (loading) {
    return (
      <section className="py-12 px-4" style={{ backgroundColor: s.backgroundColor }}>
        <div className="max-w-xl mx-auto">
          <FormSkeleton />
        </div>
      </section>
    );
  }

  if (!form) {
    return (
      <section className="py-12 px-4" style={{ backgroundColor: s.backgroundColor }}>
        <div className="max-w-xl mx-auto text-center p-6 rounded-lg shadow-lg" style={{ backgroundColor: s.cardBackgroundColor, color: s.textMainColor }}>
          <h2 className="text-2xl font-bold mb-4">Contáctanos</h2>
          <p>Actualmente no hay un formulario de contacto activo. Por favor, inténtalo más tarde.</p>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="py-12 px-4" style={{ backgroundColor: s.backgroundColor }}>
        <div className="max-w-xl mx-auto text-center p-6 rounded-lg shadow-lg" style={{ backgroundColor: s.cardBackgroundColor, color: s.textMainColor }}>
          <h2 className="text-2xl font-bold mb-4">¡Gracias por tu mensaje!</h2>
          <p className="text-lg">Hemos recibido tu solicitud y te contactaremos a la brevedad.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300"
            style={{ backgroundColor: s.primaryColor }}
          >
            Enviar otra solicitud
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4" style={{ backgroundColor: s.backgroundColor }}>
      <div className="max-w-xl mx-auto p-6 rounded-lg shadow-lg" style={{ backgroundColor: s.cardBackgroundColor, border: `1px solid ${s.cardBorderColor}` }}>
        <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: s.textMainColor }}>
          {form.name}
        </h2>
        {form.description && (
          <p className="text-center mb-6 text-sm" style={{ color: s.textSecondaryColor }}>
            {form.description}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {form.fields.map(field => (
            <div key={field.id}>
              <label htmlFor={`field-${field.field_name}`} className="block text-sm font-medium mb-1" style={{ color: s.textMainColor }}>
                {field.field_label} {field.is_required && <span className="text-red-500">*</span>}
              </label>
              {field.field_type === 'textarea' ? (
                <textarea
                  id={`field-${field.field_name}`}
                  className={`border p-2 w-full rounded ${formErrors[field.field_name] ? 'border-red-500' : 'border-gray-300'}`}
                  rows="4"
                  value={formData[field.field_name] || ''}
                  onChange={(e) => handleChange(field.field_name, e.target.value)}
                  placeholder={field.help_text || ''}
                  required={field.is_required}
                  style={{ backgroundColor: s.backgroundColor, color: s.textMainColor }}
                ></textarea>
              ) : field.field_type === 'select' ? (
                <select
                  id={`field-${field.field_name}`}
                  className={`border p-2 w-full rounded ${formErrors[field.field_name] ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData[field.field_name] || ''}
                  onChange={(e) => handleChange(field.field_name, e.target.value)}
                  required={field.is_required}
                  style={{ backgroundColor: s.backgroundColor, color: s.textMainColor }}
                >
                  <option value="">Selecciona una opción</option>
                  {field.field_options?.options?.map((option, i) => (
                    <option key={i} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.field_type === 'service_select' ? (
                <select
                  id={`field-${field.field_name}`}
                  className={`border p-2 w-full rounded ${formErrors[field.field_name] ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData[field.field_name] || ''}
                  onChange={(e) => handleChange(field.field_name, e.target.value)}
                  required={field.is_required}
                  style={{ backgroundColor: s.backgroundColor, color: s.textMainColor }}
                >
                  <option value="">Selecciona un servicio</option>
                  {(field.services || services).map(service => (
                    <option key={service.id} value={service.id}>{service.title}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.field_type}
                  id={`field-${field.field_name}`}
                  className={`border p-2 w-full rounded ${formErrors[field.field_name] ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData[field.field_name] || ''}
                  onChange={(e) => handleChange(field.field_name, e.target.value)}
                  placeholder={field.help_text || ''}
                  required={field.is_required}
                  style={{ backgroundColor: s.backgroundColor, color: s.textMainColor }}
                />
              )}
              {field.help_text && !formErrors[field.field_name] && (
                <p className="text-xs mt-1" style={{ color: s.textDetailColor }}>{field.help_text}</p>
              )}
              {formErrors[field.field_name] && (
                <p className="text-red-500 text-sm mt-1">{formErrors[field.field_name]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: s.primaryColor }}
            disabled={submitting}
          >
            {submitting ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>
    </section>
  );
}

