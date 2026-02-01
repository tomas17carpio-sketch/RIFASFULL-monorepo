
import React, { useState } from 'react';
import { User } from '../types';

const initialUsers: User[] = [
  { id: '1', name: 'Ana García', email: 'ana.garcia@email.com', status: 'active', riskScore: 15, lastActivity: 'Hace 2 horas', lastAction: 'Compra de Ticket #4922', avatar: 'https://picsum.photos/seed/u1/100', registeredAt: '12 Ago 2023' },
  { id: '2', name: 'Carlos Ruiz', email: 'carlos.crypto@tempmail.com', status: 'review', riskScore: 85, lastActivity: 'Ahora mismo', lastAction: 'Login fallido x5', avatar: 'https://picsum.photos/seed/u2/100', registeredAt: '12 Ago 2023' },
  { id: '3', name: 'Maria López', email: 'mary.lopez88@gmail.com', status: 'suspended', riskScore: 60, lastActivity: 'Hace 3 días', lastAction: 'Suspensión manual', avatar: 'https://picsum.photos/seed/u3/100', registeredAt: '12 Ago 2023' },
  { id: '4', name: 'Julián Gómez', email: 'julian.dev@tech.co', status: 'active', riskScore: 5, lastActivity: 'Hace 5 horas', lastAction: 'Consulta de saldo', avatar: 'https://picsum.photos/seed/u4/100', registeredAt: '12 Ago 2023' },
];

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('Todos');

  const toggleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(u => u.id));
    }
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight">Directorio de Usuarios</h1>
          <p className="text-slate-500 font-medium">Supervisión biométrica y scoring de riesgo automatizado.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500">search</span>
             <input type="text" placeholder="Filtrar por email, ID o nombre..." className="h-12 w-80 bg-[#1c2127] border border-white/5 rounded-2xl pl-12 pr-6 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>
          <button className="h-12 px-6 bg-primary text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 flex items-center gap-3 active:scale-95 transition-all">
            <span className="material-symbols-outlined">person_add</span>
            Añadir Usuario
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-[#1c2127] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5">
                {['Todos', 'Activos', 'En Revisión', 'Bajo Riesgo'].map((f) => (
                  <button 
                    key={f} 
                    onClick={() => setActiveFilter(f)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                 <button className="size-10 rounded-xl bg-slate-900 border border-white/5 text-slate-500 flex items-center justify-center hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">filter_list</span>
                 </button>
                 <button className="size-10 rounded-xl bg-slate-900 border border-white/5 text-slate-500 flex items-center justify-center hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">file_download</span>
                 </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-8 py-5 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedUserIds.length === users.length}
                        onChange={toggleSelectAll}
                        className="size-5 rounded-lg border-white/10 bg-slate-800 text-primary focus:ring-primary cursor-pointer" 
                      />
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identidad</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Índice de Riesgo (IA)</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Última Actividad</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      onClick={() => toggleSelectUser(user.id)}
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer group ${selectedUserIds.includes(user.id) ? 'bg-primary/[0.03]' : ''}`}
                    >
                      <td className="px-8 py-6" onClick={e => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                          className="size-5 rounded-lg border-white/10 bg-slate-800 text-primary focus:ring-primary cursor-pointer" 
                        />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-2xl bg-cover border-2 border-white/5 shadow-inner" style={{ backgroundImage: `url('${user.avatar}')` }}></div>
                          <div>
                            <p className="text-sm font-black text-white">{user.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          user.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          user.status === 'review' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {user.status === 'active' ? 'Verificado' : user.status === 'review' ? 'Bajo Análisis' : 'Suspendido'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 w-32 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                            <div className={`h-full rounded-full transition-all duration-1000 shadow-lg ${user.riskScore > 70 ? 'bg-red-500 shadow-red-500/20' : user.riskScore > 30 ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`} style={{ width: `${user.riskScore}%` }}></div>
                          </div>
                          <span className={`text-[10px] font-black ${user.riskScore > 70 ? 'text-red-500' : 'text-slate-500'}`}>{user.riskScore}/100</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-xs font-bold text-slate-300">{user.lastActivity}</p>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">{user.lastAction}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="size-10 rounded-xl text-slate-600 hover:text-white hover:bg-slate-800 transition-all">
                            <span className="material-symbols-outlined">more_vert</span>
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[420px] space-y-8">
           <div className="bg-[#1c2127] rounded-[2.5rem] border border-red-500/20 p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full"></div>
             <div className="flex items-center gap-4 mb-8">
                <div className="size-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                   <span className="material-symbols-outlined text-3xl icon-fill">psychology</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Enfoque de IA: {users[1].name}</h3>
                  <span className="text-[10px] font-black bg-red-500 text-white px-3 py-1 rounded-full uppercase">Alerta Crítica</span>
                </div>
             </div>

             <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Análisis de Comportamiento</span>
                      <span className="text-red-500">Prob. Fraude: 89%</span>
                   </div>
                   <p className="text-xs text-slate-300 font-medium leading-relaxed">Detección de 5 intentos de login fallidos desde 3 IPs distintas en menos de 10 minutos. Origen: VPN Desconocida.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <button className="h-14 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Reportar</button>
                   <button className="h-14 bg-red-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all">Congelar Cuenta</button>
                </div>
             </div>
           </div>

           <div className="bg-[#1c2127] rounded-[2.5rem] border border-white/5 p-8 space-y-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Estadísticas de Cohorte</h3>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Retención (30d)</p>
                    <p className="text-2xl font-black text-white">84.2%</p>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                       <div className="h-full bg-emerald-500 w-[84%]"></div>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LTV Promedio</p>
                    <p className="text-2xl font-black text-white">$242.00</p>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                       <div className="h-full bg-primary w-[65%]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
