//packages/shared-type/index.ts
export interface Rifa {
    id: string;
    nombre: string;
    descripcion: string;
    precioTicket: number;
    totalTickets: number;
    ticketsVendidos: number;
    estado: 'activa' | 'finalizada' | 'pausada';
}

export interface Ticket {
    id: string;
    rifaId: string;
    numero: number;
    propietario?: string;
    pagado: boolean;
}