import { getSupabaseClient } from '../supabase/client';

export interface Raffle {
  id: string;
  title: string;
  description?: string;
  price: number;
  total_tickets: number;
  available_tickets: number;
  status: string;
  created_at: string;
}

export interface RaffleCreateData {
  title: string;
  description?: string;
  price: number;
  total_tickets: number;
  image_url?: string;
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
}

export const fetchRaffles = async (): Promise<Raffle[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('raffles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Raffle[];
};

export const createRaffle = async (raffleData: RaffleCreateData): Promise<Raffle> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('raffles')
    .insert([{
      ...raffleData,
      available_tickets: raffleData.total_tickets,
      status: raffleData.status || 'draft'
    }])
    .select()
    .single();
  if (error) throw error;
  return data as Raffle;
};
