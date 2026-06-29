export interface Bus {
    id: string | number;
    busName: string;
    busNumber: string;
    busType: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    totalSeats: number;
    availableSeats: number;
    fare: number;
    status: string;
    date?: string;
}

export interface SearchParams {
    from: string;
    to: string;
    date: string;
}