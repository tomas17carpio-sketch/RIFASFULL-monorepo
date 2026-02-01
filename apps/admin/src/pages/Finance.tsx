import React, { useState } from 'react';
import { useNotifications } from '../App';

const Finance = () => {
    const { addNotification } = useNotifications();
    
    // UI states
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [verificationModalOpen, setVerificationModalOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<any>(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Simulated Transaction Data
    const [transactions, setTransactions] = useState([
        { id: 'TX-09283712', bank: 'Banesco', user: 'Carlos Ruiz', amount: 1450.00, currency: 'VES', status: 'Revisión', date: '2023-10-25', phone: '0414-1234567', type: 'Pago Móvil' },
        { id: 'TX-09283715', bank: 'Mercantil', user: 'Ana García', amount: 50.00, currency: 'USD', status: 'Aprobado', date: '2023-10-24', phone: '0412-9876543', type: 'Zelle' },
        { id: 'TX-09283718', bank: 'Provincial', user: 'Miguel Ángel', amount: 3200.00, currency: 'VES', status: 'Aprobado', date: '2023-10-23', phone: '0424-5556677', type: 'Pago Móvil' },
        { id: 'TX-09283722', bank: 'Pago Móvil', user: 'Roberto Gomez', amount: 15.00, currency: 'USD', status: 'Rechazado', date: '2023-10-20', phone: '0416-1112233', type: 'Efectivo' },
        { id: 'TX-09283725', bank: 'Zelle', user: 'Luisa Lane', amount: 100.00, currency: 'USD', status: 'Aprobado', date: '2023-10-18', phone: 'N/A', type: 'Zelle' },
        { id: 'TX-09283730', bank: 'Banesco', user: 'Pedro Pérez', amount: 45.00, currency: 'VES', status: 'Revisión', date: '2023-10-26', phone: '0414-9998877', type: 'Pago Móvil' },
    ]);

    // Filtering logic
    const filteredTransactions = transactions.filter(tx => {
        if (filterStatus === 'verified' && tx.status !== 'Aprobado') return false;
        if (filterStatus === 'pending' && tx.status !== 'Revisión') return false;
        if (filterStatus === 'rejected' && tx.status !== 'Rechazado') return false;
        if (dateRange.start && new Date(tx.date) < new Date(dateRange.start)) return false;
        if (dateRange.end && new Date(tx.date) > new Date(dateRange.end)) return false;
        return true;
    });

    const handleApplyDateFilter = () => setIsCalendarOpen(false);
    const handleClearDateFilter = () => {
        setDateRange({ start: '', end: '' });
        setIsCalendarOpen(false);
    };

    const handleOpenVerification = (tx: any) => {
        setSelectedTx(tx);
        setVerificationModalOpen(true);
    };

    const handleProcessPayment = (decision: 'approve' | 'reject') => {
        if (!selectedTx) return;
        const newStatus = decision === 'approve' ? 'Aprobado' : 'Rechazado';
        
        setTransactions(prev => prev.map(tx => 
            tx.id === selectedTx.id ? { ...tx, status: newStatus } : tx
        ));

        if (decision === 'approve') {
            addNotification('Pago Verificado', `ID ${selectedTx.id} aprobado con éxito.`, 'success');
        } else {
            addNotification('Pago Rechazado', `El pago ${selectedTx.id} ha sido denegado.`, 'warning');
        }
        setVerificationModalOpen(false);
        setSelectedTx(null);
    };

    const getStatusBadge = (status: string) => {
        const baseClass = "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border";
        switch (status) {
            case 'Aprobado': return <span className={`${baseClass} bg-emerald-500/10 text-emerald-600 border-emerald-500/20`}>VERIFICADO</span>;
            case 'Revisión': return <span className={`${baseClass} bg-amber-500/10 text-amber-600 border-amber-500/20`}>EN REVISIÓN</span>;
            case 'Rechazado': return <span className={`${baseClass} bg-rose-500/10 text-rose-600 border-rose-500/20`}>RECHAZADO</span>;
            default: return null;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa] dark:bg-[#101922] p-4 md:p-10 text-slate-900 dark:text-white" onClick={() => isCalendarOpen && setIsCalendarOpen(false)}>
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Finanzas & Conciliación</h1>
                        <p className="text-slate-500 dark:text-[#9dabb9] text-sm md:text-base font-medium">Monitoreo de flujos de caja y validación de transacciones bimoneda.</p>
                    </div>
                </div>

                {/* Filters & Actions Bar */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-card-dark p-2 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-wrap gap-2 p-1">
                        {[
                            { id: 'all', label: 'Todos', icon: 'list' },
                            { id: 'pending', label: 'Por Revisar', icon: 'pending_actions' },
                            { id: 'verified', label: 'Verificados', icon: 'check_circle' },
                            { id: 'rejected', label: 'Rechazados', icon: 'cancel' }
                        ].map(btn => (
                            <button 
                                key={btn.id}
                                onClick={() => setFilterStatus(btn.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${filterStatus === btn.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-auto" onClick={(e) => e.stopPropagation()}>
                        <button 
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            className="w-full lg:w-auto flex items-center justify-between gap-4 px-6 py-3 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                                {dateRange.start ? `${dateRange.start} — ${dateRange.end || 'Hoy'}` : 'Rango de Fecha'}
                            </div>
                            <span className="material-symbols-outlined">expand_more</span>
                        </button>
                        
                        {isCalendarOpen && (
                            <div className="absolute right-0 top-full mt-3 w-full md:w-80 bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-[60] animate-in zoom-in-95 duration-200">
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Fecha Inicio</label>
                                        <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-transparent text-sm font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Fecha Fin</label>
                                        <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-transparent text-sm font-bold" />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={handleClearDateFilter} className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Limpiar</button>
                                        <button onClick={handleApplyDateFilter} className="flex-[2] h-12 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20">Aplicar Filtro</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile: Card View */}
                <div className="md:hidden space-y-4">
                    {filteredTransactions.map((tx) => (
                        <div key={tx.id} className="bg-white dark:bg-card-dark rounded-[2.5rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm animate-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${tx.bank === 'Zelle' ? 'bg-indigo-600' : 'bg-primary'}`}>
                                        <span className="material-symbols-outlined text-2xl">{tx.bank === 'Zelle' ? 'account_balance_wallet' : 'account_balance'}</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">{tx.user}</p>
                                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{tx.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-black ${tx.currency === 'USD' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                        {tx.currency === 'USD' ? '$' : 'Bs'} {tx.amount.toFixed(2)}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{tx.date}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                {getStatusBadge(tx.status)}
                                {tx.status === 'Revisión' && (
                                    <button 
                                        onClick={() => handleOpenVerification(tx)}
                                        className="h-10 px-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">verified</span>
                                        Verificar Pago
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop: Optimized Table */}
                <div className="hidden md:block bg-white dark:bg-card-dark rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Referencia</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Usuario & Origen</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fecha</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Importe</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Estado</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800">
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black font-mono tracking-tight text-slate-900 dark:text-white">{tx.id}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.bank}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                                {tx.user.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm">{tx.user}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{tx.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-slate-500">{tx.date}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`text-sm font-black ${tx.currency === 'USD' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                            {tx.currency === 'USD' ? '$' : 'Bs'} {tx.amount.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {getStatusBadge(tx.status)}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {tx.status === 'Revisión' && (
                                            <button 
                                                onClick={() => handleOpenVerification(tx)}
                                                className="h-10 px-5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.05] transition-transform ml-auto"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">verified</span>
                                                Verificar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTransactions.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <span className="material-symbols-outlined text-7xl text-slate-200 dark:text-slate-800">search_off</span>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron transacciones con los filtros aplicados.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Verification Modal */}
            {verificationModalOpen && selectedTx && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-[#1e293b] rounded-[3rem] shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                        <div className="p-10 border-b dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a] text-center relative">
                            <button onClick={() => setVerificationModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><span className="material-symbols-outlined">close</span></button>
                            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl">payments</span>
                            </div>
                            <h3 className="text-2xl font-black tracking-tight">Validación Forense</h3>
                            <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-2">ID TRANSACCIÓN: {selectedTx.id}</p>
                        </div>
                        
                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Monto Conciliado</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{selectedTx.currency === 'USD' ? '$' : 'Bs'} {selectedTx.amount.toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Método de Pago</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{selectedTx.type}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'Entidad Bancaria', value: selectedTx.bank },
                                    { label: 'Titular / Usuario', value: selectedTx.user },
                                    { label: 'Origen Reportado', value: selectedTx.phone },
                                    { label: 'Fecha de Registro', value: selectedTx.date }
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b dark:border-slate-800 border-slate-100">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{row.label}</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => handleProcessPayment('reject')}
                                    className="flex-1 h-16 rounded-2xl border-2 border-rose-100 dark:border-rose-900/30 text-rose-600 font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-50 transition-colors"
                                >
                                    Denegar
                                </button>
                                <button 
                                    onClick={() => handleProcessPayment('approve')}
                                    className="flex-[2] h-16 rounded-2xl bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined text-[20px]">verified</span>
                                    Validar y Sellar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;