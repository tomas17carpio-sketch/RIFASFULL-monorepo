
import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { backend } from '../backend';
import { Transaction, Raffle } from '../types';

const MyRaffles: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  useEffect(() => {
    setTransactions(backend.getTransactions());
    setRaffles(backend.getRaffles());
  }, []);

  // Agrupamos los tickets comprados por cada rifa
  const myParticipations = useMemo(() => {
    const grouped = transactions.reduce((acc, tx) => {
      const raffleId = tx.raffleId || 'unknown';
      if (!acc[raffleId]) {
        acc[raffleId] = {
          raffleId: raffleId,
          tickets: [],
          date: tx.date,
          status: 'Activo'
        };
      }
      acc[raffleId].tickets.push(...tx.tickets);
      return acc;
    }, {} as Record<string, { raffleId: string, tickets: string[], date: string, status: string }>);

    // Cast Object.values to explicit type to avoid 'unknown' type errors in some TS environments
    return (Object.values(grouped) as { raffleId: string, tickets: string[], date: string, status: string }[]).map(group => {
      const raffleInfo = raffles.find(r => r.id === group.raffleId);
      return {
        ...group,
        name: raffleInfo?.name || 'Sorteo Desconocido',
        imageUrl: raffleInfo?.imageUrl || 'https://images.unsplash.com/photo-1553481187-be93c21490a9?auto=format&fit=crop&q=80&w=400',
        category: raffleInfo?.category || 'General',
        winner: raffleInfo?.status === 'completed' 
          ? (raffleInfo.winningTicket && group.tickets.includes(raffleInfo.winningTicket) 
              ? `¡GANASTE! (Ticket #${raffleInfo.winningTicket})` 
              : `Finalizado - Ganador: #${raffleInfo.winningTicket}`)
          : null,
        status: raffleInfo?.status === 'completed' ? 'Finalizado' : 'Activo'
      };
    });
  }, [transactions, raffles]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:px-40 space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">confirmation_number</span> Registro Oficial
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Mis Participaciones</h1>
          <p className="text-slate-500 max-w-xl">Gestiona tus boletos digitales y sigue de cerca tus premios favoritos. Cada boleto es una oportunidad real vinculada a tu identidad.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1c2127] border border-slate-800 rounded-2xl px-6 py-3 flex flex-col items-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Boletos Totales</p>
            <p className="text-2xl font-black text-white">{myParticipations.reduce((acc, curr) => acc + curr.tickets.length, 0)}</p>
          </div>
          <div className="bg-[#1c2127] border border-slate-800 rounded-2xl px-6 py-3 flex flex-col items-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sorteos Activos</p>
            <p className="text-2xl font-black text-primary">{myParticipations.filter(p => p.status === 'Activo').length}</p>
          </div>
        </div>
      </div>

      {myParticipations.length > 0 ? (
        <div className="space-y-10">
          {myParticipations.map((item) => (
            <div key={item.raffleId} className="bg-[#1c2127] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl group hover:border-primary/20 transition-all duration-500">
              <div className="flex flex-col lg:flex-row">
                <Link to={`/raffle/${item.raffleId}`} className="lg:w-1/3 relative overflow-hidden h-64 lg:h-auto block cursor-pointer">
                  <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c2127] via-transparent to-transparent lg:bg-gradient-to-r" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-primary/90 text-white text-[10px] font-black px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                      {item.category.toUpperCase()}
                    </span>
                  </div>
                </Link>

                <div className="flex-1 p-8 lg:p-12 space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="space-y-1">
                      <Link to={`/raffle/${item.raffleId}`} className="hover:text-primary transition-colors">
                        <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">{item.name}</h3>
                      </Link>
                      <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <span>Última Compra: {item.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span> Sorteo: 20:00 VET
                        </span>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 shadow-sm ${
                      item.status === 'Activo' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse' 
                      : 'bg-slate-800/50 text-slate-500 border-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tus Boletos Digitales</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                      {item.tickets.map((num, idx) => {
                        const isWinningTicket = item.winner?.includes(num);
                        return (
                          <div 
                            key={`${num}-${idx}`} 
                            className={`relative overflow-hidden aspect-[4/3] rounded-2xl border-2 flex flex-col items-center justify-center transition-all group/ticket cursor-default ${
                              isWinningTicket 
                              ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-105' 
                              : 'bg-slate-900/50 border-slate-800 hover:border-primary/50'
                            }`}
                          >
                            <div className="absolute top-1/2 -left-2 size-4 bg-[#1c2127] rounded-full -translate-y-1/2" />
                            <div className="absolute top-1/2 -right-2 size-4 bg-[#1c2127] rounded-full -translate-y-1/2" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                            
                            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isWinningTicket ? 'text-white/80' : 'text-slate-600'}`}>TICKET</p>
                            <p className={`text-2xl font-black font-mono leading-none ${isWinningTicket ? 'text-white' : 'text-primary'}`}>
                              {num}
                            </p>
                            {isWinningTicket && (
                              <div className="absolute top-2 right-2">
                                <span className="material-symbols-outlined text-white text-sm icon-fill">stars</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {item.winner && item.winner.includes("GANASTE") && (
                    <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[1.5rem] flex items-center justify-between animate-in zoom-in-95">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <span className="material-symbols-outlined text-xl icon-fill">emoji_events</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">¡FELICIDADES!</p>
                          <p className="text-white font-bold">{item.winner}</p>
                        </div>
                      </div>
                      <button className="h-10 px-5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-colors">
                        Reclamar Premio
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                    <Link 
                      to={`/raffle/${item.raffleId}`} 
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all group/link"
                    >
                      <span className="material-symbols-outlined text-base">info</span>
                      Ver bases del sorteo
                    </Link>
                    <button className="text-slate-600 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-lg">share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-8 bg-slate-900/50 rounded-[4rem] border-2 border-dashed border-slate-800">
          <div className="size-32 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-slate-700 shadow-inner">
            <span className="material-symbols-outlined text-6xl">confirmation_number</span>
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-white">¡Aún no tienes boletos!</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">Empieza a participar hoy mismo. Tus números aparecerán aquí automáticamente tras validar tu pago.</p>
          </div>
          <Link 
            to="/" 
            className="inline-flex h-16 px-12 bg-primary hover:bg-primary-dark text-white font-black rounded-full items-center transition-all shadow-2xl shadow-orange-500/30 hover:-translate-y-1 active:scale-95"
          >
            Explorar Sorteos Disponibles
            <span className="material-symbols-outlined ml-3">arrow_forward</span>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
        {[
          { icon: 'verified', title: 'Boletos Auténticos', desc: 'Cada número es único y está registrado en nuestra base de datos segura.' },
          { icon: 'account_balance_wallet', title: 'Pagos Transparentes', desc: 'Historial completo de tus transacciones y reportes de pago.' },
          { icon: 'support_agent', title: 'Soporte 24/7', desc: '¿Dudas con tus números? Nuestro asistente IA está listo para ayudarte.' }
        ].map((badge, i) => (
          <div key={i} className="flex gap-4">
            <span className="material-symbols-outlined text-primary text-3xl shrink-0">{badge.icon}</span>
            <div>
              <h5 className="text-white font-bold text-sm">{badge.title}</h5>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRaffles;
