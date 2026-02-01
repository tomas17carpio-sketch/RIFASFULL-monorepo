
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { label: 'Usuarios', icon: 'group', path: '/admin/users' },
    { label: 'Rifas', icon: 'local_activity', path: '/admin/raffles' },
    { label: 'Finanzas', icon: 'payments', path: '/admin/finances' },
    { label: 'Seguridad', icon: 'security', path: '/admin/security' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-[#111418] border-r border-[#283039] flex flex-col h-full shrink-0">
      <div className="p-8">
        <Link to="/" className="flex gap-4 items-center group">
          <div className="bg-slate-800 p-2 rounded-2xl transition-transform group-hover:scale-110">
            <Logo className="size-12" />
          </div>
          <div>
            <h1 className="text-white text-xl font-black leading-tight tracking-tighter uppercase">RIFASFULLPROJECT</h1>
            <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest">Core Engine</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Menú Principal</p>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group border ${
              isActive(item.path) 
                ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' 
                : 'text-slate-500 border-transparent hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${isActive(item.path) ? 'icon-fill' : ''}`}>
              {item.icon}
            </span>
            <span className="text-sm font-bold">{item.label}</span>
            {isActive(item.path) && <span className="ml-auto size-1.5 bg-primary rounded-full animate-pulse"></span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#283039]">
        <div className="flex items-center gap-3 bg-slate-900/30 p-3 rounded-2xl border border-white/5">
          <div className="size-10 rounded-full border-2 border-primary/30 p-0.5">
            <div className="w-full h-full rounded-full bg-cover" style={{ backgroundImage: `url('https://picsum.photos/seed/admin/100')` }}></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-xs font-black truncate">C. Velásquez</p>
            <p className="text-slate-500 text-[9px] font-bold uppercase truncate">Admin Superior</p>
          </div>
          <button className="ml-auto text-slate-500 hover:text-white">
            <span className="material-symbols-outlined text-base">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
