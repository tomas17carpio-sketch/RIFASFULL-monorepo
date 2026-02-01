import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../App';

const Dashboard = () => {
    const { notifications, unreadCount, markAllAsRead, markAsRead, clearNotifications } = useNotifications();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBellClick = () => {
        setIsNotifOpen(!isNotifOpen);
    };

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto h-full bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white font-display">
            {/* Header - Simplified for Mobile App Look */}
            <header className="sticky top-0 z-30 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-[#283039] px-4 md:px-6 py-4 md:py-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-slate-900 dark:text-white text-xl md:text-3xl font-black leading-tight tracking-tight">Vista General</h1>
                        <p className="text-slate-500 dark:text-[#9dabb9] text-xs md:text-sm font-normal">Bienvenido de nuevo, Administrador</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto relative" ref={dropdownRef}>
                        {/* Bell Button */}
                        <button 
                            onClick={handleBellClick}
                            className={`flex items-center justify-center w-10 h-10 rounded-full md:rounded-lg bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-400 hover:text-primary transition-colors relative shrink-0 ${isNotifOpen ? 'ring-2 ring-primary/20' : ''}`}
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-white dark:bg-[#1c252e] rounded-xl shadow-2xl border border-slate-200 dark:border-border-dark overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                <div className="p-4 border-b border-slate-100 dark:border-border-dark flex items-center justify-between bg-slate-50 dark:bg-[#232d38]">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Notificaciones</h3>
                                    {notifications.length > 0 && (
                                        <button 
                                            onClick={markAllAsRead}
                                            className="text-xs font-medium text-primary hover:text-blue-600 transition-colors"
                                        >
                                            Marcar leídas
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[350px] overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center flex flex-col items-center text-slate-400 gap-2">
                                            <span className="material-symbols-outlined text-4xl opacity-50">notifications_off</span>
                                            <p className="text-sm">No hay notificaciones</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 dark:divide-border-dark">
                                            {notifications.map((notif) => (
                                                <div 
                                                    key={notif.id} 
                                                    onClick={() => markAsRead(notif.id)}
                                                    className={`p-4 hover:bg-slate-50 dark:hover:bg-[#232d38] transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                                >
                                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.read ? 'bg-primary' : 'bg-transparent'}`}></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className={`text-sm ${!notif.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                                                                {notif.title}
                                                            </h4>
                                                            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.timestamp}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-[#9dabb9] line-clamp-2">{notif.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <div className="p-3 border-t border-slate-100 dark:border-border-dark bg-slate-50 dark:bg-[#232d38] text-center">
                                        <button onClick={clearNotifications} className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">
                                            Limpiar todo
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Create Raffle Button */}
                        <button className="flex-1 md:flex-none flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-full md:rounded-lg h-10 px-4 md:px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            <span className="truncate">Nueva Rifa</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6 pb-20">
                {/* Stats Grid - 2 Cols on mobile for density */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {[
                        { title: 'Rifas Activas', value: '12', trend: '+2%', icon: 'confirmation_number', color: 'primary', trendColor: 'emerald' },
                        { title: 'Ingresos', value: '$124k', trend: '+15%', icon: 'payments', color: 'green', trendColor: 'emerald' },
                        { title: 'Usuarios', value: '3.4k', trend: '+5%', icon: 'groups', color: 'purple', trendColor: 'emerald' },
                        { title: 'Verificar', value: '24', sub: 'pend.', trend: '-10%', icon: 'verified_user', color: 'orange', trendColor: 'red' }
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col gap-2 md:gap-3 rounded-2xl p-4 bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-border-dark">
                            <div className="flex items-center justify-between">
                                <span className={`material-symbols-outlined text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'} bg-${stat.color === 'primary' ? 'primary' : stat.color}-100 dark:bg-opacity-20 p-1.5 rounded-lg text-lg md:text-xl`}>{stat.icon}</span>
                                <p className={`text-${stat.trendColor}-600 dark:text-${stat.trendColor}-400 text-[10px] md:text-xs font-bold flex items-center gap-0.5`}>
                                    <span className="material-symbols-outlined text-[12px] md:text-sm">{stat.trendColor === 'red' ? 'trending_down' : 'trending_up'}</span>
                                    {stat.trend}
                                </p>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold tracking-tight">
                                    {stat.value} 
                                </p>
                                <p className="text-slate-500 dark:text-[#9dabb9] text-xs font-medium truncate">{stat.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="rounded-2xl bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-border-dark p-4 md:p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium">Tendencia de Ingresos</p>
                                <h3 className="text-slate-900 dark:text-white text-2xl font-bold mt-1">$12,450</h3>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                12.5%
                            </div>
                        </div>
                        <div className="relative w-full aspect-[2/1] mt-auto">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 478 150">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#137fec" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#137fec" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z" fill="url(#chartGradient)"></path>
                                <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" fill="none" stroke="#137fec" strokeLinecap="round" strokeWidth="3"></path>
                            </svg>
                        </div>
                        <div className="flex justify-between mt-4 border-t border-slate-100 dark:border-border-dark pt-4 text-xs text-slate-400 font-medium">
                            <span>Sem 1</span><span>Sem 2</span><span>Sem 3</span><span>Sem 4</span>
                        </div>
                    </div>
                    {/* Sales Chart */}
                    <div className="rounded-2xl bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-border-dark p-4 md:p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium">Ventas por Rifa</p>
                                <h3 className="text-slate-900 dark:text-white text-2xl font-bold mt-1">850 tickets</h3>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-bold">
                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                5.2%
                            </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-4 px-2 min-h-[150px]">
                            {['A', 'B', 'C', 'D'].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                    <div className="w-full bg-slate-100 dark:bg-surface-dark rounded-t-lg relative h-32 group-hover:bg-primary/10 transition-colors overflow-hidden">
                                        <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-300 group-hover:opacity-90" style={{ height: `${[60, 25, 85, 45][i]}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Rifa {item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="rounded-2xl bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-border-dark overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-slate-100 dark:border-border-dark flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <span className="material-symbols-outlined">shield_with_heart</span>
                            </div>
                            <div>
                                <h2 className="text-slate-900 dark:text-white text-base md:text-lg font-bold leading-tight">Seguridad IA</h2>
                                <p className="text-slate-500 dark:text-[#9dabb9] text-[10px] md:text-xs mt-0.5">Monitoreo activo</p>
                            </div>
                        </div>
                        <button className="text-xs md:text-sm font-bold text-primary hover:text-blue-700 flex items-center gap-1">
                            Ver todo
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-border-dark">
                        {/* Alerts */}
                        <div className="p-4 hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                            <div className="flex items-start gap-3 w-full">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                                        <span className="material-symbols-outlined">gpp_bad</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">CRÍTICO</span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                                            <span className="material-symbols-outlined text-[10px]">auto_awesome</span> IA
                                        </span>
                                    </div>
                                    <p className="text-slate-900 dark:text-white text-sm font-bold truncate">IP sospechosa en #9921</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1">Patrón de acceso inusual. Bloqueado.</p>
                                </div>
                            </div>
                            <button className="w-full md:w-auto px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-border-dark text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-dark">Revisar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;