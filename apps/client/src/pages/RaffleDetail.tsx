
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { backend } from '../backend';
import { Raffle } from '../types';

const RaffleDetail: React.FC = () => {
  const { id } = useParams();
  const [raffle, setRaffle] = useState<Raffle | undefined>();
  const [ticketCount, setTicketCount] = useState(1);
  const [lastAction, setLastAction] = useState<'add' | 'sub' | null>(null);

  useEffect(() => {
    const raffles = backend.getRaffles();
    const found = raffles.find(r => r.id === id);
    setRaffle(found);
  }, [id]);

  if (!raffle) {
      return <div className="text-white text-center py-20">Cargando Sorteo...</div>;
  }

  const total = ticketCount * raffle.price;

  const handleAdjustCount = (amount: number) => {
    const newCount = Math.max(1, ticketCount + amount);
    if (newCount !== ticketCount) {
      setLastAction(amount > 0 ? 'add' : 'sub');
      setTicketCount(newCount);
      setTimeout(() => setLastAction(null), 400);
    }
  };

  const quickPacks = [
    { label: '+5', val: 5 },
    { label: '+10', val: 10 },
    { label: '+25', val: 25 },
    { label: '+50', val: 50 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 lg:px-40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Quantity Selection */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white font-display">¿Cuántas oportunidades quieres?</h2>
            <p className="text-slate-500 font-medium">Tus números serán asignados aleatoriamente por nuestro sistema de seguridad al confirmar el pago.</p>
          </div>

          <div className="bg-[#1c2127] rounded-[2.5rem] p-12 border border-slate-800 shadow-2xl flex flex-col items-center justify-center space-y-12 relative overflow-hidden group">
            {/* Visual Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            
            {/* Interactive Ticket Visual */}
            <div className={`relative transition-all duration-500 ${lastAction === 'add' ? 'scale-110' : ''}`}>
              <div className="size-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] border-2 border-primary/20 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(244,140,37,0.1)]">
                <span className={`material-symbols-outlined text-7xl text-primary mb-2 transition-transform duration-300 ${lastAction ? 'rotate-12' : ''}`}>local_activity</span>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Boletos</p>
                  <p className={`text-5xl font-black text-white font-mono transition-all duration-300 ${lastAction === 'add' ? 'text-primary scale-125' : ''}`}>
                    {ticketCount}
                  </p>
                </div>
              </div>
              
              {/* Particle effect simulation */}
              {lastAction === 'add' && (
                <div className="absolute -top-4 -right-4 size-12 bg-primary/20 rounded-full animate-ping"></div>
              )}
            </div>

            {/* Main Selector Controls */}
            <div className="flex items-center gap-8">
              <button 
                onClick={() => handleAdjustCount(-1)}
                className="size-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-primary/50 transition-all active:scale-90"
              >
                <span className="material-symbols-outlined text-3xl">remove</span>
              </button>
              
              <div className="text-center min-w-[80px]">
                <p className="text-sm font-black text-white">CANTIDAD</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Seleccionada</p>
              </div>

              <button 
                onClick={() => handleAdjustCount(1)}
                className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-orange-500/20 hover:bg-primary-dark transition-all active:scale-90"
              >
                <span className="material-symbols-outlined text-3xl font-bold">add</span>
              </button>
            </div>

            {/* Quick Select Packs */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
              {quickPacks.map((pack) => (
                <button
                  key={pack.label}
                  onClick={() => handleAdjustCount(pack.val)}
                  className="py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all active:scale-95"
                >
                  {pack.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 flex items-center justify-between">
            <div className="flex gap-4 items-center">
               <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                 <span className="material-symbols-outlined text-primary text-2xl">receipt_long</span>
               </div>
               <div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Inversión Total</p>
                 <div className="flex items-baseline gap-2">
                   <p className="text-2xl font-black text-white">Bs. {(total * 45).toFixed(2)}</p>
                   <p className="text-xs font-bold text-slate-500">($ {total.toFixed(2)})</p>
                 </div>
               </div>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-tighter">Asignación Inmediata</span>
            </div>
          </div>
        </div>

        {/* Right: Info & CTA */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 space-y-6">
            <div className="bg-[#1c2127] rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl space-y-8">
              <div className="flex justify-between items-start">
                 <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full border border-primary/20 tracking-widest uppercase">{raffle.category}</span>
                 <div className="flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span className="text-[10px] font-bold">98 Personas viendo ahora</span>
                 </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black text-white leading-tight font-display">{raffle.name}</h1>
                <p className="text-slate-400 text-sm leading-relaxed">{raffle.description}</p>
              </div>

              {/* Multi-Prize List Display */}
              {raffle.type === 'multi' && raffle.prizes && (
                  <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest border-b border-slate-800 pb-2">Plan de Premios</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                          {raffle.prizes.map((prize) => (
                              <div key={prize.rank} className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                                  <div className={`size-8 rounded-lg flex items-center justify-center font-black text-xs ${prize.rank === 1 ? 'bg-yellow-500 text-black' : prize.rank === 2 ? 'bg-slate-400 text-black' : 'bg-slate-800 text-slate-400'}`}>
                                      {prize.rank}º
                                  </div>
                                  <span className={`text-xs font-bold ${prize.rank <= 2 ? 'text-white' : 'text-slate-400'}`}>{prize.label}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              <div className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Beneficios de Compra a Ciegas</h4>
                 <ul className="space-y-3">
                    {[
                      { icon: 'shuffle', text: 'Números aleatorios certificados' },
                      { icon: 'lock', text: 'Privacidad total de participación' },
                      { icon: 'verified', text: 'Validación bancaria inmediata' }
                    ].map((feat, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-300">
                        <span className="material-symbols-outlined text-primary text-lg">{feat.icon}</span>
                        {feat.text}
                      </li>
                    ))}
                 </ul>
              </div>

              <Link 
                to="/checkout"
                state={{ ticketCount, raffleId: raffle.id, raffleName: raffle.name }}
                className="flex items-center justify-center gap-3 w-full h-16 rounded-full bg-primary hover:bg-primary-dark text-white font-black text-lg transition-all shadow-2xl shadow-orange-500/30 active:scale-95 group"
              >
                Comprar {ticketCount} Tickets
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>

              <div className="flex items-center justify-center gap-6 pt-4">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Valor</p>
                    <p className="text-xl font-black text-white">${raffle.price.toFixed(2)}</p>
                 </div>
                 <div className="h-8 w-px bg-slate-800"></div>
                 <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cierre</p>
                    <p className="text-xl font-black text-primary">{new Date(raffle.endDate).toLocaleDateString()}</p>
                 </div>
              </div>
            </div>

            {/* Security Note */}
            <p className="px-6 text-center text-[10px] text-slate-600 font-medium leading-relaxed">
              Al hacer clic en comprar, aceptas nuestros términos de servicio. El proceso de asignación de números es auditado por IA para asegurar que no haya duplicados.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default RaffleDetail;
