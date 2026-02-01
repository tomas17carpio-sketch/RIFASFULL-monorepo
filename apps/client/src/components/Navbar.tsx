
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import AuthModal from './AuthModal';

interface NavbarProps {
  user: { name: string; email: string; avatar: string } | null;
  onLogin: (user: { name: string; email: string; avatar: string }) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogin, onLogout }) => {
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const navLinks = [
    { label: 'Explorar', path: '/' },
    { label: 'Mis Rifas', path: '/my-raffles' },
    { label: 'Feedback', path: '/feedback' }
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4 lg:px-20">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-4 text-white group">
          <Logo className="size-12 transition-transform group-hover:scale-110" />
          <h2 className="text-xl font-black tracking-tighter uppercase">RIFASFULLPROJECT</h2>
        </Link>
      </div>

      <nav className="hidden lg:flex flex-1 justify-center gap-10">
        {navLinks.map((link) => (
          <Link 
            key={link.path}
            to={link.path} 
            className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-primary ${
              location.pathname === link.path ? 'text-primary' : 'text-slate-400'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
             <div className="size-9 rounded-full border border-primary/30 p-0.5">
                <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt={user.name} />
             </div>
             <button onClick={onLogout} className="text-[10px] font-black text-slate-500 hover:text-white uppercase transition-colors">Salir</button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAuthModalOpen(true)} 
            className="h-10 px-8 bg-primary text-white text-[10px] font-black rounded-full uppercase hover:bg-primary-dark shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            Entrar
          </button>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={onLogin} />
    </header>
  );
};

export default Navbar;
