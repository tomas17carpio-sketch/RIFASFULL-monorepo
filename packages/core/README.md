# @rifasfull/core

> 🔐 Paquete centralizado para lógica compartida y conexión segura a Supabase

## 📦 Instalación

Este paquete es parte del monorepo y se instala automáticamente:

```bash
npm install
```

## 🚀 Uso Básico

### Cliente Supabase

```typescript
import { getSupabaseClient } from '@rifasfull/core';

// Obtener instancia del cliente
const supabase = getSupabaseClient();

// Realizar queries
const { data, error } = await supabase
  .from('rifas')
  .select('*');

if (error) {
  console.error('Error:', error);
} else {
  console.log('Rifas:', data);
}
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la **raíz del monorepo**:

```env
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
VITE_SUPABASE_ANON_KEY="tu-clave-publica"
VITE_USE_SUPABASE="true"
```

### Obtener Credenciales

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a `Settings → API`
4. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

> ⚠️ **NUNCA uses la `service_role` key en el cliente**

## 🔒 Seguridad

### Validaciones Automáticas

El cliente incluye validación de credenciales:

✅ Verifica que la URL coincida con tu proyecto  
✅ Valida el formato de la clave  
✅ Mensajes de error descriptivos  

### Ejemplo de Error

Si configuras mal las credenciales:

```
❌ FATAL: URL no coincide con tu proyecto Supabase.
📍 URL esperada: https://eqtuoaafmqmgzusrrrhgcx.supabase.co
📍 URL recibida: https://wrong-url.supabase.co
🔍 Verifica tu dashboard: https://supabase.com/dashboard/project/_/api
```

## 🧪 Testing

### Verificar Conexión

```typescript
try {
  const supabase = getSupabaseClient();
  console.log('✅ Conectado a Supabase');
} catch (error) {
  console.error('❌ Error de conexión:', error);
}
```

### Reiniciar Cliente

```typescript
import { resetSupabaseClient } from '@rifasfull/core';

// Útil para testing
resetSupabaseClient();
```

## 📚 API Reference

### `getSupabaseClient()`

Retorna una instancia singleton del cliente Supabase.

**Retorna:** `SupabaseClient`  
**Throws:** `Error` si las credenciales son inválidas

### `resetSupabaseClient()`

Reinicia el cliente Supabase (útil para testing).

**Retorna:** `void`

## 🔧 Troubleshooting

### Error: "Variable VITE_SUPABASE_URL no definida"

**Solución:**
1. Verifica que `.env.local` existe en la raíz del monorepo
2. Reinicia el servidor de desarrollo (`npm run dev:admin` o `npm run dev:client`)

### Error: "URL no coincide con tu proyecto"

**Solución:**
1. Verifica la URL en tu dashboard de Supabase
2. Actualiza `VITE_SUPABASE_URL` en `.env.local`
3. Reinicia el servidor

### Error: "Clave no tiene formato válido"

**Solución:**
1. Ve a `Settings → API → Project API keys`
2. Copia la clave **anon** (no la service_role)
3. Actualiza `VITE_SUPABASE_ANON_KEY` en `.env.local`

## 📝 Notas

- Este paquete usa **Vite** para las variables de entorno (`import.meta.env`)
- Las credenciales se validan en **tiempo de ejecución**
- El cliente es **singleton** (una sola instancia)
- Compatible con **TypeScript** y **JavaScript**

---

**Desarrollado para:** Rifas Fullproject Monorepo  
**Versión:** 1.0.0
