const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

exports.createBooking = async (req, res) => {
    try {
        const { busId, passengers } = req.body;
        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });

        const seatNumbers = passengers.map(p => p.seatNumber);
        const alreadyBooked = bus.seats.filter(s => seatNumbers.includes(s.seatNumber) && s.isBooked);
        if (alreadyBooked.length > 0) {
            return res.status(400).json({ message: `Seats already booked: ${alreadyBooked.map(s => s.seatNumber).join(', ')}` });
        }

        bus.seats.forEach(seat => {
            if (seatNumbers.includes(seat.seatNumber)) seat.isBooked = true;
        });
        await bus.save();

        const totalFare = bus.fare * passengers.length;
        const booking = await Booking.create({ user: req.user.id, bus: busId, passengers: totalFare });
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('bus', 'busName from to date departureTime arrivalTime fare');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.user.toString() != req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        const bus = await Bus.findById(booking.bus);
        const seatNumbers = booking.passengers.map(p => p.seatNumber);
        bus.seats.forEach(seat => {
            if (seatNumber.includes(seat.seatNumber)) seat.isBooked = false;
        });
        await bus.save();

        booking.status = 'cancelled';
        await booking.save();
        res.json({ message: 'Booking cancelled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user', 'name.email').populate('bus', 'busName from to date');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};