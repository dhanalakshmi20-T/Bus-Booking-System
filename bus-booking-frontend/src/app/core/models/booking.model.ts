export interface Passenger {
    name: string;
    age: number;
    gender: string;
    seatNumber: string;
}

export interface BusDetails {
    busName: string;
    busNumber?: string;
    busType?: string;
    from: string;
    to: string;
    date: string;
    departureTime?: string;
    arrivalTime?: string;
    fare?: number;
}

export interface UserDetails {
    name: string;
    email: string;
    phone?: string;
}

export interface Booking {
    id: string;
    bookingId?: string;
    userId: string;
    busId: string;
    passengers: Passenger[];
    totalFare: number;
    status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
    bookingDate: string;
    busDetails?: BusDetails;
    userDetails?: UserDetails;
}

export interface BookingRequest {
    busId: string | number;
    passengers: Passenger[];
}

export interface CancelBookingResponse {
    message: string;
    booking?: Booking;
}