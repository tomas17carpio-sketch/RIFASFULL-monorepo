import React, { useState, useEffect } from 'react';
import { raffleService } from '@rifasfull/core';
import CreateRaffleModal from '../components/CreateRaffleModal';

interface Raffle {
  id: string;
  title: string;
  description?: string;
  price: number;
  total_tickets: number;
  available_tickets: number;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRaffles();
  }, []);

  const loadRaffles = async () => {
    try {
      setLoading(true);
      const data = await raffleService.fetchRaffles();
      setRaffles(data);
    } catch (error) {
      console.error('Error cargando rifas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRaffleCreated = () => {
    loadRaffles(); // Recargar la lista
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto h-full bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white font-display">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#f6f7f8]/80 dark:bg-[#101922]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-[#283039] px-4 md:px-6 py-4 md:py-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 dark:text-white text-xl md:text-3xl font-black leading-tight tracking-tight">Vista General</h1>
            <p className="text-slate-500 dark:text-[#9dabb9] text-xs md:text-sm font-normal">Bienvenido de nuevo, Administrador</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-full md:rounded-lg h-10 px-4 md:px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="truncate">Nueva Rifa</span>
          </button>
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6 pb-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="flex flex-col gap-2 md:gap-3 rounded-2xl p-4 bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-border-dark">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-primary bg-primary-100 dark:bg-opacity-20 p-1.5 rounded-lg text-lg md:text-xl">confirmation_number</span>
              <p className="text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px] md:text-sm">trending_up</span>
                +2%
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold tracking-tight">
                {raffles.filter(r => r.status === 'active').length}
              </p>
              <p className="text-slate-500 dark:text-[#9dabb9] text-xs font-medium truncate">Rifas Activas</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 rounded-2xl p-4 bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-border-dark">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-green-600 bg-green-100 dark:bg-opacity-20 p-1.5 rounded-lg text-lg md:text-xl">payments</span>
              <p className="text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px] md:text-sm">trending_up</span>
                +15%
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold tracking-tight">
                ${raffles.reduce((sum, r) => sum + (r.price * (r.total_tickets - r.available_tickets)), 0).toFixed(0)}
              </p>
              <p className="text-slate-500 dark:text-[#9dabb9] text-xs font-medium truncate">Ingresos</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 rounded-2xl p-4 bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-border-dark">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-purple-600 bg-purple-100 dark:bg-opacity-20 p-1.5 rounded-lg text-lg md:text-xl">groups</span>
              <p className="text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px] md:text-sm">trending_up</span>
                +5%
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold tracking-tight">
                {raffles.length}
              </p>
              <p className="text-slate-500 dark:text-[#9dabb9] text-xs font-medium truncate">Total Rifas</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 rounded-2xl p-4 bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-border-dark">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-orange-600 bg-orange-100 dark:bg-opacity-20 p-1.5 rounded-lg text-lg md:text-xl">verified_user</span>
              <p className="text-red-600 dark:text-red-400 text-[10px] md:text-xs font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px] md:text-sm">trending_down</span>
                -10%
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold tracking-tight">
                0
              </p>
              <p className="text-slate-500 dark:text-[#9dabb9] text-xs font-medium truncate">Verificar</p>
            </div>
          </div>
        </div>

        {/* Lista de Rifas */}
        <div className="rounded-2xl bg-white dark:bg-card-dark shadow-sm border border-slate-100 dark:border-border-dark overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100 dark:border-border-dark">
            <h2 className="text-slate-900 dark:text-white text-lg md:text-xl font-bold">Rifas Recientes</h2>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-border-dark">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Cargando...</div>
            ) : raffles.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No hay rifas creadas</div>
            ) : (
              raffles.map((raffle) => (
                <div key={raffle.id} className="p-4 hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-900 dark:text-white font-bold truncate">{raffle.title}</h3>
                      <p className="text-slate-500 dark:text-[#9dabb9] text-sm mt-1">
                        ${raffle.price} - {raffle.available_tickets}/{raffle.total_tickets} tickets disponibles
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      raffle.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      raffle.status === 'draft' ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {raffle.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Creación */}
      <CreateRaffleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRaffleCreated={handleRaffleCreated}
      />
    </div>
  );
};

export default Dashboard;