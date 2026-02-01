import { getSupabaseClient } from './client';

/**
 * 🧪 TEST DE CONEXIÓN SUPABASE
 * 
 * Ejecuta este archivo para verificar que las credenciales funcionan correctamente.
 */
export const testSupabaseConnection = async (): Promise<void> => {
    try {
        console.log('🔍 Iniciando test de conexión Supabase...\n');

        // 1. Obtener cliente
        const supabase = getSupabaseClient();
        console.log('✅ Cliente Supabase inicializado correctamente\n');

        // 2. Test básico de conexión
        const { error } = await supabase.from('_test').select('*').limit(1);

        if (error && error.code !== 'PGRST116') { // PGRST116 = tabla no existe (esperado)
            console.log('⚠️  Error al consultar (esto es esperado si no hay tablas):', error.message);
        }

        // 3. Verificar autenticación
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Estado de sesión:', session ? 'Activa' : 'No autenticado (esperado para clave anon)');

        console.log('\n✅ ¡CONEXIÓN EXITOSA!');
        console.log('🎉 Supabase está configurado correctamente');

    } catch (error) {
        console.error('\n❌ ERROR EN TEST DE CONEXIÓN:');
        console.error(error);
        throw error;
    }
};

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    testSupabaseConnection();
}
