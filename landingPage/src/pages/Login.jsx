import React from 'react';
import Header from '../components/Header';

const Login = () => {
  return (
    <div>
      <Header />
      <main className="p-10">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="flex flex-col max-w-sm mx-auto">
          <input type="text" placeholder="Usuario" className="mb-4 p-2 border rounded"/>
          <input type="password" placeholder="Contraseña" className="mb-4 p-2 border rounded"/>
          <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Entrar</button>
        </form>
      </main>
    </div>
  );
};

export default Login;
