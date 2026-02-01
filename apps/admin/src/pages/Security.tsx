import React, { useState, useEffect } from 'react';
import { useNotifications } from '../App';

interface AlertLog {
    id: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
    source: string;
}

const Security = () => {
    const { addNotification: addGlobalNotification } = useNotifications();
    const [sensitivity, setSensitivity] = useState(65);
    const [isMonitoring, setIsMonitoring] = useState(true);

    // Estado para logs de alertas en vivo (simulando backend)
    const [liveAlerts, setLiveAlerts] = useState<AlertLog[]>([
        { id: 1, severity: 'low', message: 'Escaneo de puertos rutinario detectado', timestamp: 'Hace 5 min', source: 'Firewall' },
        { id: 2, severity: 'medium', message: 'Intento de login inusual (User #44)', timestamp: 'Hace 12 min', source: 'Stitch AI' },
    ]);

    const auditLogs = [
        { id: 1, action: 'Cambio de Sensibilidad IA', user: 'Admin Principal', time: 'Hace 10 min', details: 'Ajustado de 50% a 65%', icon: 'tune' },
        { id: 2, action: 'Bloqueo de IP Manual', user: 'Admin Principal', time: 'Hace 45 min', details: 'IP 192.168.1.55 bloqueada por actividad sospechosa', icon: 'block' },
        { id: 3, action: 'Exportación de Logs', user: 'Auditor Externo', time: 'Hace 2 horas', details: 'Reporte mensual de seguridad descargado', icon: 'download' },
        { id: 4, action: 'Inicio de Sesión Fallido', user: 'Sistema', time: 'Hace 5 horas', details: '3 intentos fallidos desde 10.0.0.1', icon: 'warning' },
        { id: 5, action: 'Actualización de Protocolo', user: 'Admin Principal', time: 'Hace 1 día', details: 'TLS 1.2 desactivado, forzado TLS 1.3', icon: 'security_update' },
    ];

    const handleExportAuditCSV = () => {
        // Definir encabezados basados en las columnas visibles
        const headers = ["Acción", "Usuario", "Detalle", "Tiempo"];
        
        // Mapear datos a filas CSV
        const rows = auditLogs.map(log => [
            `"${log.action}"`,
            `"${log.user}"`,
            `"${log.details}"`,
            `"${log.time}"`
        ]);

        // Unir encabezados y filas
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Crear blob con BOM para correcta visualización de caracteres especiales en Excel
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'historial_auditoria.csv');
        document.body.appendChild(link);
        link.click();
        
        // Limpieza
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Función para simular una alerta crítica de IA
    const triggerSimulatedAlert = () => {
        const newAlert: AlertLog = {
            id: Date.now(),
            severity: 'critical',
            message: 'Ataque de Fuerza Bruta Detectado',
            timestamp: 'Ahora mismo',
            source: 'Stitch AI Core'
        };

        setLiveAlerts(prev => [newAlert, ...prev]);
        
        // Disparar notificación global al Dashboard
        addGlobalNotification('Alerta de Seguridad', 'Se ha bloqueado un ataque de fuerza bruta desde IP 185.x.x.x', 'error');
    };

    // Efecto para simular monitoreo activo al cargar la página
    useEffect(() => {
        const timer = setTimeout(() => {
            // Simular una alerta automática a los 3 segundos
            triggerSimulatedAlert();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const getSeverityStyles = (severity: string) => {
        switch(severity) {
            case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
            case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
        }
    };

    const getActionIconStyle = (icon: string) => {
        switch (icon) {
            case 'block':
            case 'warning':
                return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
            case 'tune':
            case 'security_update':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            case 'download':
                return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400';
            default:
                return 'bg-slate-100 text-slate-500 dark:bg-[#111418] dark:text-[#9dabb9]';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f6f7f8] dark:bg-[#111418] text-slate-900 dark:text-white relative">
            
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div className="flex flex-col gap-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">Centro de Seguridad</h2>
                            {isMonitoring && (
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 dark:text-[#9dabb9] text-base leading-relaxed">
                            Gestione los protocolos bancarios, defina reglas de detección de anomalías y configure la integración predictiva de Stitch AI.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={triggerSimulatedAlert}
                            className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 font-bold transition-all border border-red-200 dark:border-red-800"
                        >
                            <span className="material-symbols-outlined text-[20px]">bug_report</span>
                            <span>Simular Amenaza</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-[0_0_15px_rgba(19,127,236,0.3)]">
                            <span className="material-symbols-outlined text-[20px]">save</span>
                            <span>Guardar Cambios</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Security Banking */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-[#283039]">
                            <span className="material-symbols-outlined text-primary">lock_person</span>
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Seguridad Bancaria</h3>
                        </div>
                        <div className="bg-white dark:bg-[#1c252e] rounded-xl p-5 border border-slate-200 dark:border-[#283039]">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-slate-900 dark:text-white font-semibold text-sm">Protocolo de Encriptación</h4>
                                    <p className="text-slate-500 dark:text-[#9dabb9] text-xs mt-1">Nivel actual de protección SSL/TLS</p>
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">verified_user</span> TLS 1.3 ACTIVO
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-[#111418] rounded-full h-2 overflow-hidden"><div className="bg-emerald-500 h-2 w-full"></div></div>
                        </div>
                        <div className="bg-white dark:bg-[#1c252e] rounded-xl p-5 border border-slate-200 dark:border-[#283039] flex flex-col gap-4">
                            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-1">Autenticación en 2 Pasos (2FA)</h4>
                            {[
                                { label: 'Administradores', sub: 'Obligatorio para acceso al panel' },
                                { label: 'Usuarios', sub: 'Requerido para retiros > $100' }
                            ].map((s, i) => (
                                <label key={i} className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex flex-col"><span className="text-slate-900 dark:text-white text-sm">{s.label}</span><span className="text-slate-500 dark:text-[#9dabb9] text-xs">{s.sub}</span></div>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 dark:bg-[#283039] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* AI Anomaly */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-[#283039]">
                            <span className="material-symbols-outlined text-primary">neurology</span>
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Detección de Anomalías (IA)</h3>
                        </div>
                        <div className="bg-white dark:bg-[#1c252e] rounded-xl p-6 border border-slate-200 dark:border-[#283039] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                                <span className="material-symbols-outlined text-6xl text-primary">waves</span>
                            </div>
                            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4">Sensibilidad del Modelo</h4>
                            <div className="flex justify-between text-xs text-slate-500 dark:text-[#9dabb9] mb-2 font-medium"><span>Baja</span><span className="text-slate-900 dark:text-white">Moderada</span><span>Alta</span></div>
                            <input 
                                className="w-full h-2 bg-slate-200 dark:bg-[#283039] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary" 
                                type="range" min="1" max="100" 
                                value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} 
                            />
                            <p className="text-slate-500 dark:text-[#9dabb9] text-xs mt-3 leading-tight"><span className="text-primary font-bold">Nivel {sensitivity}%:</span> Se marcarán transacciones que se desvíen más del {100-sensitivity}% del patrón histórico.</p>
                        </div>
                         <div className="bg-white dark:bg-[#1c252e] rounded-xl border border-slate-200 dark:border-[#283039] flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-200 dark:border-[#283039] flex justify-between items-center bg-slate-50 dark:bg-[#232d38]">
                                <h4 className="text-slate-900 dark:text-white font-semibold text-sm">Feed de Alertas en Vivo</h4>
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-500 rounded uppercase">Live</span>
                            </div>
                             <div className="max-h-[200px] overflow-y-auto">
                                {liveAlerts.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-slate-500">Sin alertas recientes</div>
                                ) : (
                                    liveAlerts.map((alert) => (
                                        <div key={alert.id} className="p-4 border-b border-slate-100 dark:border-[#283039] last:border-0 hover:bg-slate-50 dark:hover:bg-[#283039]/50 transition-colors animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-0.5 ${alert.severity === 'critical' ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {alert.severity === 'critical' ? 'gpp_bad' : 'warning'}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${getSeverityStyles(alert.severity)}`}>
                                                            {alert.severity}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                                                    </div>
                                                    <p className="text-slate-900 dark:text-white text-xs font-medium mt-1">{alert.message}</p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">Fuente: {alert.source}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                             </div>
                         </div>
                    </div>

                    {/* Stitch AI */}
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-[#283039]">
                            <span className="material-symbols-outlined text-primary">hub</span>
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Integración Stitch AI</h3>
                        </div>
                         <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-[#1c252e] dark:to-[#16202a] rounded-xl p-5 border border-slate-700 dark:border-[#283039] shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span></span>
                                    <span className="text-white font-bold text-sm">Conectado a Stitch Core</span>
                                </div>
                                <span className="text-[10px] text-[#9dabb9] bg-white/10 dark:bg-[#111418] px-2 py-1 rounded">v2.4.1</span>
                            </div>
                            <div className="bg-white/5 dark:bg-[#1c252e] rounded-xl border border-white/10 dark:border-[#283039] flex flex-col flex-1 min-h-[250px] max-h-[250px] overflow-y-auto p-4 space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-red-500 text-[16px]">gavel</span></div>
                                    <div className="flex flex-col"><span className="text-white text-xs font-medium">Cuenta bloqueada: User #8821</span><span className="text-[#9dabb9] text-[10px]">Stitch AI detectó múltiples fallos de login.</span></div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-primary text-[16px]">smart_toy</span></div>
                                    <div className="flex flex-col"><span className="text-white text-xs font-medium">Regla actualizada: IP Risk</span><span className="text-[#9dabb9] text-[10px]">Sensibilidad ajustada automáticamente.</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audit History Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#283039]">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">history</span>
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Historial de Auditoría</h3>
                        </div>
                        <button 
                            onClick={handleExportAuditCSV}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1c252e] border border-slate-200 dark:border-[#283039] hover:bg-slate-50 dark:hover:bg-[#283039] transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            Exportar CSV
                        </button>
                    </div>
                    
                    <div className="bg-white dark:bg-[#1c252e] rounded-xl border border-slate-200 dark:border-[#283039] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-[#232d38] text-slate-500 dark:text-[#9dabb9] border-b border-slate-200 dark:border-[#283039]">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Acción</th>
                                        <th className="px-6 py-4 font-semibold">Usuario</th>
                                        <th className="px-6 py-4 font-semibold">Detalle</th>
                                        <th className="px-6 py-4 font-semibold text-right">Tiempo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-[#283039]">
                                    {auditLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-[#283039]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${getActionIconStyle(log.icon)}`}>
                                                        <span className="material-symbols-outlined text-[20px]">{log.icon}</span>
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-white">{log.action}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                        {log.user.charAt(0)}
                                                    </div>
                                                    {log.user}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-[#9dabb9] max-w-md truncate">{log.details}</td>
                                            <td className="px-6 py-4 text-right text-slate-400 dark:text-slate-500 text-xs font-mono">{log.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-slate-200 dark:border-[#283039] bg-slate-50 dark:bg-[#232d38] flex justify-center">
                            <button className="text-sm font-bold text-primary hover:text-blue-600 transition-colors">Ver historial completo</button>
                        </div>
                    </div>
               </div>
            </div>
        </div>
    );
};

export default Security;