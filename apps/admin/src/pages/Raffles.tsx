import React, { useState, useEffect, useRef } from 'react';
import { useNotifications, useWinners } from '../App';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Raffles = () => {
    const { addNotification } = useNotifications();
    const { addWinner } = useWinners();

    // Stats for Charts
    const [animateProgress, setAnimateProgress] = useState(false);
    
    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [selectedAuditRaffle, setSelectedAuditRaffle] = useState<any>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- ESTADOS PARA EL SORTEO ---
    const [isDrawOpen, setIsDrawOpen] = useState(false);
    const [selectedRaffleForDraw, setSelectedRaffleForDraw] = useState<any>(null);
    const [drawDigits, setDrawDigits] = useState(['0', '0', '0', '0']);
    const [isRolling, setIsRolling] = useState(false);
    const [drawWinner, setDrawWinner] = useState<any>(null);
    const [multiDrawResults, setMultiDrawResults] = useState<any>(null);

    // --- CATEGORÍAS PREDEFINIDAS ---
    const predefinedCategories = ['Tecnología', 'Vehículos', 'Premios', 'Viajes', 'Hogar', 'Efectivo'];
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    // --- DATA MODEL PARA RIFAS ---
    const [newRaffle, setNewRaffle] = useState({
        name: '',
        type: 'Single', // 'Single' | 'Multiple'
        category: 'Tecnología',
        currency: 'USD', // 'USD' | 'VES'
        status: 'Activa',
        description: '',
        ticketPrice: '',
        quantity: '',
        closeDate: '',
        image: 'https://images.unsplash.com/photo-1512428559083-a400a40d94d5?q=80&w=2070&auto=format&fit=crop',
        prizes: [{ id: 1, label: 'Primer Premio', value: '' }],
        paymentDetails: {
            bank: '',
            phone: '',
            idNumber: ''
        }
    });

    const [raffles, setRaffles] = useState<any[]>([
        {
            id: 1,
            name: "Mega Sorteo Tesla 2024",
            type: 'Single',
            category: "Vehículos",
            currency: "USD",
            status: "Activa",
            closeDate: "2024-12-30",
            ticketPrice: 20.00,
            quantity: 5000,
            sold: 3420,
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop",
            paymentDetails: { bank: 'Banesco', phone: '04141234567', idNumber: 'V-12345678' },
            auditTrail: [
                { time: '2023-11-01 10:00', action: 'Rifa Creada', user: 'Admin' },
                { time: '2023-11-01 10:01', action: 'Configuración de Pago Móvil: Banesco - 04141234567', user: 'Admin' }
            ]
        },
        {
            id: 2,
            name: "Combo Gamer + Premios Consuelo",
            type: 'Multiple',
            category: "Tecnología",
            currency: "VES",
            status: "Activa",
            closeDate: "2024-11-15",
            ticketPrice: 450.00,
            quantity: 1000,
            sold: 850,
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
            paymentDetails: { bank: 'Mercantil', phone: '04129876543', idNumber: 'V-87654321' },
            prizes: [
                { label: 'PC Master Race', qty: 1 },
                { label: 'Monitores 4K', qty: 2 },
                { label: 'Gift Cards $50', qty: 10 }
            ],
            auditTrail: [
                { time: '2023-10-20 09:00', action: 'Configuración Multi-Premio', user: 'Admin' }
            ]
        }
    ]);

    useEffect(() => {
        setTimeout(() => setAnimateProgress(true), 500);
    }, []);

    // --- HANDLERS ---
    const handleAddPrizeTier = () => {
        setNewRaffle({
            ...newRaffle,
            prizes: [...newRaffle.prizes, { id: Date.now(), label: '', value: '' }]
        });
    };

    const handleRemovePrizeTier = (id: number) => {
        if (newRaffle.prizes.length > 1) {
            setNewRaffle({
                ...newRaffle,
                prizes: newRaffle.prizes.filter(p => p.id !== id)
            });
        }
    };

    const handleOpenAudit = (raffle: any) => {
        setSelectedAuditRaffle(raffle);
        setIsAuditOpen(true);
    };

    const handleOpenDraw = (raffle: any) => {
        setSelectedRaffleForDraw(raffle);
        setDrawDigits(['0', '0', '0', '0']);
        setDrawWinner(null);
        setMultiDrawResults(null);
        setIsDrawOpen(true);
    };

    const startDraw = () => {
        if (isRolling) return;
        setIsRolling(true);
        
        const interval = setInterval(() => {
            setDrawDigits(Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString()));
        }, 80);

        setTimeout(() => {
            clearInterval(interval);
            const finalNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            setDrawDigits(finalNum.split(''));
            
            if (selectedRaffleForDraw.type === 'Single') {
                setDrawWinner({ name: 'Usuario Ganador', winningTicket: finalNum, avatar: '' });
            } else {
                setMultiDrawResults({
                    primary: { name: 'Juan Perez', ticket: finalNum },
                    secondary: { name: 'Maria Garcia', ticket: '4492' },
                    extra: Array.from({ length: 10 }, (_, i) => ({ name: `Ganador ${i+1}`, ticket: (1000 + i).toString() }))
                });
            }
            setIsRolling(false);
        }, 3000);
    };

    const handleConfirmDraw = () => {
        const commonDate = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        
        if (selectedRaffleForDraw.type === 'Single' && drawWinner) {
            addWinner({
                id: Date.now(),
                userName: drawWinner.name,
                ticketNumber: drawWinner.winningTicket,
                raffleName: selectedRaffleForDraw.name,
                prizeImage: selectedRaffleForDraw.image,
                date: commonDate
            });
        } else if (multiDrawResults) {
            addWinner({ id: Date.now(), userName: multiDrawResults.primary.name, ticketNumber: multiDrawResults.primary.ticket, raffleName: `${selectedRaffleForDraw.name} (1er Lugar)`, prizeImage: selectedRaffleForDraw.image, date: commonDate });
            addWinner({ id: Date.now() + 1, userName: multiDrawResults.secondary.name, ticketNumber: multiDrawResults.secondary.ticket, raffleName: `${selectedRaffleForDraw.name} (2do Lugar)`, prizeImage: selectedRaffleForDraw.image, date: commonDate });
            multiDrawResults.extra.forEach((w: any, i: number) => {
                addWinner({ id: Date.now() + 10 + i, userName: w.name, ticketNumber: w.ticket, raffleName: `${selectedRaffleForDraw.name} (Premio Consuelo)`, prizeImage: selectedRaffleForDraw.image, date: commonDate });
            });
        }

        setRaffles(prev => prev.map(r => r.id === selectedRaffleForDraw.id ? {
            ...r,
            status: 'Finalizada',
            auditTrail: [...r.auditTrail, { time: new Date().toLocaleString(), action: 'Sorteo Ejecutado - Ganadores Registrados', user: 'Admin' }]
        } : r));

        addNotification('Sorteo Finalizado', 'Los registros de auditoría han sido sellados.', 'success');
        setIsDrawOpen(false);
    };

    const handleCreateRaffle = () => {
        const id = Date.now();
        const raffleData = {
            id,
            ...newRaffle,
            sold: 0,
            auditTrail: [
                { time: new Date().toLocaleString(), action: 'Rifa Creada', user: 'Admin' },
                { time: new Date().toLocaleString(), action: `Pago Móvil Sellado: ${newRaffle.paymentDetails.bank} (${newRaffle.currency})`, user: 'Admin' }
            ]
        };
        setRaffles([raffleData, ...raffles]);
        addNotification('Rifa Creada', `Sorteo "${newRaffle.name}" publicado con Pago Móvil configurado.`, 'success');
        setIsModalOpen(false);
        
        setNewRaffle({
            name: '',
            type: 'Single',
            category: 'Tecnología',
            currency: 'USD',
            status: 'Activa',
            description: '',
            ticketPrice: '',
            quantity: '',
            closeDate: '',
            image: 'https://images.unsplash.com/photo-1512428559083-a400a40d94d5?q=80&w=2070&auto=format&fit=crop',
            prizes: [{ id: 1, label: 'Primer Premio', value: '' }],
            paymentDetails: { bank: '', phone: '', idNumber: '' }
        });
        setShowCustomCategory(false);
    };

    const chartData = {
        labels: raffles.map(r => r.name.substring(0, 10) + '...'),
        datasets: [{
            label: 'Tickets Vendidos',
            data: raffles.map(r => r.sold),
            backgroundColor: 'rgba(19, 127, 236, 0.7)',
            borderRadius: 8
        }]
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f8f7f5] dark:bg-[#101922] text-[#181411] dark:text-white">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">Panel de Rifas</h1>
                        <p className="text-[#8a7560] dark:text-[#9dabb9] text-sm md:text-base font-medium">Control bimoneda y auditoría independiente por sorteo.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="h-12 px-6 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center gap-2">
                            <span className="material-symbols-outlined">add_circle</span> Nueva Rifa
                        </button>
                    </div>
                </div>

                {/* Stats & Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm h-[300px]">
                        <h3 className="font-black text-lg mb-4">Ventas por Rifa</h3>
                        <div className="h-[220px]">
                            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black">Certificación Bimoneda</h3>
                            <p className="text-white/70 text-sm">Soporte nativo para transacciones en USD y VES mediante Pago Móvil verificado.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                            <div className="flex flex-col">
                                <span className="font-bold text-xs">RECAUDO MULTI-CUENTA</span>
                                <span className="text-lg font-black tracking-widest">HABILITADO</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Raffle List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {raffles.map((raffle) => (
                        <div key={raffle.id} className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-500">
                            <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url("${raffle.image}")` }}>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${raffle.type === 'Multiple' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                        {raffle.type}
                                    </span>
                                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                                        {raffle.currency}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-white font-black text-xl leading-tight truncate">{raffle.name}</h4>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{raffle.category}</p>
                                        <p className="text-white font-black text-lg">{raffle.currency === 'USD' ? '$' : 'Bs'} {raffle.ticketPrice}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Vendido</p>
                                        <p className="text-lg font-black">{raffle.quantity > 0 ? Math.round((raffle.sold / raffle.quantity) * 100) : 0}%</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Tickets</p>
                                        <p className="text-xs font-bold text-slate-500">{raffle.sold} / {raffle.quantity}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Destino Pago Móvil</p>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{raffle.paymentDetails.bank} - {raffle.paymentDetails.phone}</p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenDraw(raffle)} className="flex-1 h-12 rounded-xl bg-primary text-white font-black text-xs hover:bg-blue-600 transition-colors shadow-lg shadow-primary/10">
                                        SORTEAR
                                    </button>
                                    <button onClick={() => handleOpenAudit(raffle)} className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#2d3748] flex items-center justify-center hover:bg-slate-200 transition-colors" title="Ver Auditoría">
                                        <span className="material-symbols-outlined text-slate-500">history_edu</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL AUDITORÍA EXHAUSTIVA */}
            {isAuditOpen && selectedAuditRaffle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                    <div className="bg-white dark:bg-[#1e293b] rounded-[3rem] shadow-2xl w-full max-w-2xl border border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">policy</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">Expediente de Auditoría</h3>
                                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{selectedAuditRaffle.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsAuditOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 mb-8">
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Configuración de Recaudo Sellada</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Moneda Denominada</p>
                                        <p className="text-sm font-bold">{selectedAuditRaffle.currency}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Precio Unitario</p>
                                        <p className="text-sm font-bold">{selectedAuditRaffle.currency === 'USD' ? '$' : 'Bs'} {selectedAuditRaffle.ticketPrice}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Banco Destino</p>
                                        <p className="text-sm font-bold">{selectedAuditRaffle.paymentDetails.bank}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Cédula / RIF</p>
                                        <p className="text-sm font-bold">{selectedAuditRaffle.paymentDetails.idNumber}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {selectedAuditRaffle.auditTrail.map((log: any, i: number) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i < selectedAuditRaffle.auditTrail.length - 1 && <div className="absolute left-6 top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-700"></div>}
                                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 z-10">
                                            <span className="material-symbols-outlined text-[20px] text-slate-400">event_note</span>
                                        </div>
                                        <div className="pb-8">
                                            <p className="text-[10px] font-black text-primary uppercase mb-1">{log.time}</p>
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white">{log.action}</h4>
                                            <p className="text-xs text-slate-500 mt-1">Ejecutado por: <span className="font-bold text-slate-700 dark:text-slate-300">{log.user}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CREACIÓN (DOBLE MODO + BIMONEDA + PAGO MÓVIL) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e293b] rounded-[3rem] shadow-2xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto flex flex-col transition-all animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b dark:border-slate-800 sticky top-0 bg-white dark:bg-[#1e293b] z-20 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black">Configurar Nueva Rifa</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Soporte Multimoneda y Pago Móvil Dinámico</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        
                        <div className="p-8 space-y-10">
                            {/* Selector de Tipo y Moneda */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Modalidad de Premios</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => setNewRaffle({...newRaffle, type: 'Single'})} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${newRaffle.type === 'Single' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800'}`}>
                                            <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                                            <p className="font-black text-[10px] uppercase">Premio Único</p>
                                        </button>
                                        <button onClick={() => setNewRaffle({...newRaffle, type: 'Multiple'})} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${newRaffle.type === 'Multiple' ? 'border-purple-500 bg-purple-500/5' : 'border-slate-100 dark:border-slate-800'}`}>
                                            <span className="material-symbols-outlined text-2xl">military_tech</span>
                                            <p className="font-black text-[10px] uppercase">Múltiples</p>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Moneda del Sorteo</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => setNewRaffle({...newRaffle, currency: 'USD'})} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${newRaffle.currency === 'USD' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-slate-800'}`}>
                                            <span className="font-black text-xl">USD</span>
                                            <p className="font-black text-[10px] uppercase">Dólares</p>
                                        </button>
                                        <button onClick={() => setNewRaffle({...newRaffle, currency: 'VES'})} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${newRaffle.currency === 'VES' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-slate-800'}`}>
                                            <span className="font-black text-xl">VES</span>
                                            <p className="font-black text-[10px] uppercase">Bolívares</p>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Información General */}
                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Información General</label>
                                <input type="text" placeholder="Nombre de la Rifa" value={newRaffle.name} onChange={(e) => setNewRaffle({...newRaffle, name: e.target.value})} className="w-full h-14 px-6 rounded-2xl bg-slate-50 dark:bg-black/20 border-transparent focus:ring-primary text-sm font-bold" />
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={showCustomCategory ? 'Otro' : newRaffle.category} onChange={(e) => e.target.value === 'Otro' ? setShowCustomCategory(true) : (setShowCustomCategory(false), setNewRaffle({...newRaffle, category: e.target.value}))} className="h-14 px-6 rounded-2xl bg-slate-50 dark:bg-black/20 border-transparent focus:ring-primary text-sm font-bold">
                                        {predefinedCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        <option value="Otro">+ Nueva Categoría...</option>
                                    </select>
                                    <input type="date" value={newRaffle.closeDate} onChange={(e) => setNewRaffle({...newRaffle, closeDate: e.target.value})} className="h-14 px-6 rounded-2xl bg-slate-50 dark:bg-black/20 border-transparent text-sm font-bold" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">{newRaffle.currency === 'USD' ? '$' : 'Bs'}</span>
                                        <input type="number" placeholder="Precio Boleto" value={newRaffle.ticketPrice} onChange={(e) => setNewRaffle({...newRaffle, ticketPrice: e.target.value})} className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 dark:bg-black/20 border-transparent text-sm font-bold" />
                                    </div>
                                    <input type="number" placeholder="Cantidad de Tickets" value={newRaffle.quantity} onChange={(e) => setNewRaffle({...newRaffle, quantity: e.target.value})} className="h-14 px-6 rounded-2xl bg-slate-50 dark:bg-black/20 border-transparent text-sm font-bold" />
                                </div>
                            </div>

                            {/* Configuración de Pago Móvil (Editable por Rifa) */}
                            <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-600">account_balance</span>
                                    <h4 className="font-black text-sm uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Configuración de Pago Móvil para esta Rifa</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Banco</label>
                                        <input type="text" placeholder="Ej: Banesco" value={newRaffle.paymentDetails.bank} onChange={(e) => setNewRaffle({...newRaffle, paymentDetails: {...newRaffle.paymentDetails, bank: e.target.value}})} className="w-full h-12 px-5 rounded-xl bg-white dark:bg-black/20 border-emerald-100 dark:border-emerald-900/30 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Teléfono</label>
                                        <input type="text" placeholder="0414..." value={newRaffle.paymentDetails.phone} onChange={(e) => setNewRaffle({...newRaffle, paymentDetails: {...newRaffle.paymentDetails, phone: e.target.value}})} className="w-full h-12 px-5 rounded-xl bg-white dark:bg-black/20 border-emerald-100 dark:border-emerald-900/30 text-xs font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cédula / RIF</label>
                                        <input type="text" placeholder="V-12345678" value={newRaffle.paymentDetails.idNumber} onChange={(e) => setNewRaffle({...newRaffle, paymentDetails: {...newRaffle.paymentDetails, idNumber: e.target.value}})} className="w-full h-12 px-5 rounded-xl bg-white dark:bg-black/20 border-emerald-100 dark:border-emerald-900/30 text-xs font-bold" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-emerald-600/70 font-medium italic">Estos datos serán los únicos mostrados al usuario para este sorteo específico.</p>
                            </div>

                            {newRaffle.type === 'Multiple' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-black uppercase tracking-widest text-purple-500">Escalafón de Premios</label>
                                        <button onClick={handleAddPrizeTier} className="text-xs font-black text-primary hover:underline">+ Añadir Nivel</button>
                                    </div>
                                    <div className="space-y-3">
                                        {newRaffle.prizes.map((p, i) => (
                                            <div key={p.id} className="flex gap-3 animate-in slide-in-from-right-2">
                                                <input type="text" placeholder="Ej: 2do Premio" value={p.label} onChange={(e) => { const up = [...newRaffle.prizes]; up[i].label = e.target.value; setNewRaffle({...newRaffle, prizes: up}); }} className="flex-1 h-12 px-5 rounded-xl bg-slate-50 dark:bg-black/20 border-transparent text-xs font-bold" />
                                                <input type="text" placeholder="Descripción" value={p.value} onChange={(e) => { const up = [...newRaffle.prizes]; up[i].value = e.target.value; setNewRaffle({...newRaffle, prizes: up}); }} className="flex-[2] h-12 px-5 rounded-xl bg-slate-50 dark:bg-black/20 border-transparent text-xs font-bold" />
                                                <button onClick={() => handleRemovePrizeTier(p.id)} className="w-12 h-12 text-red-400 hover:text-red-600 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-4 sticky bottom-0">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-800 font-black text-sm hover:bg-slate-100 transition-colors">CANCELAR</button>
                            <button onClick={handleCreateRaffle} className="flex-[2] h-14 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all">PUBLICAR Y SELLAR AUDITORÍA</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE SORTEO (TÓMBOLA) */}
            {isDrawOpen && selectedRaffleForDraw && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <div className="bg-white dark:bg-[#1e293b] rounded-[3rem] shadow-2xl w-full max-w-xl border-4 border-yellow-400 p-8 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black uppercase">Tómbola Digital</h2>
                            <p className="text-slate-500 text-sm font-mono">{selectedRaffleForDraw.name}</p>
                        </div>

                        <div className="flex gap-4">
                            {drawDigits.map((d, i) => (
                                <div key={i} className="w-16 h-24 bg-slate-100 dark:bg-black/40 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-5xl font-black text-primary">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {drawWinner || multiDrawResults ? (
                            <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 animate-in slide-in-from-bottom-4">
                                <h3 className="font-black text-emerald-600 mb-2 uppercase tracking-widest">¡Sorteo Verificado!</h3>
                                {drawWinner ? (
                                    <p className="text-lg font-bold">{drawWinner.name} (Ticket #{drawWinner.winningTicket})</p>
                                ) : (
                                    <div className="text-left space-y-1">
                                        <p className="text-sm"><b>1er Lugar:</b> {multiDrawResults.primary.name}</p>
                                        <p className="text-sm"><b>2do Lugar:</b> {multiDrawResults.secondary.name}</p>
                                        <p className="text-xs text-slate-500">+ 10 premios adicionales registrados.</p>
                                    </div>
                                )}
                            </div>
                        ) : null}

                        <button 
                            onClick={(drawWinner || multiDrawResults) ? handleConfirmDraw : startDraw} 
                            disabled={isRolling}
                            className={`w-full h-16 rounded-2xl font-black text-lg uppercase transition-all ${isRolling ? 'bg-slate-200 text-slate-400' : 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 shadow-xl shadow-yellow-400/20'}`}
                        >
                            {isRolling ? 'SORTEANDO...' : (drawWinner || multiDrawResults) ? 'REGISTRAR Y SELLAR' : 'INICIAR SORTEO'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Raffles;