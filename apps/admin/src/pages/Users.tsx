
import React, { useState } from 'react';

const Users = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUserAudit, setSelectedUserAudit] = useState<any>(null);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const itemsPerPage = 8;

    const usersData = [
        {
            id: 1,
            name: "Carlos Ruiz",
            email: "carlos.crypto@tempmail.com",
            status: "Revisión",
            statusColor: "red",
            riskScore: 85,
            lastActivity: "Ahora mismo",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7V1FNOR2V6gHAQ5YXzlkerXJXyHRONU1SPww7DtV1jWIkYAe82T3PQcJkCuFeceBRzFxAIAMC04K7Gt928h-fUMZtiX7OhFma4Lbm5zzl5rEB2FYnn5gpahvCZu1fFldtlDigGyJ8rfXlsf7l3MD_ZOr2lmAkux3EJyoJpvbW79AOypyG0J3FetSJTB4tOnGg2pSt4_sGaF6xVcVMtvHm5fcf2otbc_Cd94G9RRZVbsWzAI9Jsu5a-kce7RCOTpHyX1tFB7qeDdg",
            history: [
                { date: '2023-11-20', action: 'Compra Ticket #4492', raffle: 'Mega Tesla', status: 'Verificado' },
                { date: '2023-11-19', action: 'Intento de Pago Fallido', raffle: 'iPhone 15', status: 'Error' },
                { date: '2023-11-18', action: 'Registro de Cuenta', raffle: 'N/A', status: 'OK' }
            ]
        },
        { id: 2, name: "Ana García", email: "ana.garcia@email.com", status: "Activo", statusColor: "emerald", riskScore: 15, lastActivity: "Hace 2 horas", history: [] },
        { id: 3, name: "Miguel Ángel", email: "miguel.dev@gmail.com", status: "Activo", statusColor: "emerald", riskScore: 5, lastActivity: "Ayer", history: [] },
    ];

    const filteredUsers = usersData.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleOpenUserAudit = (user: any) => {
        setSelectedUserAudit(user);
        setIsAuditOpen(true);
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white pb-32">
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-5xl font-black tracking-tighter">Auditoría de Usuarios</h1>
                        <p className="text-slate-500 dark:text-[#9dabb9] text-xs md:text-base font-medium uppercase tracking-widest">Base de datos de participantes</p>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input 
                            type="text" 
                            placeholder="Buscar usuario o ID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 pl-12 pr-6 rounded-2xl bg-white dark:bg-card-dark border-slate-200 dark:border-slate-800 text-sm focus:ring-primary w-full md:w-80 shadow-sm"
                        />
                    </div>
                </div>

                {/* Mobile: Card View */}
                <div className="md:hidden space-y-4">
                    {currentUsers.map((user) => (
                        <div key={user.id} className="bg-white dark:bg-card-dark rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-black text-sm truncate">{user.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold truncate">{user.email}</p>
                                </div>
                                <button onClick={() => handleOpenUserAudit(user)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">analytics</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${user.status === 'Activo' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{user.status}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Riesgo IA:</p>
                                    <p className={`text-[10px] font-black ${user.riskScore > 60 ? 'text-red-500' : 'text-emerald-500'}`}>{user.riskScore}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop: Optimized Table */}
                <div className="hidden md:block bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Usuario</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Riesgo IA</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400">Estado</th>
                                <th className="p-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Detalles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800">
                            {currentUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${user.riskScore > 60 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${user.riskScore}%` }}></div>
                                            </div>
                                            <span className={`text-xs font-black ${user.riskScore > 60 ? 'text-red-500' : 'text-emerald-500'}`}>{user.riskScore}%</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.status === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button onClick={() => handleOpenUserAudit(user)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors inline-flex items-center justify-center">
                                            <span className="material-symbols-outlined">analytics</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* USER AUDIT DOSSIER MODAL (Full screen on mobile) */}
            {isAuditOpen && selectedUserAudit && (
                <div className="fixed inset-0 z-[150] flex items-center justify-end bg-black/40 backdrop-blur-sm p-0 md:p-4">
                    <div className="h-full w-full max-w-lg bg-white dark:bg-[#1e293b] shadow-2xl p-6 md:p-10 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tight">Dossier del Usuario</h2>
                                <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest">Expediente Central</p>
                            </div>
                            <button onClick={() => setIsAuditOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
                        </div>

                        <div className="space-y-8 flex-1">
                            {/* Perfil */}
                            <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shrink-0">
                                    {selectedUserAudit.name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-lg font-black truncate">{selectedUserAudit.name}</h3>
                                    <p className="text-xs text-slate-500 truncate">{selectedUserAudit.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-[8px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded">VERIFICADO</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actividad */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actividad Reciente</h4>
                                <div className="space-y-3">
                                    {selectedUserAudit.history.length > 0 ? selectedUserAudit.history.map((h: any, i: number) => (
                                        <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#1e293b]">
                                            <div>
                                                <p className="text-xs font-black">{h.action}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{h.raffle} • {h.date}</p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase ${h.status === 'Verificado' ? 'text-emerald-500' : 'text-red-500'}`}>{h.status}</span>
                                        </div>
                                    )) : (
                                        <p className="text-center py-6 text-slate-400 text-xs italic">Sin actividad registrada.</p>
                                    )}
                                </div>
                            </div>

                            {/* Seguridad IA */}
                            <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2">Análisis IA</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    Riesgo actual del <span className="font-black">{selectedUserAudit.riskScore}%</span>. Se recomienda monitoreo de pagos móviles.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button className="flex-1 h-12 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-xs uppercase tracking-widest">Reporte</button>
                            <button className="w-12 h-12 rounded-xl border-2 border-red-100 dark:border-red-900/20 text-red-500 flex items-center justify-center"><span className="material-symbols-outlined">block</span></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
