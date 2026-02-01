
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Lun', sales: 4000, rev: 2400 },
  { name: 'Mar', sales: 3000, rev: 1398 },
  { name: 'Mie', sales: 2000, rev: 9800 },
  { name: 'Jue', sales: 2780, rev: 3908 },
  { name: 'Vie', sales: 1890, rev: 4800 },
  { name: 'Sab', sales: 2390, rev: 3800 },
  { name: 'Dom', sales: 3490, rev: 4300 },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Centro de Mando</h1>
          <p className="text-slate-500 font-medium">Análisis predictivo y operaciones en tiempo real.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-2 flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">IA STATUS</span>
                <span className="text-xs font-bold text-emerald-500">OPERATIVO V2.1</span>
             </div>
             <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
          </div>
          <button className="h-12 px-6 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-xl shadow-orange-500/20 flex items-center gap-3 transition-all hover:-translate-y-1 active:scale-95">
            <span className="material-symbols-outlined">add</span>
            Nueva Campaña
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ventas Netas', val: '$124,500', trend: '+15.4%', icon: 'payments', color: 'text-emerald-500' },
          { label: 'Tickets Activos', val: '45,201', trend: '+5.2%', icon: 'local_activity', color: 'text-primary' },
          { label: 'Nuevos Usuarios', val: '1,240', trend: '+8.1%', icon: 'group_add', color: 'text-indigo-400' },
          { label: 'Pagos en Revisión', val: '24', trend: '-2.4%', icon: 'verified_user', color: 'text-orange-500' }
        ].map((stat) => (
          <div key={stat.label} className="bg-[#1c2127] p-6 rounded-3xl border border-white/5 shadow-sm group hover:border-primary/30 transition-all hover:bg-[#222831]">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-slate-800 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                <span className="material-symbols-outlined text-[12px]">{stat.trend.startsWith('+') ? 'trending_up' : 'trending_down'}</span>
                {stat.trend}
              </div>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1c2127] p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">Curva de Crecimiento</h3>
              <p className="text-xs text-slate-500 font-medium">Volumen de transacciones vs. Ingresos netos</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-xl bg-slate-800 text-[10px] font-black text-white border border-white/5 uppercase">7D</button>
              <button className="px-4 py-1.5 rounded-xl bg-primary text-[10px] font-black text-white uppercase">30D</button>
            </div>
          </div>
          <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f48c25" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f48c25" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#283039" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c2127', border: '1px solid #283039', borderRadius: '12px' }}
                  itemStyle={{ color: '#f48c25', fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="rev" stroke="#f48c25" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1c2127] p-8 rounded-[2.5rem] border border-white/5 space-y-8 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Popularidad por Canal</h3>
            <p className="text-xs text-slate-500 font-medium">Origen de las últimas 5,000 participaciones.</p>
          </div>
          
          <div className="space-y-6">
            {[
              { label: 'Pago Móvil (Banesco)', val: 65, color: 'bg-emerald-500', shadow: 'shadow-emerald-500/20' },
              { label: 'Cripto (USDT)', val: 20, color: 'bg-primary', shadow: 'shadow-orange-500/20' },
              { label: 'PayPal', val: 10, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
              { label: 'Otros', val: 5, color: 'bg-slate-700', shadow: 'shadow-slate-500/20' }
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>{item.label}</span>
                  <span>{item.val}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} ${item.shadow} shadow-lg rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
             <span className="material-symbols-outlined text-sm">download</span>
             Descargar Reporte Completo
          </button>
        </div>
      </div>

      <div className="bg-[#1c2127] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
              <span className="material-symbols-outlined text-3xl icon-fill">security</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-[0.2em]">Watchdog Security Feed</h2>
              <p className="text-slate-500 text-xs font-medium">Análisis de patrones maliciosos en vivo • 24/7 Shielding</p>
            </div>
          </div>
          <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Limpiar Alertas</button>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { id: '1', level: 'CRÍTICO', msg: 'IP 192.168.1.5 bloqueada por fuerza bruta', desc: 'Múltiples intentos de acceso al módulo de conciliación detectados desde ubicación no segura.', time: 'Hace 2 min', color: 'text-red-500' },
            { id: '2', level: 'ADVERTENCIA', msg: 'Transacción #9912 en revisión por IA', desc: 'Referencia bancaria duplicada detectada en menos de 10 segundos para dos usuarios distintos.', time: 'Hace 15 min', color: 'text-amber-500' },
            { id: '3', level: 'SISTEMA', msg: 'Protocolo de Blindaje V2.1 Activado', desc: 'El sistema ha rotado las llaves de encriptación de las bases de datos exitosamente.', time: 'Hace 42 min', color: 'text-emerald-500' }
          ].map((alert) => (
            <div key={alert.id} className="p-8 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row items-center gap-8 group">
              <div className={`size-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center shrink-0 ${alert.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{alert.level === 'CRÍTICO' ? 'gpp_bad' : alert.level === 'ADVERTENCIA' ? 'warning' : 'verified'}</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full ${alert.color} bg-slate-900 border border-white/5 uppercase tracking-widest`}>{alert.level}</span>
                  <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">ID: {alert.id}</span>
                </div>
                <h4 className="text-base font-black text-white">{alert.msg}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-3xl">{alert.desc}</p>
              </div>
              <div className="flex flex-col items-end gap-3 shrink-0">
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{alert.time}</span>
                <button className="h-10 px-6 rounded-xl border border-white/10 text-[10px] font-black text-slate-300 hover:bg-slate-800 transition-colors uppercase tracking-widest">
                  Investigar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
