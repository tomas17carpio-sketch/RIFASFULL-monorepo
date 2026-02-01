import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Raffles from './pages/Raffles';
import Security from './pages/Security';
import Finance from './pages/Finance';
import RaffleDetail from './pages/RaffleDetail';
import Login from './pages/Login';

// --- Winners Logic (Live Sync) ---
export interface WinnerRecord {
    id: number;
    userName: string;
    userAvatar?: string;
    ticketNumber: string;
    raffleName: string;
    prizeImage: string;
    date: string;
}

interface WinnersContextType {
    recentWinners: WinnerRecord[];
    addWinner: (winner: WinnerRecord) => void;
}

const WinnersContext = createContext<WinnersContextType>({
    recentWinners: [],
    addWinner: () => {}
});

export const useWinners = () => useContext(WinnersContext);

const WinnersProvider = ({ children }: { children?: React.ReactNode }) => {
    const [recentWinners, setRecentWinners] = useState<WinnerRecord[]>(() => {
        const saved = localStorage.getItem('global_winners');
        return saved ? JSON.parse(saved) : [
            {
                id: 101,
                userName: "Sofia Ramirez",
                ticketNumber: "1092",
                raffleName: "PlayStation 5",
                prizeImage: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2070&auto=format&fit=crop",
                date: "15 Oct 2023"
            }
        ];
    });

    // Sincronización automática entre pestañas del dispositivo
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'global_winners' && e.newValue) {
                setRecentWinners(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addWinner = (winner: WinnerRecord) => {
        const updated = [winner, ...recentWinners];
        setRecentWinners(updated);
        localStorage.setItem('global_winners', JSON.stringify(updated));
    };

    return (
        <WinnersContext.Provider value={{ recentWinners, addWinner }}>
            {children}
        </WinnersContext.Provider>
    );
};

// --- Notification Logic ---
export interface AppNotification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    timestamp: string;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    addNotification: () => {},
    markAsRead: () => {},
    markAllAsRead: () => {},
    clearNotifications: () => {}
});

export const useNotifications = () => useContext(NotificationContext);

const NotificationProvider = ({ children }: { children?: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (notifications.length === 0) {
                addNotification('Sincronización Exitosa', 'El dispositivo actual está vinculado y recibiendo actualizaciones en vivo.', 'success');
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const addNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
        const newNotif: AppNotification = {
            id: Date.now(),
            title,
            message,
            type,
            read: false,
            timestamp: 'Ahora'
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

// --- Theme Logic ---
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme;
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const SidebarItem = ({ to, icon, label, active }: { to: string; icon: string; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      active
        ? 'bg-primary/10 text-primary'
        : 'text-slate-500 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#283039] hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    <span className={`material-symbols-outlined ${active ? 'material-symbols-filled' : ''}`}>{icon}</span>
    <p className="text-sm font-medium leading-normal">{label}</p>
  </Link>
);

const Layout = ({ children, onLogout }: { children?: React.ReactNode, onLogout: () => void }) => {
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300 font-display">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#111418] border-r border-slate-200 dark:border-[#283039] flex-col justify-between h-full">
        <div className="flex flex-col gap-4 p-4 h-full">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200 dark:border-slate-700"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGCBDg-tJpImFn8cLrqYLfoIg9vO_i6_zbbDU8Hvy1oDEaF6ImvJe57XY2nqS63c8zESQJxs7UHvZFtyZHQJAvd6_x_4yDaAtQZB9sVlapRXb2yIEYcpbv_Xznv5YvilwfEJvbxJSWAVh5PDXFz71mpnLmVapFAbE9Ew9oxwHxrin5E87G3dP9zLQdvIqRZij3Xucw0QxN9f4wKDkZsr7oer6FQegzzJaUxgZV-IsfPbzVCAOaACfyPpm9mLVauiN4TsUxJtJfJfg")' }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">ADMINPROJECT</h1>
              <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Dispositivo Sincronizado</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
            <SidebarItem to="/" icon="dashboard" label="Dashboard" active={location.pathname === '/'} />
            <SidebarItem to="/users" icon="group" label="Usuarios" active={location.pathname === '/users'} />
            <SidebarItem to="/raffles" icon="confirmation_number" label="Rifas" active={location.pathname === '/raffles'} />
            <SidebarItem to="/finance" icon="payments" label="Finanzas" active={location.pathname === '/finance'} />
            <SidebarItem to="/security" icon="security" label="Seguridad" active={location.pathname === '/security'} />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-[#283039]">
             <button
               onClick={toggleTheme}
               className="flex items-center gap-3 px-3 py-2 w-full text-slate-500 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#283039] hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors mb-2"
             >
               <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
               <p className="text-sm font-medium leading-normal">{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</p>
             </button>
            <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-3 px-3 py-2 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              <p className="text-sm font-medium leading-normal">Salir</p>
            </button>
          </div>
        </div>
      </aside>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                        <span className="material-symbols-outlined">logout</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Cerrar Sesión</h3>
                        <p className="text-slate-500 text-sm">¿Desea cerrar la sesión sincronizada?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <button onClick={() => setIsLogoutModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700">Cancelar</button>
                        <button onClick={() => { setIsLogoutModalOpen(false); onLogout(); }} className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <main className="flex-1 overflow-hidden relative w-full lg:ml-0">
         <div className="flex-1 h-full overflow-y-auto pb-20 lg:pb-0 scroll-smooth">
            {children}
         </div>
      </main>
    </div>
  );
};

const ProtectedRoute = ({ isAuthenticated, children, onLogout }: { isAuthenticated: boolean; children?: React.ReactNode; onLogout: () => void; }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout onLogout={onLogout}>{children}</Layout>;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('isAuth') === 'true');

  const handleLogin = () => {
      setIsAuthenticated(true);
      localStorage.setItem('isAuth', 'true');
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('isAuth');
  };

  return (
    <ThemeProvider>
      <NotificationProvider>
        <WinnersProvider>
            <HashRouter>
                <Routes>
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
                <Route path="/public" element={<RaffleDetail />} />
                <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}><Dashboard /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}><Users /></ProtectedRoute>} />
                <Route path="/raffles" element={<ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}><Raffles /></ProtectedRoute>} />
                <Route path="/security" element={<ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}><Security /></ProtectedRoute>} />
                <Route path="/finance" element={<ProtectedRoute isAuthenticated={isAuthenticated} onLogout={handleLogout}><Finance /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </HashRouter>
        </WinnersProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;