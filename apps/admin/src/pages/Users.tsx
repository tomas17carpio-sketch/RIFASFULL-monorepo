import React, { useState, useEffect } from 'react';

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
        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white">
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Auditoría de Usuarios</h1>
                        <p className="text-slate-500 dark:text-[#9dabb9] text-sm md:text-base font-medium">Expedientes detallados y monitoreo preventivo IA.</p>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input 
                            type="text" 
                            placeholder="Buscar usuario o ID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 pl-12 pr-6 rounded-2xl bg-white dark:bg-card-dark border-slate-200 dark:border-slate-800 text-sm focus:ring-primary w-full md:w-80"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
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

            {/* USER AUDIT DOSSIER MODAL */}
            {isAuditOpen && selectedUserAudit && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-sm">
                    <div className="h-full w-full max-w-lg bg-white dark:bg-[#1e293b] shadow-2xl p-10 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">Dossier del Usuario</h2>
                                <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-widest">ID: {selectedUserAudit.id}0029X-88</p>
                            </div>
                            <button onClick={() => setIsAuditOpen(false)} className="w-12 h-12 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><span className="material-symbols-outlined">close</span></button>
                        </div>

                        <div className="space-y-8 flex-1 overflow-y-auto pr-2">
                            {/* Perfil */}
                            <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center text-3xl font-black">
                                    {selectedUserAudit.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">{selectedUserAudit.name}</h3>
                                    <p className="text-sm text-slate-500">{selectedUserAudit.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded">VERIFICADO</span>
                                        <span className="text-[10px] font-black bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">WEB</span>
                                    </div>
                                </div>
                            </div>

                            {/* Historial Exhaustivo */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Actividad Independiente</h4>
                                <div className="space-y-3">
                                    {selectedUserAudit.history.length > 0 ? selectedUserAudit.history.map((h: any, i: number) => (
                                        <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                            <div>
                                                <p className="text-xs font-black">{h.action}</p>
                                                <p className="text-[10px] text-slate-500 font-bold">{h.raffle} • {h.date}</p>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${h.status === 'Verificado' ? 'text-emerald-500' : 'text-red-500'}`}>{h.status}</span>
                                        </div>
                                    )) : (
                                        <p className="text-center py-10 text-slate-400 text-sm italic">Sin actividad registrada en este periodo.</p>
                                    )}
                                </div>
                            </div>

                            {/* Seguridad IA */}
                            <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20">
                                <h4 className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">Análisis Forense IA</h4>
                                <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed font-medium">
                                    El usuario presenta un nivel de riesgo del <span className="font-black">{selectedUserAudit.riskScore}%</span>. Se recomienda monitoreo manual de sus transacciones de pago móvil por patrones inusuales de IP.
                                </p>
                            </div>
                        </div>

                        <div className="pt-10 flex gap-4">
                            <button className="flex-1 h-14 rounded-2xl bg-slate-900 text-white font-black text-sm">REPORTE COMPLETO</button>
                            <button className="h-14 w-14 rounded-2xl border-2 border-red-200 dark:border-red-900/30 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors">
                                <span className="material-symbols-outlined">block</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;