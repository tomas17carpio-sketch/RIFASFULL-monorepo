/**
 * 📦 @rifasfull/core
 * 
 * Paquete centralizado para lógica compartida y conexión a Supabase.
 * 
 * @example
 * ```typescript
 * import { getSupabaseClient } from '@rifasfull/core';
 * 
 * const supabase = getSupabaseClient();
 * const { data, error } = await supabase.from('rifas').select('*');
 * ```
 */

// 🔐 Supabase Client
export { getSupabaseClient, resetSupabaseClient } from './supabase/client.js';

// 📝 Puedes agregar más exports aquí:
// export { ... } from './services/...';
// export { ... } from './utils/...';
