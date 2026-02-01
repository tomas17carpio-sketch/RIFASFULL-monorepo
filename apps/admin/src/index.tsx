import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getSupabaseClient } from '@rifasfull/core/supabase/client';

// 🔐 Inicializar Supabase al inicio de la aplicación
try {
  const supabase = getSupabaseClient();
  console.log('✅ [ADMIN] Supabase client inicializado correctamente');
} catch (error) {
  console.error('❌ [ADMIN] Error al inicializar Supabase:', error);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);