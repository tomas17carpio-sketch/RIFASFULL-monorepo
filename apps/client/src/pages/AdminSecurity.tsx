
import React from 'react';

const AdminSecurity: React.FC = () => {
  return (
    <div className="space-y-10 pb-10">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Seguridad y Blindaje Anti-Fraude</h1>
            <p className="text-slate-500 max-w-2xl leading-relaxed">Configura los protocolos de verificación de identidad móvil y las políticas de conciliación bancaria estricta.</p>
          </div>
          <button className="h-12 px-8 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-2xl shadow-orange-500/20 transition-all flex items-center gap-3">
            <span className="material-symbols-outlined">save</span> Guardar Protocolos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Anti-Fraud Policies */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <span className="material-symbols-outlined text-primary">policy</span>
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Políticas de Identidad</h3>
          </div>
          
          <div className="bg-admin-surface rounded-2xl p-6 border border-admin-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-black text-sm">Validación OTP Obligatoria</h4>
                <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Verificación vía SMS/WhatsApp</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-black text-sm">Match Estricto de Teléfono</h4>
                <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">Bloqueo de pagos de terceros</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/20 space-y-4">
             <div className="flex items-center gap-2 text-red-500">
                <span className="material-symbols-outlined text-xl">gavel</span>
                <h4 className="font-black text-xs uppercase tracking-widest">Protocolo de Lavado (AML)</h4>
             </div>
             <p className="text-[10px] text-slate-500 font-medium">Cualquier discrepancia de > $500 entre el titular registrado y el origen bancario disparará una congelación automática de fondos para investigación.</p>
          </div>
        </div>

        {/* AI & Anomaly */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <span className="material-symbols-outlined text-primary">neurology</span>
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Escáner de Anomalías</h3>
          </div>

          <div className="bg-admin-surface rounded-2xl p-6 border border-admin-border space-y-6">
            <h4 className="text-white font-black text-sm">Detección de Patrones de Pago</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>Relajado</span>
                <span className="text-primary italic">IA Optimizada</span>
                <span>Auditado</span>
              </div>
              <input type="range" className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary" />
              <p className="text-[10px] text-slate-400 font-medium">Actualmente bloqueando un 1.4% de transacciones por inconsistencias de origen.</p>
            </div>
          </div>
        </div>

        {/* Real-time Logs */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <span className="material-symbols-outlined text-primary">shield_with_heart</span>
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Actividad de Auditoría</h3>
          </div>

          <div className="bg-admin-surface rounded-2xl border border-admin-border divide-y divide-slate-800 max-h-[400px] overflow-y-auto custom-scrollbar">
            {[
              { id: '1', level: 'ALERTA', msg: 'Intento de pago de tercero', user: 'Carlos M.', phone: '0412-***-99', color: 'text-amber-500' },
              { id: '2', level: 'BLOQUEO', msg: 'Referencia duplicada detectada', user: 'Desconocido', phone: '0414-***-11', color: 'text-red-500' },
              { id: '3', level: 'EXITO', msg: 'Identidad OTP Verificada', user: 'Maria L.', phone: '0424-***-88', color: 'text-emerald-500' },
              { id: '4', level: 'EXITO', msg: 'Match Teléfono-Banco OK', user: 'Juan P.', phone: '0412-***-00', color: 'text-emerald-500' }
            ].map(log => (
              <div key={log.id} className="p-4 hover:bg-white/5 transition-colors flex gap-4">
                <div className={`mt-1 size-2 rounded-full shrink-0 ${log.color.replace('text', 'bg')}`}></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase ${log.color}`}>{log.level}</span>
                    <span className="text-[10px] text-slate-600 font-mono">#{log.id}</span>
                  </div>
                  <p className="text-xs font-bold text-white mt-0.5">{log.msg}</p>
                  <p className="text-[9px] text-slate-500 font-medium uppercase mt-1">{log.user} • {log.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;
