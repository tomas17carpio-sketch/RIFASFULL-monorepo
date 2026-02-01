
import React, { useState } from 'react';

const Feedback: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value: string) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('El correo electrónico es obligatorio.');
    } else if (!emailRegex.test(value)) {
      setEmailError('Por favor, introduce un formato de correo válido (ej: usuario@dominio.com).');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || !email) {
      validateEmail(email);
      return;
    }
    alert('¡Gracias por tu feedback!');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Formulario de Feedback</h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
          Tu opinión es vital para el lanzamiento. Ayúdanos a pulir la experiencia de compra de tickets y reporta cualquier incidencia.
        </p>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1c2127] rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Nombre (Opcional)</label>
            <input 
              type="text" 
              className="w-full h-12 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent font-medium" 
              placeholder="Ej: María Rodríguez" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 text-red-500">Correo Electrónico *</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              onBlur={(e) => validateEmail(e.target.value)}
              className={`w-full h-12 px-6 rounded-2xl border ${emailError ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} bg-slate-50 dark:bg-slate-900 focus:ring-2 ${emailError ? 'focus:ring-red-500' : 'focus:ring-primary'} focus:border-transparent font-medium transition-all`} 
              placeholder="maria@ejemplo.com" 
            />
            {emailError && (
              <p className="text-[10px] text-red-500 font-bold ml-2 animate-fade-in">{emailError}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Reporte</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'bug', label: 'Error (Bug)', icon: 'bug_report' },
              { id: 'suggestion', label: 'Sugerencia', icon: 'lightbulb' },
              { id: 'ux', label: 'Experiencia (UX)', icon: 'sentiment_satisfied' }
            ].map(type => (
              <label key={type.id} className="cursor-pointer group">
                <input type="radio" name="type" className="sr-only peer" />
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary group-hover:border-primary/30">
                  <span className="material-symbols-outlined mb-2 text-2xl">{type.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest">{type.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Califica tu experiencia</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button" className="text-slate-300 hover:text-yellow-400 transition-colors">
                <span className="material-symbols-outlined text-4xl icon-fill">star</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Descripción Detallada</label>
          <textarea 
            rows={4} 
            className="w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent font-medium resize-none"
            placeholder="Describe los pasos para reproducir el error..."
          />
        </div>

        <div className="pt-6 flex flex-col-reverse sm:flex-row gap-4 justify-end border-t border-slate-100 dark:border-slate-800">
          <button type="button" className="h-12 px-8 rounded-full border-2 border-slate-100 dark:border-slate-800 text-slate-500 font-bold hover:bg-slate-50 transition-all">Cancelar</button>
          <button type="submit" className="h-12 px-10 rounded-full bg-primary hover:bg-primary-dark text-white font-black shadow-xl shadow-orange-500/20 transition-all">Enviar Feedback</button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;
