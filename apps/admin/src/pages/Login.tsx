import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'credentials' | '2fa' | 'biometric'>('credentials');
    const [email, setEmail] = useState('tomas17carpio@gmail.com');
    const [password, setPassword] = useState('T12345678.');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [scanProgress, setScanProgress] = useState(0);

    const ENV_USER = 'tomas17carpio@gmail.com';
    const ENV_PASS = 'T12345678.';
    const ENV_2FA = '123456';

    const handleCredentialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (email === ENV_USER && password === ENV_PASS) {
                setIsLoading(false);
                setStep('2fa');
            } else {
                setIsLoading(false);
                setError('Credenciales inválidas o acceso no autorizado.');
            }
        }, 1200);
    };

    const handle2FASubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            if (twoFactorCode === ENV_2FA) {
                onLogin();
                navigate('/');
            } else {
                setIsLoading(false);
                setError('Código de seguridad incorrecto.');
            }
        }, 1200);
    };

    const handleBiometricStart = () => {
        setStep('biometric');
        setIsLoading(true);
        setError('');
        setScanProgress(0);

        // Simular progreso de escaneo
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        setTimeout(() => {
            if (Math.random() > 0.05) {
                onLogin();
                navigate('/');
            } else {
                setIsLoading(false);
                setStep('credentials');
                setError('Fallo de autenticación biométrica. Por favor usa tus credenciales.');
            }
        }, 3000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0f1e] relative overflow-hidden font-display selection:bg-primary selection:text-white">
            {/* Background High-Tech Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]"></div>
                {/* Grid Effect */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="w-full max-w-md p-6 relative z-10">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500">
                    
                    {/* Device Identity Header */}
                    <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Identidad de Dispositivo: OK</span>
                        </div>
                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">v3.1 Secure</span>
                    </div>

                    <div className="p-10 pt-8">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-primary rounded-[1.5rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6 group cursor-default">
                                <span className="material-symbols-outlined text-white text-4xl group-hover:scale-110 transition-transform duration-300">shield_lock</span>
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight mb-2">ADMINPROJECT</h1>
                            <p className="text-slate-400 text-sm font-medium">Acceso Biométrico Sincronizado</p>
                        </div>

                        {step === 'biometric' ? (
                            <div className="flex flex-col items-center py-6 space-y-8 animate-in zoom-in-95 duration-500">
                                <div className="relative group">
                                    {/* Scan Circle */}
                                    <div className="w-32 h-32 rounded-full border-4 border-primary/20 flex items-center justify-center bg-primary/5 relative overflow-hidden">
                                        <span className="material-symbols-outlined text-6xl text-primary z-10">fingerprint</span>
                                        {/* Scan Line Animation */}
                                        <div 
                                            className="absolute top-0 left-0 right-0 h-1 bg-primary/50 blur-[2px] animate-scan-line shadow-[0_0_15px_rgba(19,127,236,1)]"
                                            style={{ top: `${scanProgress}%` }}
                                        ></div>
                                    </div>
                                    {/* Rotating Ring */}
                                    <div className="absolute inset-[-8px] border-2 border-dashed border-primary/30 rounded-full animate-spin-slow"></div>
                                </div>
                                <div className="text-center space-y-3">
                                    <h3 className="text-white font-black text-xl tracking-tight">Escaneando Biometría</h3>
                                    <p className="text-slate-400 text-sm max-w-[200px] mx-auto">Verificando firma digital del dispositivo actual...</p>
                                    {/* Progress Bar */}
                                    <div className="w-48 h-1.5 bg-white/5 rounded-full mx-auto mt-4 overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setStep('credentials')}
                                    className="text-slate-500 font-bold text-xs hover:text-primary transition-colors uppercase tracking-widest"
                                >
                                    Cancelar y usar PIN
                                </button>
                            </div>
                        ) : step === 'credentials' ? (
                            <form onSubmit={handleCredentialSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Firma del Administrador</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">alternate_email</span>
                                        <input 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                            placeholder="admin@empresa.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Clave Maestra</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                                        <input 
                                            type="password" 
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
                                        <span className="material-symbols-outlined">error</span>
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col gap-4 mt-8">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full h-14 bg-primary hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-95"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>AUTENTICAR</span>
                                                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex-1 h-px bg-white/5"></div>
                                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Detección Inteligente</span>
                                        <div className="flex-1 h-px bg-white/5"></div>
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={handleBiometricStart}
                                        className="w-full h-14 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">fingerprint</span>
                                        <span className="text-sm tracking-wide">Acceso Biométrico</span>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handle2FASubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                <div className="text-center space-y-3">
                                    <h3 className="text-white font-black text-xl tracking-tight">Verificación Dinámica</h3>
                                    <p className="text-slate-400 text-sm">Ingrese el código de seguridad (OTP) de su dispositivo vinculado.</p>
                                </div>

                                <div className="flex justify-center">
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                                        className="w-full max-w-[260px] bg-white/5 border border-white/10 text-white text-4xl font-mono tracking-[0.4em] text-center rounded-2xl py-5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-700"
                                        placeholder="000000"
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
                                        <span className="material-symbols-outlined">error</span>
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => { setStep('credentials'); setTwoFactorCode(''); setError(''); }}
                                        className="flex-1 h-14 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-2xl transition-all text-sm"
                                    >
                                        ATRÁS
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="flex-[2] h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                                                <span>VERIFICAR</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    
                    {/* Security Footer Sync */}
                    <div className="p-5 bg-white/5 border-t border-white/5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[14px] text-primary">sync</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sincronización Automática Activa</span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed max-w-[280px] mx-auto">
                            Toda la actividad en este dispositivo está siendo monitoreada y cifrada mediante protocolos de extremo a extremo.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan-line {
                    0% { top: 0%; opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0.5; }
                }
                .animate-scan-line {
                    animation: scan-line 2s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;