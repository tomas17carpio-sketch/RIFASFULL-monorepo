
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RaffleDetail from './pages/RaffleDetail';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Feedback from './pages/Feedback';
import MyRaffles from './pages/MyRaffles';
import PublicLayout from './layouts/PublicLayout';

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  const handleLogin = (userData: { name: string; email: string; avatar: string }) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <HashRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={
          <PublicLayout user={user} onLogin={handleLogin} onLogout={handleLogout}>
            <Home />
          </PublicLayout>
        } />
        <Route path="/raffle/:id" element={
          <PublicLayout user={user} onLogin={handleLogin} onLogout={handleLogout}>
            <RaffleDetail />
          </PublicLayout>
        } />
        <Route path="/checkout" element={
          <PublicLayout user={user} onLogin={handleLogin} onLogout={handleLogout}>
            <Checkout />
          </PublicLayout>
        } />
        <Route path="/success" element={
          <PublicLayout user={user} onLogin={handleLogin} onLogout={handleLogout}>
            <Success />
          </PublicLayout>
        } />
        <Route path="/feedback" element={
          <PublicLayout user={user} onLogin={handleLogin} onLogout={handleLogout}>
            <Feedback />
          </PublicLayout>
        } />
        <Route path="/my-raffles" element={
          <PublicLayout user={user} onLogin={handleLogin} onLogout={handleLogout}>
            <MyRaffles />
          </PublicLayout>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
