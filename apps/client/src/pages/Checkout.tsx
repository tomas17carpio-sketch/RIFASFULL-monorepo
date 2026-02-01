
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { backend } from '../backend';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialTicketCount = location.state?.ticketCount || 1;
  const raffleId = location.state?.raffleId || '1';
  const raffleName = location.state?.raffleName || 'Sorteo';

  const [ticketCount] = useState(initialTicketCount);
  const [step, setStep] = useState(1); 
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const ticketPrice = 5.00; // Podría venir de la rifa real
  const totalAmountUsd = ticketCount * ticketPrice;
  const totalAmountBs = (totalAmountUsd * 45).toFixed(2);
  
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cedula: '',
    userId: `USR-${Math.floor(100000 + Math.random() * 900000)}`
  });

  const [paymentData, setPaymentData] = useState({
    reference: '',
    originBank: '',
    originPhone: '',
  });
  
  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOtpVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const validatePayment = () => {
    setPaymentError(null);
    if (!paymentData.originBank) { setPaymentError("Debe seleccionar su banco de origen."); return false; }
    if (paymentData.reference.length < 6) { setPaymentError("La referencia debe tener al menos 6 dígitos."); return false; }
    if (!paymentData.originPhone || paymentData.originPhone.length < 10) { setPaymentError("Ingrese un número de teléfono válido."); return false; }
    return true;
  };

  const simulateVerification = () => {
    if (!validatePayment()) return;

    setIsVerifying(true);
    setVerificationProgress(0);

    const transaction = backend.createTransaction({
      reference: paymentData.reference,
      bank: paymentData.originBank,
      user: userData.fullName,
      amount: totalAmountUsd,
      raffleId: raffleId,
      ticketCount: ticketCount
    });

    const stages = [
      { p: 10, m: 'INICIANDO PROTOCOLO DE CONCILIACIÓN...' },
      { p: 40, m: `BUSCANDO REFERENCIA #${paymentData.reference}...` },
      { p: 70, m: `VALIDANDO MONTO: Bs. ${totalAmountBs}...` },
      { p: 100, m: 'PAGO VALIDADO. TICKETS GENERADOS.' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setVerificationProgress(stages[currentStage].p);
        setVerificationMessage(stages[currentStage].m);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          navigate('/success', { 
            state: { 
              ticketCount, 
              raffleName,
              reference: paymentData.reference,
              assignedTickets: transaction.tickets
            } 
          });
        }, 800);
      }
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:px-40">
      {!isVerifying && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 animate-pulse">
          <span className="material-symbols-outlined text-red-500 text-2xl">gpp_maybe</span>
          <p className="text-xs font-black text-red-400 uppercase tracking-widest leading-relaxed">
            Protocolo Estricto: Los pagos de terceros serán bloqueados.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {!isVerifying && (
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="bg-[#1c2127] rounded-3xl p-8 border border-slate-800 shadow-xl space-y-8 sticky top-28">
              <h3 className="text-xl font-black flex items-center gap-3 text-white">
                <span className="material-symbols-outlined text-primary">verified</span> Resumen
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>SORTEO</span>
                  <span className="text-white truncate max-w-[150px]">{raffleName}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>BOLETOS</span>
                  <span className="text-white">{ticketCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span>TOTAL A PAGAR</span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">Bs. {totalAmountBs}</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest">$ {totalAmountUsd.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`${isVerifying ? 'lg:col-span-12' : 'lg:col-span-8'} order-1 lg:order-2 space-y-8`}>
          {isVerifying ? (
             <div className="bg-[#0a0f14] rounded-[3rem] p-12 border border-slate-800 shadow-3xl flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in zoom-in-95 min-h-[500px]">
                <div className="size-48 bg-slate-900 rounded-full flex items-center justify-center shadow-inner relative">
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="material-symbols-outlined text-6xl text-primary">security</span>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-white">{verificationProgress}%</h2>
                  <p className="text-primary text-sm font-black animate-pulse uppercase tracking-widest">{verificationMessage}</p>
                </div>
             </div>
          ) : step === 1 ? (
            <div className="bg-[#1c2127] rounded-[2.5rem] p-10 border border-slate-800 shadow-xl space-y-8">
              <h2 className="text-3xl font-black text-white">Datos de Participante</h2>
              <form onSubmit={handleInfoSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" required value={userData.fullName} onChange={(e) => setUserData({...userData, fullName: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-900 text-white font-bold outline-none border border-transparent focus:border-primary" placeholder="Nombre Completo" />
                <input type="text" required value={userData.cedula} onChange={(e) => setUserData({...userData, cedula: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-900 text-white font-bold outline-none border border-transparent focus:border-primary" placeholder="Cédula" />
                <input type="tel" required value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-900 text-white font-bold outline-none border border-transparent focus:border-primary" placeholder="Teléfono" />
                <input type="email" required value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-900 text-white font-bold outline-none border border-transparent focus:border-primary" placeholder="Correo" />
                <button type="submit" className="md:col-span-2 h-16 bg-primary text-white font-black rounded-full shadow-2xl shadow-orange-500/20 hover:bg-primary-dark transition-all">Continuar</button>
              </form>
            </div>
          ) : step === 2 ? (
            <div className="bg-[#1c2127] rounded-[2.5rem] p-12 border border-slate-800 shadow-2xl text-center space-y-10">
              <h2 className="text-3xl font-black text-white">Verifica tu Número</h2>
              <div className="flex justify-center gap-3">
                {otpValue.map((digit, idx) => (
                  <input key={idx} type="text" maxLength={1} value={digit} onChange={(e) => {
                    const newOtp = [...otpValue];
                    newOtp[idx] = e.target.value;
                    setOtpValue(newOtp);
                    if (e.target.value && e.target.nextSibling) (e.target.nextSibling as HTMLInputElement).focus();
                  }} className="size-16 bg-slate-900 border border-slate-800 rounded-2xl text-2xl font-black text-center text-white focus:border-primary outline-none" />
                ))}
              </div>
              <button onClick={handleOtpVerify} className="h-16 px-12 bg-white text-slate-900 font-black rounded-full">Confirmar Identidad</button>
            </div>
          ) : (
            <div className="bg-[#1c2127] rounded-[2.5rem] p-10 border border-slate-800 shadow-xl space-y-8">
              <h2 className="text-2xl font-black text-white">Reportar su Pago</h2>
              {paymentError && <p className="text-red-500 text-xs font-bold">{paymentError}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select value={paymentData.originBank} onChange={(e) => setPaymentData({...paymentData, originBank: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-900 text-white font-bold border border-transparent focus:border-primary outline-none">
                  <option value="">Seleccione Banco</option>
                  <option>Banesco</option><option>Mercantil</option><option>Provincial</option><option>BDV</option>
                </select>
                <input type="text" required value={paymentData.reference} onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-900 text-white font-black border border-transparent focus:border-primary outline-none" placeholder="Nro de Referencia" />
                <input type="tel" required value={paymentData.originPhone} onChange={(e) => setPaymentData({...paymentData, originPhone: e.target.value})} className="md:col-span-2 w-full h-14 px-6 rounded-2xl bg-slate-900 text-white font-bold border border-transparent focus:border-primary outline-none" placeholder="Teléfono del Pago Móvil" />
              </div>
              <button onClick={simulateVerification} className="w-full h-16 bg-primary text-white font-black rounded-full shadow-2xl">Finalizar Compra</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
