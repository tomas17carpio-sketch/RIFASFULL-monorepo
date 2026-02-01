
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { backend } from '../backend';
import { Raffle } from '../types';

const AdminRaffles: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [drawResult, setDrawResult] = useState<Raffle | null>(null);
  
  // AI Image Generator State
  const [aiName, setAiName] = useState('Kit Parrillero Premium');
  const [aiDesc, setAiDesc] = useState('Set de cuchillos, parrillera de acero y bolso térmico.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genImage, setGenImage] = useState<string | null>(null);

  useEffect(() => {
    setRaffles(backend.getRaffles());
  }, []);

  const handleDraw = (id: string) => {
    if (!window.confirm("¿Confirmas realizar el sorteo oficial ahora?")) return;
    const result = backend.executeRaffleDraw(id);
    if (result) {
      setDrawResult(result);
      setRaffles(backend.getRaffles());
    }
  };

  const handleAiGen = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Hyper-realistic product photography of ${aiName}: ${aiDesc}. Dark background, cinematic lighting, 8k resolution.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGenImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Modal de Ganadores - Advanced Podium */}
      {drawResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in">
          <div className="bg-[#1c2127] rounded-[3rem] p-12 max-w-3xl w-full border border-primary/30 shadow-[0_0_100px_rgba(244,140,37,0.3)] text-center space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="size-20 bg-primary rounded-full flex items-center justify-center mx-auto animate-bounce shadow-xl shadow-primary/40">
              <span className="material-symbols-outlined text-white text-4xl">emoji_events</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-black text-primary uppercase tracking-widest">Sorteo Oficial Finalizado</p>
              <h2 className="text-3xl font-black text-white">{drawResult.name}</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 text-left">
              {drawResult.type === 'multi' && drawResult.prizes ? (
                <>
                  {/* Top 1 & 2 Podium */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {drawResult.prizes.slice(0, 2).map(p => (
                        <div key={p.rank} className={`p-6 rounded-3xl border ${p.rank === 1 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-400/10 border-slate-400/30'} relative overflow-hidden group`}>
                            <div className={`absolute -top-4 -right-4 size-20 opacity-10 ${p.rank === 1 ? 'text-yellow-500' : 'text-slate-400'}`}><span className="material-symbols-outlined text-7xl">workspace_premium</span></div>
                            <p className="text-[10px] font-black uppercase text-slate-500 mb-1">{p.label}</p>
                            <h3 className="text-xl font-black text-white truncate">{p.winnerUser}</h3>
                            <p className="text-2xl font-black text-primary font-mono mt-3">#{p.winningTicket}</p>
                        </div>
                     ))}
                  </div>
                  {/* Others List */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                     {drawResult.prizes.slice(2).map(p => (
                        <div key={p.rank} className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                           <p className="text-[9px] font-black text-slate-600 uppercase">{p.rank}º PREMIO</p>
                           <p className="text-[11px] font-bold text-white truncate">{p.winnerUser}</p>
                           <p className="text-[10px] font-black text-primary/80 font-mono mt-1">#{p.winningTicket}</p>
                        </div>
                     ))}
                  </div>
                </>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-10 text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Ganador Certificado</p>
                   <h3 className="text-4xl font-black text-white mb-4">{drawResult.winnerUser}</h3>
                   <div className="inline-block px-10 py-4 bg-primary/10 border border-primary/20 rounded-2xl">
                      <p className="text-6xl font-black text-primary font-mono tracking-widest">{drawResult.winningTicket}</p>
                   </div>
                </div>
              )}
            </div>

            <button onClick={() => setDrawResult(null)} className="h-14 px-12 bg-white text-black font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest">Cerrar y Volver</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
           <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-white">Catálogo de Rifas</h1>
                <p className="text-slate-500">Supervisión y ejecución de sorteos en tiempo real.</p>
              </div>
              <button className="h-14 px-8 bg-primary text-white font-black rounded-2xl shadow-xl shadow-orange-500/20">Nueva Rifa</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {raffles.map(r => (
                <div key={r.id} className="bg-[#1c2127] rounded-[2.5rem] border border-slate-800 p-8 flex flex-col justify-between group hover:border-primary/40 transition-all">
                  <div className="flex gap-6 mb-6">
                    <img src={r.imageUrl} className="size-20 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between mb-1">
                         <span className="text-[9px] font-black text-slate-500 uppercase">{r.category}</span>
                         {r.type === 'multi' && <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 rounded">MULTI</span>}
                      </div>
                      <h3 className="text-lg font-black text-white truncate">{r.name}</h3>
                      <p className="text-xs font-bold text-slate-600 mt-1">Cierre: {new Date(r.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span className="text-slate-500">Ventas</span>
                      <span className="text-white">{r.soldTickets}/{r.totalTickets}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${(r.soldTickets/r.totalTickets)*100}%` }}></div>
                    </div>
                    {r.status === 'active' ? (
                      <button onClick={() => handleDraw(r.id)} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-primary font-black uppercase text-[10px] hover:bg-primary hover:text-white transition-all">Ejecutar Sorteo</button>
                    ) : (
                      <div className="text-center py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <span className="text-emerald-500 font-black text-[10px] uppercase">Finalizado</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-8">
           <div className="bg-[#1c2127] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-4">
                 <div className="size-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <span className="material-symbols-outlined icon-fill">auto_awesome</span>
                 </div>
                 <h3 className="text-sm font-black text-white uppercase tracking-widest italic">IA Visual Engine</h3>
              </div>
              
              <div className="space-y-4">
                 <input type="text" value={aiName} onChange={e => setAiName(e.target.value)} placeholder="Nombre del premio" className="w-full h-12 bg-slate-900 border border-slate-800 rounded-xl px-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none" />
                 <textarea value={aiDesc} onChange={e => setAiDesc(e.target.value)} placeholder="Descripción de escena..." rows={2} className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 outline-none resize-none" />
                 
                 <div className="aspect-square rounded-2xl bg-slate-900 border-2 border-dashed border-slate-800 flex items-center justify-center overflow-hidden">
                    {isGenerating ? (
                       <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full"></div>
                    ) : genImage ? (
                       <img src={genImage} className="w-full h-full object-cover" />
                    ) : (
                       <span className="material-symbols-outlined text-slate-700 text-5xl">image_search</span>
                    )}
                 </div>

                 <button onClick={handleAiGen} disabled={isGenerating} className="w-full h-14 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                    {isGenerating ? 'Pintando...' : 'Generar Arte IA'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRaffles;
