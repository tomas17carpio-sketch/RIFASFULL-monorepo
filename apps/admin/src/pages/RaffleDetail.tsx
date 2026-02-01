import React from 'react';
import { Link } from 'react-router-dom';
import { useWinners } from '../App';

const RaffleDetail = () => {
    const { recentWinners } = useWinners();

    const getWinnerBadge = (raffleName: string) => {
        if (raffleName.includes("(1er Lugar)")) {
            return <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-yellow-200 uppercase">1er Premio 🏆</span>;
        }
        if (raffleName.includes("(2do Lugar)")) {
            return <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-200 uppercase">2do Premio 🥈</span>;
        }
        if (raffleName.includes("(Premio Consuelo)")) {
            return <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-100 uppercase">Consuelo 🎁</span>;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0f172a] font-display text-slate-900 dark:text-white">
            {/* Nav */}
            <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] px-4 py-3 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-3xl">local_activity</span>
                    <h2 className="text-lg font-bold">Rifas Venezuela</h2>
                </div>
                <div className="flex gap-4">
                    <Link to="/" className="text-sm text-slate-500 dark:text-slate-300 hover:text-primary dark:hover:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        Admin Panel
                    </Link>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto p-4 lg:p-10 space-y-12">
                
                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        {/* Main Image */}
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 relative group border border-slate-200 dark:border-slate-700">
                             <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">¡Nuevo!</span>
                             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                                 <span className="material-symbols-outlined text-9xl text-slate-300 dark:text-slate-600">smartphone</span>
                             </div>
                        </div>
                        
                        <div className="flex flex-col gap-6 bg-white dark:bg-[#1e293b] rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold">iPhone 15 Pro Max - 256GB Titanio Natural</h3>
                            <p className="text-slate-500 dark:text-slate-300">Participa por la oportunidad de ganar el smartphone más avanzado de Apple hasta la fecha.</p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-500 dark:text-slate-400 marker:text-primary">
                                <li>Pantalla: Super Retina XDR 6.7"</li>
                                <li>Almacenamiento: 256GB</li>
                                <li>Condición: Nuevo, sellado</li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-20 flex flex-col gap-6">
                            <div className="flex flex-col gap-6 bg-white dark:bg-[#1e293b] rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-primary font-bold text-xs uppercase bg-primary/10 px-3 py-1 rounded-full">Sorteo #1492</span>
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                        <span className="material-symbols-outlined text-[16px]">fiber_manual_record</span>
                                        <span className="text-xs font-bold uppercase">Activo</span>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-black">iPhone 15 Pro Max</h1>
                                
                                <div className="grid grid-cols-4 gap-2">
                                    {['03 Días', '12 Hrs', '45 Min', '10 Seg'].map((t, i) => (
                                        <div key={i} className="flex flex-col items-center p-2 bg-slate-50 dark:bg-[#0f172a] rounded-xl border border-slate-200 dark:border-slate-700">
                                            <span className="text-lg font-black text-slate-900 dark:text-white">{t.split(' ')[0]}</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500">{t.split(' ')[1]}</span>
                                        </div>
                                    ))}
                                </div>
                                <hr className="border-slate-200 dark:border-slate-700" />
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-500 dark:text-slate-400">Precio por boleto</span>
                                        <span className="text-4xl font-black text-slate-900 dark:text-white">$5.00</span>
                                    </div>
                                </div>
                                <button className="w-full h-14 bg-primary text-white dark:text-[#101922] text-lg font-bold rounded-full hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/20">
                                    Seleccionar Boletos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Winners Section */}
                <div className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col gap-2 items-center text-center">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm">Salón de la Fama</span>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Últimos Ganadores</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-lg">Felicidades a todos los afortunados ganadores. ¡La transparencia es nuestra prioridad!</p>
                    </div>

                    {recentWinners.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {recentWinners.map((winner) => (
                                <div key={winner.id} className="bg-white dark:bg-[#1e293b] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg group hover:transform hover:scale-[1.02] transition-all duration-300">
                                    <div className="h-28 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url("${winner.prizeImage}")` }}></div>
                                        <div className="relative z-10 flex flex-col items-center">
                                            {getWinnerBadge(winner.raffleName)}
                                        </div>
                                    </div>
                                    <div className="p-6 text-center -mt-8 relative z-10">
                                        <div className="w-16 h-16 mx-auto rounded-full border-4 border-white dark:border-[#1e293b] shadow-md bg-slate-200 dark:bg-[#0f172a] overflow-hidden flex items-center justify-center">
                                            {winner.userAvatar ? (
                                                <img src={winner.userAvatar} alt={winner.userName} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold text-slate-400">{winner.userName.charAt(0)}</span>
                                            )}
                                        </div>
                                        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{winner.userName}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sorteo: <span className="font-medium">{winner.raffleName.replace(/\(.*?\)/g, "").trim()}</span></p>
                                        
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="flex flex-col bg-slate-50 dark:bg-[#0f172a] p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 uppercase font-bold">Ticket</span>
                                                <span className="text-sm font-mono font-black text-primary">#{winner.ticketNumber}</span>
                                            </div>
                                            <div className="flex flex-col bg-slate-50 dark:bg-[#0f172a] p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <span className="text-[10px] text-slate-400 uppercase font-bold">Fecha</span>
                                                <span className="text-sm font-bold truncate">{winner.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 dark:bg-[#1e293b]/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">emoji_events</span>
                            <p className="text-slate-500">Aún no hay ganadores registrados.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RaffleDetail;