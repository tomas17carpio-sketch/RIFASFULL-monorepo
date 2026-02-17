import { getSupabaseClient } from '../supabase/client';

export interface Ticket {
  id: string;
  raffle_id: string;
  number: string;
  owner?: string;
  created_at: string;
}

export const fetchTicketsByRaffle = async (raffleId: string): Promise<Ticket[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('raffle_id', raffleId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Ticket[];
};

export const createTicket = async (raffleId: string, number: string, owner?: string): Promise<Ticket> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tickets')
    .insert([{ raffle_id: raffleId, number, owner }])
    .select()
    .single();
  if (error) throw error;
  return data as Ticket;
};
