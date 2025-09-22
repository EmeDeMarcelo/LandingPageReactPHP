import React, { useState } from 'react';
import Swal from 'sweetalert2';
import card1 from '../images/cards/card1.jpg';
import card2 from '../images/cards/card2.jpg';
import card3 from '../images/cards/card3.jpg';

const Form = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    wsp: '',
    servicio: '',
    cantidad: 1,
    fecha: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const servicios = [
    { id: 1, title: 'Breack Fast' },
    { id: 2, title: 'Kitchen Lessons' },
    { id: 3, title: 'BBQ' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulación de envío al backend
      Swal.fire({
        title: 'Enviando cotización...',
        html: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Simulamos un delay de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Swal.close(); // Cerramos loader

      // SweetAlert de éxito
      Swal.fire({
        title: '¡Formulario enviado!',
        text: 'Tu cotización ha sido enviada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        background: '#18181b', // gris muy oscuro
        color: '#facc15', // dorado (tailwind yellow-400)
        confirmButtonColor: '#d4af37', // dorado clásico
      });


      // Limpiar formulario
      setFormData({
        nombre: '',
        correo: '',
        wsp: '',
        servicio: '',
        cantidad: 1,
        fecha: ''
      });

    } catch (error) {
      Swal.close();
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar tu cotización. Intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      console.error('Error enviando formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-zinc-800 p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-yellow-500">Solicitar Cotización</h2>

      <div>
        <label className="block mb-1 font-medium">Nombre de Contacto</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Correo</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">WhatsApp</label>
        <input
          type="tel"
          name="wsp"
          value={formData.wsp}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Servicio</label>
        <select
          name="servicio"
          value={formData.servicio}
          onChange={handleChange}
          required
          className="w-full border border-gray-600 rounded p-2 bg-zinc-900 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="" disabled className="bg-zinc-900 text-yellow-400">
            Seleccione un servicio
          </option>
          {servicios.map((s) => (
            <option
              key={s.id}
              value={s.title}
              className="bg-zinc-900 text-yellow-400"
            >
              {s.title}
            </option>
          ))}
        </select>
      </div>


      <div>
        <label className="block mb-1 font-medium">Cantidad de Personas</label>
        <input
          type="number"
          name="cantidad"
          value={formData.cantidad}
          min="1"
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Fecha</label>
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full font-bold py-2 px-4 rounded transition-colors
    ${isSubmitting
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-yellow-500 text-black hover:bg-yellow-600'}`}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Cotización'}
      </button>

    </form>
  );
};

export default Form;
