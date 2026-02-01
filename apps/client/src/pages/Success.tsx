
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Success: React.FC = () => {
  const location = useLocation();
  const ticketCount = location.state?.ticketCount || 0;
  const raffleName = location.state?.raffleName || "Sorteo Seleccionado";
  const assignedTickets = location.state?.assignedTickets || [];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 max-w-3xl mx-auto text-center space-y-10">
      <div className="flex items-center justify-center size-24 rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
        <span className="material-symbols-outlined text-6xl animate-bounce">check_circle</span>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">¡Compra Completada!</h1>
        <p className="text-slate-500 text-lg leading-relaxed">Tu pago ha sido procesado exitosamente. Aquí están tus números oficiales de participación.</p>
      </div>

      <div className="w-full bg-white dark:bg-[#1c2127] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
        
        <div className="flex gap-4 items-center">
          <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary">local_activity</span>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Sorteo Activo</span>
            <h3 className="text-xl font-black mt-1 text-white">{raffleName}</h3>
          </div>
        </div>

        {/* Display Assigned Tickets */}
        <div className="space-y-4">
           <p className="text-xs font-black text-slate-500 uppercase tracking-widest text-left">Tus Tickets Generados:</p>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {assignedTickets.map((num: string, idx: number) => (
                <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center shadow-lg relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400"></div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Nro.</span>
                    <span className="text-2xl font-black text-white font-mono tracking-widest">{num}</span>
                    <span className="material-symbols-outlined text-primary/20 absolute -bottom-2 -right-2 text-4xl group-hover:text-primary/40 transition-colors">confirmation_number</span>
                </div>
              ))}
           </div>
        </div>

        <p className="text-xs font-medium text-slate-500">
          Hemos enviado un correo con los detalles de tus números asignados. También puedes consultarlos en cualquier momento en la sección <span className="text-primary font-bold">Mis Rifas</span>.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link to="/my-raffles" className="flex-1 h-14 bg-primary text-white font-black rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20 hover:bg-primary-dark transition-all">
          Ver mis Números
        </Link>
        <Link to="/" className="flex-1 h-14 bg-slate-800 text-white font-bold rounded-full flex items-center justify-center hover:bg-slate-700 transition-all">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default Success;
