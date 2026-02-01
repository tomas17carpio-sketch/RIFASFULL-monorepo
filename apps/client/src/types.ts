
export interface RafflePrize {
  rank: number;
  label: string; // Ej: "1er Premio - Camioneta", "2do Premio - Moto", "Bono $500"
  winningTicket?: string;
  winnerUser?: string;
}

export interface Raffle {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  totalTickets: number;
  soldTickets: number;
  endDate: string;
  status: 'active' | 'paused' | 'draft' | 'completed';
  imageUrl: string;
  description: string;
  isPopular?: boolean;
  isNew?: boolean;
  type?: 'single' | 'multi'; 
  prizes?: RafflePrize[];    
  winningTicket?: string;    
  winnerUser?: string;       
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended' | 'review';
  riskScore: number;
  lastActivity: string;
  lastAction: string;
  avatar: string;
  registeredAt: string;
}

export interface Transaction {
  id: string;
  reference: string;
  bank: string;
  user: string;
  amount: number;
  iaScore: number;
  status: 'approved' | 'pending' | 'review' | 'conciliated' | 'fraud';
  date: string;
  avatar: string;
  tickets: string[];
  raffleId?: string;
}
