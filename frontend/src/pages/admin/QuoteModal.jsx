import React, { useEffect, useState } from 'react';
import { apiFetch, apiPost } from '../../lib/api';
import { alertSuccess, alertError, alertConfirm } from '../../lib/alert';

export default function QuoteModal({ quote, onClose, onUpdate }) {
  const [fullQuote, setFullQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(quote.status);
  const [notes, setNotes] = useState(quote.notes || '');
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const loadFullQuote = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/contactSubmissions/get.php?id=${quote.id}`);
        if (res?.success && res?.data) {
          setFullQuote(res.data);
          setStatus(res.data.status);
          setNotes(res.data.notes || '');
          setQuotePrice(res.data.quoted_price || '');
        } else {
          alertError('Error', res?.message || 'No se pudo cargar el detalle de la cotización.');
          onClose();
        }
      } catch (err) {
        alertError('Error', err?.message || 'Error de conexión al cargar la cotización.');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    loadFullQuote();
  }, [quote.id, onClose]);

  const handleUpdateStatus = async () => {
    setUpdatingStatus(true);
    try {
      await apiPost('/contactSubmissions/update_status.php', {
        id: quote.id,
        status: status,
        notes: notes.trim() || null,
      });
      alertSuccess('Estado y notas actualizados.');
      onUpdate();
    } catch (err) {
      alertError('Error', err?.message || 'No se pudo actualizar el estado.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendQuote = async () => {
    if (!quotePrice || parseFloat(quotePrice) <= 0) {
      return alertError('Error', 'Debes ingresar un precio válido para la cotización.');
    }

    const result = await alertConfirm(
      'Enviar Cotización',
      `¿Estás seguro de que deseas enviar esta cotización por $${parseFloat(quotePrice).toLocaleString('es-CL')} CLP?`
    );
    if (!result.isConfirmed) return;

    setSendingQuote(true);
    try {
      await apiPost('/contactSubmissions/send-quote.php', {
        submission_id: quote.id,
        price: parseFloat(quotePrice),
        message: quoteMessage.trim() || null,
      });
      alertSuccess('Cotización enviada por correo y estado actualizado.');
      onUpdate();
      setStatus('quoted');
    } catch (err) {
      alertError('Error', err?.message || 'No se pudo enviar la cotización.');
    } finally {
      setSendingQuote(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-8 shadow-xl text-center">
          <p className="text-lg font-semibold">Cargando detalles de la cotización...</p>
        </div>
      </div>
    );
  }

  if (!fullQuote) return null;

  const formattedCreatedAt = new Date(fullQuote.created_at).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Detalle de Cotización #{fullQuote.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            &times;
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600"><strong>Formulario:</strong> {fullQuote.form_name} (v{fullQuote.form_version})</p>
              {fullQuote.service_title && (
                <p className="text-sm text-gray-600"><strong>Servicio:</strong> {fullQuote.service_title}</p>
              )}
              <p className="text-sm text-gray-600"><strong>Estado:</strong> {fullQuote.status}</p>
              <p className="text-sm text-gray-600"><strong>Recibido:</strong> {formattedCreatedAt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600"><strong>IP:</strong> {fullQuote.ip_address}</p>
              <p className="text-sm text-gray-600"><strong>User Agent:</strong> {fullQuote.user_agent?.substring(0, 50)}...</p>
            </div>
          </div>

          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Datos del Formulario</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fullQuote.data.map((field, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600"><strong>{field.field_label}:</strong></p>
                  <p className="font-medium break-words">{field.field_value || 'N/A'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Gestión de Estado</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select
                  className="border p-2 w-full rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="read">Leído</option>
                  <option value="contacted">Contactado</option>
                  <option value="quoted">Cotizado</option>
                  <option value="closed">Cerrado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notas internas</label>
                <textarea
                  className="border p-2 w-full rounded"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas internas sobre esta cotización..."
                ></textarea>
              </div>
              <button
                onClick={handleUpdateStatus}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                disabled={updatingStatus}
              >
                {updatingStatus ? 'Actualizando...' : 'Actualizar Estado'}
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Enviar Cotización</h3>
            <div className="space-y-4 bg-blue-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium mb-1">Precio (CLP) *</label>
                <input
                  type="number"
                  className="border p-2 w-full rounded"
                  placeholder="50000"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mensaje adicional (opcional)</label>
                <textarea
                  className="border p-2 w-full rounded"
                  rows="4"
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  placeholder="Mensaje personalizado que se incluirá en el correo..."
                ></textarea>
              </div>
              <button
                onClick={handleSendQuote}
                disabled={sendingQuote || !quotePrice || parseFloat(quotePrice) <= 0}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingQuote ? 'Enviando...' : 'Enviar Cotización por Correo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

