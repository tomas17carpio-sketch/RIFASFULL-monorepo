
import React from 'react';
import { Transaction } from '../types';

const transactions: Transaction[] = [
  { id: '1', reference: '#09283712', bank: 'Banesco', user: 'Juan Pérez', amount: 1450, iaScore: 35, status: 'review', date: 'Hoy', avatar: 'https://picsum.photos/seed/u1/40', tickets: ['0012', '4491'] },
  { id: '2', reference: '#09283715', bank: 'Mercantil', user: 'Maria Diaz', amount: 500, iaScore: 99, status: 'approved', date: 'Hoy', avatar: 'https://picsum.photos/seed/u2/40', tickets: ['1234'] },
  { id: '3', reference: '#09283744', bank: 'Provincial', user: 'Jose Lopez', amount: 2100, iaScore: 98, status: 'conciliated', date: 'Hoy', avatar: 'https://picsum.photos/seed/u3/40', tickets: ['5678', '9012', '3456'] },
  { id: '4', reference: '#09283799', bank: 'BDV', user: 'Ana Rojas', amount: 150, iaScore: 65, status: 'pending', date: 'Hoy', avatar: 'https://picsum.photos/seed/u4/40', tickets: ['7890'] },
];

const AdminFinances: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Conciliación de Pagos</h1>
          <p className="text-slate-500">Valide transacciones entrantes y detecte anomalías financieras.</p>
        </div>
        <div className="flex gap-3">
          <button className="h-11 px-5 border border-admin-border text-slate-300 font-bold rounded-xl hover:bg-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined">download</span> Exportar CSV
          </button>
          <button className="h-11 px-5 bg-primary text-white font-black rounded-xl shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined">sync</span> Sincronizar Banco
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ingresos Totales (Mes)', val: '$45,230.00', trend: '↑ 12%', trendColor: 'text-emerald-500', icon: 'trending_up' },
          { label: 'Pagos Pendientes', val: '12', trend: 'por verificar', trendColor: 'text-slate-500', icon: 'pending' },
          { label: 'Tasa de Fraude', val: '1.2%', trend: 'Bajo Riesgo', trendColor: 'text-emerald-500', icon: 'security' },
          { label: 'Balance Neto', val: '$38,500.00', trend: '', trendColor: '', icon: 'account_balance' }
        ].map(stat => (
          <div key={stat.label} className="bg-admin-surface p-6 rounded-2xl border border-admin-border shadow-sm">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-2xl font-black text-white">{stat.val}</h3>
              {stat.trend && <span className={`text-[10px] font-bold ${stat.trendColor}`}>{stat.trend}</span>}
            </div>
            <div className="mt-4 flex justify-between items-center text-slate-600">
              <span className="material-symbols-outlined text-lg">{stat.icon}</span>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <div key={i} className="size-5 rounded-full bg-slate-800 border-2 border-admin-surface" />)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-admin-surface rounded-2xl border border-admin-border overflow-hidden">
          <div className="p-4 border-b border-admin-border flex items-center justify-between bg-slate-900/50">
            <div className="flex gap-2">
              {['Todos', 'Pendientes', 'Fraude'].map((f, i) => (
                <button key={f} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${i === 0 ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-white'}`}>{f}</button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-500 text-lg">calendar_today</span>
              <input type="date" className="bg-transparent border-none text-xs font-bold text-slate-400 focus:ring-0" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/20">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Referencia / Banco</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Monto</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">IA Score</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-white font-mono">{tx.reference}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{tx.bank} • Pago Móvil</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-white">Bs. {tx.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border ${
                        tx.iaScore > 70 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        <span className="material-symbols-outlined text-sm">{tx.iaScore > 70 ? 'verified_user' : 'warning'}</span>
                        {tx.iaScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        tx.status === 'conciliated' ? 'bg-blue-500/10 text-blue-500' :
                        tx.status === 'review' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-slate-800 text-slate-500'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-500 hover:text-primary transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-admin-surface rounded-2xl border border-admin-border p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">psychology</span> Análisis IA en Vivo
              </h3>
              <span className="size-3 bg-emerald-500 rounded-full animate-ping"></span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2">
                <div className="flex items-center gap-2 text-red-500">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <p className="text-xs font-black uppercase">Posible Duplicado</p>
                </div>
                <p className="text-[10px] text-red-300 leading-relaxed">Referencia #09283712 reportada anteriormente en otra cuenta.</p>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 h-8 bg-red-600 text-white text-[10px] font-black rounded-lg">Bloquear</button>
                  <button className="flex-1 h-8 border border-admin-border text-slate-400 text-[10px] font-black rounded-lg">Ignorar</button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-500">
                  <span className="material-symbols-outlined text-sm">location_off</span>
                  <p className="text-xs font-black uppercase">Ubicación Inusual</p>
                </div>
                <p className="text-[10px] text-amber-300 leading-relaxed">Pago #09283799 desde IP extranjera no coincide con perfil.</p>
              </div>
            </div>
            <button className="w-full text-[10px] font-black text-primary hover:underline pt-2">Ver reporte completo IA →</button>
          </div>

          <div className="bg-admin-surface rounded-2xl border border-admin-border p-6 space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Distribución de Bancos</h3>
            <div className="space-y-4">
              {[
                { label: 'Banesco', val: 45, color: 'bg-emerald-500' },
                { label: 'Banco de Venezuela', val: 30, color: 'bg-amber-500' },
                { label: 'Mercantil', val: 15, color: 'bg-blue-500' },
                { label: 'Provincial', val: 10, color: 'bg-purple-500' }
              ].map(b => (
                <div key={b.label} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>{b.label}</span>
                    <span className="text-white">{b.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full ${b.color}`} style={{ width: `${b.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinances;
