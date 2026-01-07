import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { alertError } from '../../lib/alert';
import QuoteCard from './QuoteCard';
import QuoteModal from './QuoteModal';

export default function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    form_id: '',
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState(null);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const loadFormsForFilter = async () => {
      try {
        const res = await apiFetch('/contactForms/list.php');
        if (res?.success && res?.data) {
          setForms(res.data);
        }
      } catch (err) {
        console.error("Error loading forms for filter:", err);
      }
    };
    loadFormsForFilter();
  }, []);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.form_id) params.append('form_id', filters.form_id);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const res = await apiFetch(`/contactSubmissions/list.php?${params.toString()}`);
      if (res?.success && res?.data) {
        setQuotes(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      alertError('Error', 'No se pudieron cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [filters]);

  const handleCardClick = (quote) => {
    setSelectedQuote(quote);
  };

  const handleCloseModal = () => {
    setSelectedQuote(null);
    loadQuotes();
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Cotizaciones Recibidas</h2>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              className="border p-2 w-full rounded"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="read">Leído</option>
              <option value="contacted">Contactado</option>
              <option value="quoted">Cotizado</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Formulario</label>
            <select
              className="border p-2 w-full rounded"
              value={filters.form_id}
              onChange={(e) => setFilters(prev => ({ ...prev, form_id: e.target.value, page: 1 }))}
            >
              <option value="">Todos</option>
              {forms.map(form => (
                <option key={form.id} value={form.id}>{form.name} (v{form.version})</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', form_id: '', page: 1, limit: 12 })}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 w-full"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando cotizaciones...</p>
        </div>
      ) : quotes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No hay cotizaciones para mostrar</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {quotes.map(quote => (
              <QuoteCard key={quote.id} quote={quote} onClick={handleCardClick} />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 bg-gray-200 rounded">
                Página {pagination.page} de {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}

      {selectedQuote && (
        <QuoteModal
          quote={selectedQuote}
          onClose={handleCloseModal}
          onUpdate={loadQuotes}
        />
      )}
    </div>
  );
}

