
import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; avatar: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLoginSuccess({
        name: 'Carlos Velásquez',
        email: 'carlos@rifasfullproject.com',
        avatar: 'https://picsum.photos/seed/user123/100'
      });
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#1c2127] rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isLogin ? '¡Bienvenido!' : 'Crea tu Cuenta'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? 'Ingresa para gestionar tus tickets' : 'Únete a la comunidad de ganadores'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <img src="https://www.google.com/favicon.ico" className="size-4" alt="Google" />
              <span className="text-xs font-bold text-white">Google</span>
            </button>
            <button className="h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined text-white text-lg">apple</span>
              <span className="text-xs font-bold text-white">Apple ID</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <span className="relative bg-[#1c2127] px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">O con tu correo</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full h-12 px-5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-1 focus:ring-primary outline-none" 
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <input 
                type="email" 
                required
                className="w-full h-12 px-5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-1 focus:ring-primary outline-none" 
                placeholder="usuario@email.com"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
                {isLogin && <button type="button" className="text-[9px] font-bold text-primary hover:underline">¿Olvidaste tu clave?</button>}
              </div>
              <input 
                type="password" 
                required
                className="w-full h-12 px-5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-1 focus:ring-primary outline-none" 
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-xl shadow-orange-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Entrar Ahora' : 'Crear Cuenta'}
                  <span className="material-symbols-outlined text-sm">login</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
