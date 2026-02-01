
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: '¡Hola! Soy el asistente de RIFASFULLPROJECT. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'Eres el Asistente de RIFASFULLPROJECT, una plataforma de rifas digitales en Venezuela. Responde de forma amable, breve y profesional. Los métodos de pago son Pago Móvil y Criptomonedas. Los sorteos son legales y transparentes. Si te preguntan sobre el proceso, diles que eligen tickets, pagan, reportan la referencia y esperan el sorteo.',
          temperature: 0.7,
        }
      });

      const botText = response.text || 'Lo siento, tuve un pequeño problema técnico. ¿Puedes repetir la pregunta?';
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Lo siento, mi conexión está fallando. Intenta de nuevo más tarde.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-[#1c2127] border border-slate-800 rounded-3xl w-[350px] sm:w-[400px] h-[500px] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-white">smart_toy</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Asistente RIFASFULLPROJECT</h3>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-white/80 font-bold uppercase">En línea</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="size-1 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="size-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="size-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe tu duda aquí..."
              className="flex-1 h-10 bg-slate-900 border-none rounded-xl text-xs text-white focus:ring-1 focus:ring-primary"
            />
            <button 
              onClick={handleSend}
              className="size-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-colors"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="size-14 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 group"
        >
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">chat</span>
          <span className="absolute -top-1 -right-1 size-4 bg-emerald-500 border-2 border-background-dark rounded-full"></span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
