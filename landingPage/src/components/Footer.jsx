// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        
        {/* Datos de contacto */}
        <div>
          <h3 className="text-yellow-400 text-lg font-semibold mb-2">Contacto</h3>
          <p className="text-gray-300">Email: chef@example.com</p>
          <p className="text-gray-300">Teléfono: +56 9 1234 5678</p>
        </div>

        {/* Dirección */}
        <div>
          <h3 className="text-yellow-400 text-lg font-semibold mb-2">Dirección</h3>
          <p className="text-gray-300">Calle Falsa 123</p>
          <p className="text-gray-300">Santiago, Chile</p>
        </div>

        {/* Redes sociales */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.128 8.438 9.878v-6.987H7.898v-2.891h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.772-1.63 1.562v1.875h2.773l-.443 2.891h-2.33V21.88C18.343 21.128 22 17 22 12z"/>
            </svg>
          </a>

          <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.346 3.608 1.32.975.975 1.258 2.242 1.32 3.608.058 1.266.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.345 2.633-1.32 3.608-.975.975-2.242 1.258-3.608 1.32-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.345-3.608-1.32-.975-.975-1.258-2.242-1.32-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.345-2.633 1.32-3.608C4.528 2.508 5.795 2.225 7.161 2.163 8.427 2.105 8.806 2.093 12 2.093zm0-2.163C8.741 0 8.332.012 7.052.07 5.775.127 4.593.437 3.608 1.422 2.623 2.407 2.313 3.589 2.256 4.867.012 8.332 0 8.741 0 12c0 3.259.012 3.668.07 4.948.057 1.278.367 2.46 1.352 3.445.985.985 2.167 1.295 3.445 1.352C8.332 23.988 8.741 24 12 24s3.668-.012 4.948-.07c1.278-.057 2.46-.367 3.445-1.352.985-.985 1.295-2.167 1.352-3.445.058-1.28.07-1.689.07-4.948s-.012-3.668-.07-4.948c-.057-1.278-.367-2.46-1.352-3.445C19.408.437 18.226.127 16.948.07 15.668.012 15.259 0 12 0z"/>
              <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8z"/>
              <circle cx="18.406" cy="5.594" r="1.44"/>
            </svg>
          </a>

          <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557a9.834 9.834 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.924 4.924 0 00-8.388 4.482A13.978 13.978 0 011.671 3.149 4.924 4.924 0 003.195 9.723a4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084c.626 1.956 2.444 3.377 4.6 3.416A9.869 9.869 0 010 19.54a13.924 13.924 0 007.548 2.212c9.057 0 14.01-7.496 14.01-13.986 0-.21 0-.423-.015-.634A10.012 10.012 0 0024 4.557z"/>
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}
