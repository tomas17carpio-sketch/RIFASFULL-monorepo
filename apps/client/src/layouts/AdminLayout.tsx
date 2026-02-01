
import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout: React.FC<{ children: React.ReactNode; onExit: () => void }> = ({ children, onExit }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD';

  return (
    <div className="flex h-screen bg-[#0a0f14] overflow-hidden">
      {/* Sidebar Fijo */}
      <AdminSidebar />
      
      {/* Contenedor de Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header de Admin */}
        <header className="h-16 flex items-center justify-between px-8 bg-[#111418] border-b border-[#283039] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <span className="material-symbols-outlined text-primary text-[18px]">admin_panel_settings</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold tracking-wider">
              <span>RIFASFULLPROJECT CMS</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-200">{currentPath}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 border-r border-slate-800 pr-6">
              <div className="text-right">
                <p className="text-[10px] text-emerald-500 font-black uppercase">Sistema Online</p>
                <p className="text-[9px] text-slate-500 font-mono">STITCH-AI-V2</p>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer transition-colors">notifications</span>
                <span className="absolute -top-1 -right-1 size-2.5 bg-primary rounded-full border-2 border-[#111418]"></span>
              </div>
            </div>
            
            <button 
              onClick={onExit}
              className="group flex items-center gap-2 text-xs bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 px-4 py-2 rounded-lg transition-all border border-transparent hover:border-red-500/20"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="font-bold">Salir</span>
            </button>
          </div>
        </header>

        {/* Área de Trabajo con Scroll */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
