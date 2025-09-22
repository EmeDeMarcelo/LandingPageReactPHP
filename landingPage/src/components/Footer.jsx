// src/components/Footer.jsx
import React from 'react';


export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Datos de contacto */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-2">Contacto</h3>
          <p>Email: chef@example.com</p>
          <p>Teléfono: +56 9 1234 5678</p>
        </div>

        {/* Dirección */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-2">Dirección</h3>
          <p>Calle Falsa 123</p>
          <p>Santiago, Chile</p>
        </div>

        {/* Redes sociales o nota de derechos */}
        <div className="mt-4 md:mt-0">
          <p className="text-gray-500 text-sm">&copy; 2025 Chef Landing. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

