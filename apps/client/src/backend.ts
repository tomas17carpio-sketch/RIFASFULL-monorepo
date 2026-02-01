
import { Raffle, User, Transaction, RafflePrize } from './types';

class MockBackend {
  private static instance: MockBackend;
  
  private constructor() {
    this.init();
  }

  static getInstance() {
    if (!MockBackend.instance) MockBackend.instance = new MockBackend();
    return MockBackend.instance;
  }

  private init() {
    if (!localStorage.getItem('raffles')) {
      const initialRaffles: Raffle[] = [
        { 
          id: '1', 
          name: 'Moto Bera SBR 2024', 
          category: 'Vehículos', 
          price: 5, 
          currency: 'USD', 
          totalTickets: 10000, 
          soldTickets: 8540, 
          endDate: '2025-11-20', 
          status: 'active', 
          imageUrl: 'https://images.unsplash.com/photo-1621285853634-713b8dd6b5ee?auto=format&fit=crop&q=80&w=800&h=600', 
          description: '¡No dejes pasar esta oportunidad!', 
          isPopular: true,
          type: 'single'
        },
        { 
          id: '2', 
          name: 'iPhone 15 Pro Max', 
          category: 'Tecnología', 
          price: 10, 
          currency: 'USD', 
          totalTickets: 5000, 
          soldTickets: 120, 
          endDate: '2025-11-30', 
          status: 'active', 
          imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800&h=600', 
          description: 'El último modelo de Apple.', 
          isNew: true,
          type: 'single'
        },
        {
          id: '3',
          name: 'Gran Rifa Anual 2025',
          category: 'Especial',
          price: 20,
          currency: 'USD',
          totalTickets: 20000,
          soldTickets: 15400,
          endDate: '2025-12-25',
          status: 'active',
          imageUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&q=80&w=800&h=600',
          description: 'Sorteo masivo: 1er Premio Toyota Corolla, 2do Premio Moto Bera, y 10 Bonos de $500.',
          type: 'multi',
          prizes: [
            { rank: 1, label: 'Toyota Corolla 2025' },
            { rank: 2, label: 'Moto Bera SBR' },
            ...Array.from({ length: 10 }).map((_, i) => ({ rank: i + 3, label: `Bono $500 (Premio #${i+1})` }))
          ]
        }
      ];
      localStorage.setItem('raffles', JSON.stringify(initialRaffles));
    }
    if (!localStorage.getItem('transactions')) localStorage.setItem('transactions', JSON.stringify([]));
  }

  getRaffles(): Raffle[] {
    return JSON.parse(localStorage.getItem('raffles') || '[]');
  }

  createRaffle(raffle: Raffle) {
    const raffles = this.getRaffles();
    raffles.unshift(raffle); // Insertar al principio
    localStorage.setItem('raffles', JSON.stringify(raffles));
  }

  getTransactions(): Transaction[] {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
  }

  createTransaction(data: Partial<Transaction> & { ticketCount?: number }) {
    const txs = this.getTransactions();
    const assignedTickets = Array.from({ length: data.ticketCount || 1 }).map(() => 
      Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    );

    const newTx: Transaction = {
      id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      reference: data.reference || '',
      bank: data.bank || '',
      user: data.user || 'Anónimo',
      amount: data.amount || 0,
      iaScore: 95,
      status: 'approved',
      date: new Date().toLocaleDateString(),
      avatar: `https://picsum.photos/seed/${data.user}/100`,
      tickets: assignedTickets,
      raffleId: data.raffleId
    };

    txs.unshift(newTx);
    localStorage.setItem('transactions', JSON.stringify(txs));
    
    const raffles = this.getRaffles();
    const rIdx = raffles.findIndex(r => r.id === data.raffleId);
    if (rIdx !== -1) {
      raffles[rIdx].soldTickets += assignedTickets.length;
      localStorage.setItem('raffles', JSON.stringify(raffles));
    }

    return newTx;
  }

  executeRaffleDraw(raffleId: string): Raffle | null {
    const raffles = this.getRaffles();
    const rIdx = raffles.findIndex(r => r.id === raffleId);
    if (rIdx === -1) return null;
    const raffle = raffles[rIdx];

    const transactions = this.getTransactions().filter(t => t.raffleId === raffleId && t.status === 'approved');
    let pool: { ticket: string, user: string }[] = [];
    transactions.forEach(tx => tx.tickets.forEach(t => pool.push({ ticket: t, user: tx.user })));

    if (pool.length === 0) {
      for(let i=0; i<100; i++) pool.push({ ticket: Math.floor(Math.random() * 10000).toString().padStart(4, '0'), user: `Participante Demo ${i+1}` });
    }

    pool = pool.sort(() => Math.random() - 0.5);

    if (raffle.type === 'multi' && raffle.prizes) {
      raffle.prizes = raffle.prizes.map((prize, idx) => ({
        ...prize,
        winningTicket: pool[idx]?.ticket || '0000',
        winnerUser: pool[idx]?.user || 'Casa'
      }));
      raffle.winnerUser = raffle.prizes[0].winnerUser;
      raffle.winningTicket = raffle.prizes[0].winningTicket;
    } else {
      raffle.winnerUser = pool[0].user;
      raffle.winningTicket = pool[0].ticket;
    }

    raffle.status = 'completed';
    localStorage.setItem('raffles', JSON.stringify(raffles));
    return raffle;
  }

  approveTransaction(id: string) {
    const txs = this.getTransactions();
    const tx = txs.find(t => t.id === id);
    if (tx) tx.status = 'approved';
    localStorage.setItem('transactions', JSON.stringify(txs));
  }

  deleteTransaction(id: string) {
    const txs = this.getTransactions();
    localStorage.setItem('transactions', JSON.stringify(txs.filter(t => t.id !== id)));
  }
}

export const backend = MockBackend.getInstance();
