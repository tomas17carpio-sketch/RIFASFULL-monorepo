// Export del cliente Supabase
export { getSupabaseClient } from './supabase/client';

// Export de servicios - CORREGIDO
export * as raffleService from './services/raffle.service';
export * as ticketService from './services/ticket.service';

// Reexportar tipos para conveniencia
export type { Raffle } from '@rifasfull/shared-types';
