import React from 'react';
import Header from '../components/Header';

const PanelAdmin = () => {
  return (
    <div>
      <Header />
      <main className="p-10">
        <h2 className="text-2xl font-bold mb-4">Panel Administrativo</h2>
        <p>Contenido del panel de administración.</p>
      </main>
    </div>
  );
};

export default PanelAdmin;
