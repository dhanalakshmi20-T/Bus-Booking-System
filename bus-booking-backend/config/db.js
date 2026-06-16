const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const adminPassword = bcrypt.hashSync('admin123', 10);

const adminId = uuidv4();

const buses = [
  {
    _id: uuidv4(),
    busName: 'Express Travels',
    from: 'Chennai',
    to: 'Bangalore',
    date: '2026-06-20',
    departureTime: '06:00',
    arrivalTime: '12:00',
    fare: 450,
    totalSeats: 40,
    seats: Array.from({ length: 40 }, (_, i) => ({ seatNumber: `${i + 1}`, isBooked: false })),
    createdAt: new Date()
  },
  {
    _id: uuidv4(),
    busName: 'Royal Cruiser',
    from: 'Bangalore',
    to: 'Hyderabad',
    date: '2026-06-20',
    departureTime: '08:30',
    arrivalTime: '16:30',
    fare: 600,
    totalSeats: 36,
    seats: Array.from({ length: 36 }, (_, i) => ({ seatNumber: `${i + 1}`, isBooked: false })),
    createdAt: new Date()
  },
  {
    _id: uuidv4(),
    busName: 'Green Line',
    from: 'Mumbai',
    to: 'Pune',
    date: '2026-06-21',
    departureTime: '07:00',
    arrivalTime: '10:30',
    fare: 250,
    totalSeats: 44,
    seats: Array.from({ length: 44 }, (_, i) => ({ seatNumber: `${i + 1}`, isBooked: false })),
    createdAt: new Date()
  },
  {
    _id: uuidv4(),
    busName: 'Star Bus',
    from: 'Delhi',
    to: 'Jaipur',
    date: '2026-06-22',
    departureTime: '09:00',
    arrivalTime: '14:00',
    fare: 380,
    totalSeats: 40,
    seats: Array.from({ length: 40 }, (_, i) => ({ seatNumber: `${i + 1}`, isBooked: false })),
    createdAt: new Date()
  },
  {
    _id: uuidv4(),
    busName: 'Coastal Express',
    from: 'Chennai',
    to: 'Coimbatore',
    date: '2026-06-23',
    departureTime: '22:00',
    arrivalTime: '05:00',
    fare: 500,
    totalSeats: 40,
    seats: Array.from({ length: 40 }, (_, i) => ({ seatNumber: `${i + 1}`, isBooked: false })),
    createdAt: new Date()
  }
];

const db = {
  users: [
    {
      _id: adminId,
      name: 'Admin',
      email: 'admin@busbook.com',
      password: adminPassword,
      phone: '9999999999',
      role: 'admin',
      createdAt: new Date()
    }
  ],
  buses,
  bookings: []
};

module.exports = db;
