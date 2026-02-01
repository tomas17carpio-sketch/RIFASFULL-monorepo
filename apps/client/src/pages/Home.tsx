
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Raffle } from '../types';
import { backend } from '../backend';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [activeFilter, setActiveFilter] = useState('todas');

  useEffect(() => {
    setRaffles(backend.getRaffles());
  }, []);

  const filteredRaffles = useMemo(() => {
    if (activeFilter === 'todas') return raffles;
    if (activeFilter === 'especial') return raffles.filter(r => r.type === 'multi');
    return raffles.filter(r => r.category.toLowerCase() === activeFilter);
  }, [activeFilter, raffles]);

  return (
    <div className="flex flex-col gap-12 py-10 px-6 md:px-20 lg:px-40 max-w-[1440px] mx-auto">
      {/* Hero */}
      <section className="relative h-[450px] rounded-[3rem] overflow-hidden bg-slate-900 border border-white/5 flex items-center px-12 group cursor-pointer" onClick={() => navigate('/raffle/3')}>
        <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
        
        <div className="relative z-10 space-y-6 max-w-2xl">
          <span className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest animate-pulse">Sorteo Especial de Fin de Año</span>
          <h1 className="text-6xl font-black text-white leading-tight">Gana un Toyota Corolla 0km</h1>
          <p className="text-slate-400 text-lg">Y más de 12 premios adicionales en nuestra rifa más grande hasta la fecha.</p>
          <button className="h-16 px-10 bg-primary text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:scale-105 transition-all">Participar Ahora</button>
        </div>
      </section>

      {/* Grid */}
      <section className="space-y-10">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-black text-white">Sorteos Disponibles</h2>
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            {['Todas', 'Especial', 'Tecnología', 'Vehículos'].map(f => (
              <button 
                key={f} 
                onClick={() => setActiveFilter(f.toLowerCase())}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f.toLowerCase() ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRaffles.map(raffle => (
            <Link key={raffle.id} to={`/raffle/${raffle.id}`} className="group bg-slate-900/50 rounded-[2.5rem] border border-slate-800 hover:border-primary/40 transition-all hover:-translate-y-2 overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={raffle.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {raffle.type === 'multi' && (
                    <span className="bg-yellow-500 text-black text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <span className="material-symbols-outlined text-sm icon-fill">stars</span>
                      12 OPORTUNIDADES
                    </span>
                  )}
                  {raffle.status === 'completed' && <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full">FINALIZADO</span>}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">{raffle.name}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{raffle.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <div className="text-2xl font-black text-white">${raffle.price} <span className="text-[10px] text-slate-500">USD</span></div>
                  <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg"><span className="material-symbols-outlined">shopping_cart</span></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
