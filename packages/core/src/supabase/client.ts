import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * 🔐 CLIENTE SUPABASE SINGLETON
 * 
 * Inicializa y retorna una única instancia del cliente Supabase.
 * Incluye validación robusta de credenciales para prevenir errores de configuración.
 * 
 * @throws {Error} Si las credenciales no coinciden con el proyecto
 * @returns {SupabaseClient} Instancia del cliente Supabase
 */
export const getSupabaseClient = (): SupabaseClient => {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // ✅ VALIDACIÓN 1: URL del proyecto
    if (!url) {
        throw new Error(
            `❌ FATAL: Variable VITE_SUPABASE_URL no definida.\n` +
            `📍 Verifica que existe el archivo .env.local en la raíz del monorepo.\n` +
            `🔍 Debe contener: VITE_SUPABASE_URL="https://eqtuoaafmqmgzusrrrhgcx.supabase.co"`
        );
    }

    if (!url.includes('eqtuoaafmqmgzusrrrhgcx.supabase.co')) {
        throw new Error(
            `❌ FATAL: URL no coincide con tu proyecto Supabase.\n` +
            `📍 URL esperada: https://eqtuoaafmqmgzusrrrhgcx.supabase.co\n` +
            `📍 URL recibida: ${url}\n` +
            `🔍 Verifica tu dashboard: https://supabase.com/dashboard/project/_/api`
        );
    }

    // ✅ VALIDACIÓN 2: Clave pública/anon
    if (!key) {
        throw new Error(
            `❌ FATAL: Variable VITE_SUPABASE_ANON_KEY no definida.\n` +
            `📍 Verifica que existe el archivo .env.local en la raíz del monorepo.\n` +
            `🔍 Debe contener: VITE_SUPABASE_ANON_KEY="sb_publishable_..."`
        );
    }

    if (!key.startsWith('sb_publishable_') && !key.startsWith('eyJ')) {
        throw new Error(
            `❌ FATAL: Clave no tiene formato válido.\n` +
            `📍 Debe empezar con: sb_publishable_ o eyJ\n` +
            `📍 Tu clave actual empieza con: ${key.substring(0, 20)}...\n` +
            `🔍 Verifica en Settings → API → Project API keys (anon/public key)`
        );
    }

    // ✅ INICIALIZACIÓN
    try {
        supabaseInstance = createClient(url, key);
        console.log(
            `%c✅ Supabase Client Inicializado`,
            'background: #10B981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
            '\n📍 Proyecto:', url.replace('https://', '').split('.')[0],
            '\n🔑 Clave:', key.substring(0, 25) + '...'
        );
        return supabaseInstance;
    } catch (error) {
        throw new Error(
            `❌ FATAL: Error al inicializar Supabase.\n` +
            `📍 Error: ${error instanceof Error ? error.message : String(error)}\n` +
            `🔍 Verifica que las credenciales son correctas`
        );
    }
};

/**
 * 🔄 REINICIAR CLIENTE
 * 
 * Útil para testing o cuando necesitas forzar una reconexión.
 */
export const resetSupabaseClient = (): void => {
    supabaseInstance = null;
    console.log('🔄 Supabase client reiniciado');
};
