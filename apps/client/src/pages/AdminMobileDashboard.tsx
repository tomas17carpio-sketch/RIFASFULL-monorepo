
import React, { useState, useEffect, useMemo } from 'react';
import { backend } from '../backend';
import { Transaction, Raffle } from '../types';
import Logo from '../components/Logo';

const AdminMobileDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [stats, setStats] = useState({ revenue: 1420.50, pending: 0, activeUsers: 842 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toasts, setToasts] = useState<{id: number, text: string, type: 'success' | 'error' | 'info'}[]>([]);
  
  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    watchdog: true,
    antiFlood: false,
    geoFencing: true
  });

  // Form state for new flash raffle
  const [newRaffle, setNewRaffle] = useState({
    name: '',
    price: 5,
    category: 'Flash'
  });

  useEffect(() => {
    refreshData();
    const interval = setInterval(() => {
      if (isLive) {
        setStats(s => ({ ...s, activeUsers: s.activeUsers + (Math.random() > 0.5 ? 1 : -1) }));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const refreshData = () => {
    const txs = backend.getTransactions();
    setTransactions(txs);
    setStats(s => ({
      ...s,
      pending: txs.filter(t => t.status === 'pending').length,
      revenue: txs.filter(t => t.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0) + 1420.50
    }));
  };

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.reference.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const handleApprove = (id: string) => {
    backend.approveTransaction(id);
    refreshData();
    addToast("Pago aprobado correctamente");
    if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
  };

  const handleReject = (id: string) => {
    if (window.confirm("¿Seguro que deseas rechazar este pago?")) {
      backend.deleteTransaction(id);
      refreshData();
      addToast("Pago rechazado y eliminado", 'error');
      if (navigator.vibrate) navigator.vibrate(100);
    }
  };

  const handleCreateFlashRaffle = (e: React.FormEvent) => {
    e.preventDefault();
    const raffle: Raffle = {
      id: `FLASH-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: newRaffle.name,
      price: newRaffle.price,
      category: newRaffle.category,
      currency: 'USD',
      totalTickets: 100,
      soldTickets: 0,
      endDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=400',
      description: 'Sorteo relámpago creado desde administración móvil.',
      isNew: true
    };
    backend.createRaffle(raffle);
    setIsCreateModalOpen(false);
    setNewRaffle({ name: '', price: 5, category: 'Flash' });
    addToast("¡Sorteo Flash publicado!");
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white font-sans overflow-hidden select-none">
      {/* Toast Notification Container */}
      <div className="fixed top-24 left-6 right-6 z-[100] space-y-3 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 ${
            toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-primary'
          } text-white font-black text-xs uppercase tracking-widest`}>
            <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
            {toast.text}
          </div>
        ))}
      </div>

      {/* Dynamic Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Logo className="size-10" />
             <span className={`absolute -bottom-1 -right-1 size-3 ${isLive ? 'bg-emerald-500' : 'bg-slate-500'} rounded-full border-2 border-[#050505]`}></span>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter uppercase">RIFASFULLPROJECT <span className="text-primary">Admin</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Server: STITCH-AI-V2</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { refreshData(); addToast("Datos sincronizados", 'info'); }}
            className="size-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-xl">sync</span>
          </button>
          <div className="size-10 rounded-full border-2 border-primary/20 p-0.5">
            <img src="https://picsum.photos/seed/admin/100" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </header>

      {/* Search Bar - Only in Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="px-6 pt-4">
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-lg group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Buscar pago o referencia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
            />
          </div>
        </div>
      )}

      {/* App Body */}
      <main className="flex-1 overflow-y-auto p-5 pb-32 space-y-6 custom-scrollbar">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Live Stats Slider */}
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              <div className="min-w-[160px] bg-gradient-to-br from-primary/20 to-transparent p-5 rounded-[2.5rem] border border-primary/20 flex flex-col justify-between h-40">
                <span className="material-symbols-outlined text-primary">payments</span>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase">Ventas Hoy</p>
                  <h3 className="text-2xl font-black">${stats.revenue.toFixed(2)}</h3>
                </div>
              </div>
              <div className="min-w-[160px] bg-white/5 p-5 rounded-[2.5rem] border border-white/5 flex flex-col justify-between h-40">
                <span className="material-symbols-outlined text-emerald-500">groups</span>
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase">Usuarios Online</p>
                    <button onClick={() => setIsLive(!isLive)} className={`size-4 rounded-full ${isLive ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`}></button>
                  </div>
                  <h3 className="text-2xl font-black">{stats.activeUsers}</h3>
                </div>
              </div>
            </div>

            {/* Quick Actions Board */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validación de Pagos</h4>
                <span className="px-2 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-full">
                  {filteredTransactions.filter(t => t.status === 'pending').length} RESULTADOS
                </span>
              </div>
              
              <div className="space-y-3">
                {filteredTransactions.filter(t => t.status === 'pending').map(tx => (
                  <div key={tx.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 group active:bg-white/10 transition-all animate-in slide-in-from-right-4">
                    <img src={tx.avatar} className="size-12 rounded-2xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black truncate">{tx.user}</p>
                      <p className="text-[10px] text-primary font-mono">${tx.amount} • {tx.bank}</p>
                      <p className="text-[8px] text-slate-500 truncate mt-0.5">Ref: {tx.reference}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleReject(tx.id)} className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-red-500 border border-white/5 active:scale-90"><span className="material-symbols-outlined text-sm">close</span></button>
                      <button onClick={() => handleApprove(tx.id)} className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 active:scale-90"><span className="material-symbols-outlined text-sm">check</span></button>
                    </div>
                  </div>
                ))}
                {filteredTransactions.filter(t => t.status === 'pending').length === 0 && (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-3xl text-slate-700 mb-2">done_all</span>
                    <p className="text-[10px] font-bold text-slate-600 uppercase">Todo al día</p>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full h-16 bg-white text-black font-black rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-white/5"
            >
              <span className="material-symbols-outlined">add</span>
              Nueva Rifa Flash
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Escudo de IA</h2>
              <div className={`flex items-center gap-2 px-3 py-1 ${securitySettings.watchdog ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} rounded-full border`}>
                <span className={`size-1.5 ${securitySettings.watchdog ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'} rounded-full`}></span>
                <span className="text-[10px] font-black uppercase">{securitySettings.watchdog ? 'Protección Activa' : 'Blindaje Reducido'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'watchdog', label: 'Watchdog Engine', desc: 'Prevención de multi-cuentas', icon: 'visibility' },
                { id: 'antiFlood', label: 'Anti-Flood Payments', desc: 'Protección contra spam', icon: 'bolt' },
                { id: 'geoFencing', label: 'Geo-Fencing', desc: 'Solo conexiones locales', icon: 'location_on' }
              ].map(item => (
                <div key={item.id} className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-2xl bg-white/5 flex items-center justify-center ${securitySettings[item.id as keyof typeof securitySettings] ? 'text-primary' : 'text-slate-600'}`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black">{item.label}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <div className={`relative inline-flex items-center cursor-pointer`} onClick={() => setSecuritySettings(s => ({...s, [item.id]: !s[item.id as keyof typeof securitySettings]}))}>
                    <input type="checkbox" checked={securitySettings[item.id as keyof typeof securitySettings]} className="sr-only peer" readOnly />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2.5rem] space-y-4">
              <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Logs de Seguridad IA</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="mt-1 size-1.5 bg-red-500 rounded-full"></div>
                  <p className="text-[10px] text-slate-300"><span className="font-black text-white">BLOQUEO:</span> IP detectada intentando fuerza bruta en el Checkout.</p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 size-1.5 bg-amber-500 rounded-full"></div>
                  <p className="text-[10px] text-slate-300"><span className="font-black text-white">ALERTA:</span> Patrones de comportamiento sospechoso en pagos Banesco.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black">Configuración del Motor</h2>
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
               {[
                 { icon: 'account_balance', label: 'Cuentas Bancarias', sub: 'Gestionar Pago Móvil' },
                 { icon: 'percent', label: 'Comisiones', sub: 'Ajuste de tasas de cambio' },
                 { icon: 'support_agent', label: 'IA Training', sub: 'Entrenar respuestas del bot' },
                 { icon: 'logout', label: 'Cerrar Sesión', sub: 'Salir del panel administrativo', danger: true }
               ].map((opt, i) => (
                 <button key={i} className={`w-full flex items-center gap-4 px-8 py-6 border-b border-white/5 active:bg-white/5 transition-all text-left ${opt.danger ? 'text-red-500' : ''}`}>
                    <span className="material-symbols-outlined text-xl">{opt.icon}</span>
                    <div>
                      <h4 className="text-sm font-black">{opt.label}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{opt.sub}</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-slate-700">chevron_right</span>
                 </button>
               ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-28 right-6 size-16 bg-primary rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center text-white active:scale-90 transition-transform z-[60]"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* CREATE RAFFLE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative w-full bg-[#111] rounded-t-[3rem] border-t border-white/10 p-8 pb-12 animate-in slide-in-from-bottom-full duration-500">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-8"></div>
            <h2 className="text-2xl font-black mb-8">Nueva Rifa Relámpago</h2>
            <form onSubmit={handleCreateFlashRaffle} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre del Premio</label>
                <input 
                  type="text" required value={newRaffle.name} onChange={e => setNewRaffle({...newRaffle, name: e.target.value})}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm outline-none focus:ring-2 focus:ring-primary font-bold"
                  placeholder="Ej: Kit Parrillero Pro"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Precio USD</label>
                  <input 
                    type="number" required value={newRaffle.price} onChange={e => setNewRaffle({...newRaffle, price: Number(e.target.value)})}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm outline-none focus:ring-2 focus:ring-primary font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Categoría</label>
                  <select 
                    value={newRaffle.category} onChange={e => setNewRaffle({...newRaffle, category: e.target.value})}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm outline-none focus:ring-2 focus:ring-primary font-bold"
                  >
                    <option>Flash</option>
                    <option>Hogar</option>
                    <option>Gourmet</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full h-16 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-orange-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest">
                Publicar Ahora
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modern Tab Bar */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-[#111111]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex items-center justify-around px-4 z-50 shadow-2xl">
        {[
          { id: 'dashboard', icon: 'grid_view', label: 'Panel' },
          { id: 'security', icon: 'security', label: 'IA Guard' },
          { id: 'settings', icon: 'settings', label: 'Ajustes' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${activeTab === tab.id ? 'text-primary' : 'text-slate-500'}`}
          >
            {activeTab === tab.id && <span className="absolute -top-4 size-1 bg-primary rounded-full shadow-[0_0_10px_#f48c25]"></span>}
            <span className={`material-symbols-outlined text-2xl ${activeTab === tab.id ? 'icon-fill' : ''}`}>{tab.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-[0.1em]">{tab.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .icon-fill { font-variation-settings: 'FILL' 1; }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default AdminMobileDashboard;
