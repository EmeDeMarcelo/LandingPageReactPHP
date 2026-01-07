import React from 'react';

export default function QuoteCard({ quote, onClick }) {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-indigo-100 text-indigo-800';
      case 'quoted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedDate = new Date(quote.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div
      onClick={() => onClick(quote)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer p-4 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Cotización #<span className="text-blue-600">{quote.id}</span>
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses(quote.status)}`}>
            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          Formulario: <span className="font-medium">{quote.form_name} (v{quote.form_version})</span>
        </p>
        {quote.service_title && (
          <p className="text-sm text-gray-600 mb-1">
            Servicio: <span className="font-medium">{quote.service_title}</span>
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2">Recibido: {formattedDate}</p>
      </div>
    </div>
  );
}

