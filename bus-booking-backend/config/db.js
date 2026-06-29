const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const formatDate = daysFromToday => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const createSeats = totalSeats =>
  Array.from({ length: totalSeats }, (_, index) => ({
    seatNumber: String(index + 1),
    isBooked: false
  }));

const createBus = data => ({
  _id: uuidv4(),
  status: 'ACTIVE',
  availableSeats: data.totalSeats,
  seats: createSeats(data.totalSeats),
  createdAt: new Date(),
  ...data
});

const buses = [
  createBus({
    busName: 'Royal Travels',
    busNumber: 'TN01AB1234',
    busType: 'AC',
    from: 'Chennai',
    to: 'Bangalore',
    date: formatDate(1),
    departureTime: '06:00',
    arrivalTime: '11:00',
    fare: 350,
    totalSeats: 40
  }),

  createBus({
    busName: 'Sri Murugan Travels',
    busNumber: 'TN02CD5678',
    busType: 'Non-AC',
    from: 'Chennai',
    to: 'Bangalore',
    date: formatDate(1),
    departureTime: '08:30',
    arrivalTime: '14:00',
    fare: 220,
    totalSeats: 45
  }),

  createBus({
    busName: 'Orange Travels',
    busNumber: 'KA03EF9012',
    busType: 'Sleeper',
    from: 'Chennai',
    to: 'Bangalore',
    date: formatDate(1),
    departureTime: '21:00',
    arrivalTime: '05:00',
    fare: 550,
    totalSeats: 36
  }),

  createBus({
    busName: 'VRL Travels',
    busNumber: 'KA04GH3456',
    busType: 'AC',
    from: 'Bangalore',
    to: 'Hyderabad',
    date: formatDate(2),
    departureTime: '08:00',
    arrivalTime: '16:00',
    fare: 600,
    totalSeats: 40
  }),

  createBus({
    busName: 'Green Line',
    busNumber: 'MH05IJ7890',
    busType: 'Semi-Sleeper',
    from: 'Mumbai',
    to: 'Pune',
    date: formatDate(3),
    departureTime: '07:00',
    arrivalTime: '10:30',
    fare: 250,
    totalSeats: 40
  })
];

const adminId = uuidv4();

module.exports = {
  users: [
    {
      _id: adminId,
      name: 'Admin',
      email: 'admin@busbook.com',
      password: bcrypt.hashSync('admin123', 10),
      phone: '9999999999',
      role: 'admin',
      status: 'ACTIVE',
      createdAt: new Date()
    }
  ],
  buses,
  bookings: []
};