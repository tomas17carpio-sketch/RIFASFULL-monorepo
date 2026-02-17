
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

const SidebarItem = ({ to, icon, label, active, onClick }: { to: string; icon: string; label: string; active: boolean; onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active
        ? 'bg-primary text-white shadow-lg shadow-primary/20'
        : 'text-slate-500 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#283039] hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    <span className={`material-symbols-outlined text-[22px] ${active ? 'material-symbols-filled' : ''}`}>{icon}</span>
    <p className="text-sm font-bold tracking-tight">{label}</p>
  </Link>
);

const Layout = ({ children, onLogout }: { children?: React.ReactNode, onLogout: () => void }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-300 font-display">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] h-16 bg-white/80 dark:bg-[#111418]/80 backdrop-blur-xl border-b border-slate-200 dark:border-[#283039] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-white"
              >
                  <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="text-slate-900 dark:text-white text-base font-black tracking-tighter">ADMINPROJECT</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center text-slate-500"
          >
            <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
      </div>

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div 
            className="lg:hidden fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR (Responsive) */}
      <aside className={`
        fixed inset-y-0 left-0 z-[80] w-72 bg-white dark:bg-[#111418] border-r border-slate-200 dark:border-[#283039] flex-col h-full shadow-xl transition-transform duration-300
        lg:translate-x-0 lg:static lg:flex
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col gap-6 p-6 h-full">
          <div className="flex items-center justify-between lg:justify-start gap-4 px-2 mb-4">
            <div className="flex items-center gap-3">
                <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-10 border-2 border-primary/20 shadow-inner"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGCBDg-tJpImFn8cLrqYLfoIg9vO_i6_zbbDU8Hvy1oDEaF6ImvJe57XY2nqS63c8zESQJxs7UHvZFtyZHQJAvd6_x_4yDaAtQZB9sVlapRXb2yIEYcpbv_Xznv5YvilwfEJvbxJSWAVh5PDXFz71mpnLmVapFAbE9Ew9oxwHxrin5E87G3dP9zLQdvIqRZij3Xucw0QxN9f4wKDkZsr7oer6FQegzzJaUxgZV-IsfPbzVCAOaACfyPpm9mLVauiN4TsUxJtJfJfg")' }}
                ></div>
                <h1 className="text-slate-900 dark:text-white text-lg font-black tracking-tighter leading-none">ADMINPROJECT</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
                <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">Menú Principal</p>
            <SidebarItem to="/" icon="grid_view" label="Escritorio" active={location.pathname === '/'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/users" icon="person_search" label="Usuarios" active={location.pathname === '/users'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/raffles" icon="confirmation_number" label="Gestión de Rifas" active={location.pathname === '/raffles'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/finance" icon="account_balance_wallet" label="Finanzas" active={location.pathname === '/finance'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarItem to="/security" icon="admin_panel_settings" label="Seguridad Avanzada" active={location.pathname === '/security'} onClick={() => setIsSidebarOpen(false)} />
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-[#283039] space-y-2">
             <button
               onClick={toggleTheme}
               className="hidden lg:flex items-center gap-3 px-4 py-3 w-full text-slate-500 dark:text-[#9dabb9] hover:bg-slate-100 dark:hover:bg-[#283039] hover:text-slate-900 dark:hover:text-white rounded-xl transition-all duration-200"
             >
               <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
               <p className="text-sm font-bold tracking-tight">{theme === 'dark' ? 'Apariencia Clara' : 'Apariencia Oscura'}</p>
             </button>
            <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-200"
            >
              <span className="material-symbols-outlined">power_settings_new</span>
              <p className="text-sm font-bold tracking-tight">Cerrar Sesión</p>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-hidden relative w-full flex flex-col pt-16 lg:pt-0 pb-20 lg:pb-0">
         <div className="flex-1 h-full overflow-y-auto scroll-smooth no-scrollbar">
            {children}
         </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-20 bg-white dark:bg-[#111418] border-t border-slate-200 dark:border-[#283039] px-4 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-primary' : 'text-slate-400'}`}>
              <span className={`material-symbols-outlined ${location.pathname === '/' ? 'material-symbols-filled' : ''}`}>grid_view</span>
              <span className="text-[10px] font-bold uppercase">Panel</span>
          </Link>
          <Link to="/raffles" className={`flex flex-col items-center gap-1 ${location.pathname === '/raffles' ? 'text-primary' : 'text-slate-400'}`}>
              <span className={`material-symbols-outlined ${location.pathname === '/raffles' ? 'material-symbols-filled' : ''}`}>confirmation_number</span>
              <span className="text-[10px] font-bold uppercase">Rifas</span>
          </Link>
          <div className="relative -top-6">
              <Link to="/finance" className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30">
                  <span className="material-symbols-outlined">payments</span>
              </Link>
          </div>
          <Link to="/users" className={`flex flex-col items-center gap-1 ${location.pathname === '/users' ? 'text-primary' : 'text-slate-400'}`}>
              <span className={`material-symbols-outlined ${location.pathname === '/users' ? 'material-symbols-filled' : ''}`}>groups</span>
              <span className="text-[10px] font-bold uppercase">Usuarios</span>
          </Link>
          <Link to="/security" className={`flex flex-col items-center gap-1 ${location.pathname === '/security' ? 'text-primary' : 'text-slate-400'}`}>
              <span className={`material-symbols-outlined ${location.pathname === '/security' ? 'material-symbols-filled' : ''}`}>shield</span>
              <span className="text-[10px] font-bold uppercase">Seguridad</span>
          </Link>
      </nav>

      {/* LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700 p-8 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                        <span className="material-symbols-outlined text-3xl">logout</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">¿Finalizar Sesión?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Se desconectará el panel de administración actual.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button onClick={() => setIsLogoutModalOpen(false)} className="h-12 rounded-xl text-sm font-black border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors dark:text-white">Cancelar</button>
                        <button onClick={() => { setIsLogoutModalOpen(false); onLogout(); }} className="h-12 rounded-xl text-sm font-black bg-red-500 text-white shadow-lg shadow-red-500/20">Salir</button>
                    </div>
                </div>
            </div>
        </div>
      )}
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
