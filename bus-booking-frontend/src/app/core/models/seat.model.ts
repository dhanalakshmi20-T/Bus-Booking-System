export interface SeatLayout {
    seatNumber: string;
    status: 'available' | 'booked' | 'selected' | 'ladies';
    type: 'window' | 'aisle';
    deck?: 'lower' | 'upper';
    section?: 'seat' | 'berth';
}