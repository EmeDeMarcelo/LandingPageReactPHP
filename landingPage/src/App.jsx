import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import PanelAdmin from './pages/PanelAdmin';

const App = () => {
  // Aquí simulamos si el usuario está logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/paneladmin"
          element={isLoggedIn ? <PanelAdmin /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
