const db = require("../config/db");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

exports.createBooking = (req, res) => {
    try {
        const { busId, passengers } = req.body;
        const bus = Bus.findById(busId);
        if (!bus) return res.status(404).json({ message: 'Bus not found'});

        const seatNumbers = passengers.map(p => p.seatNumber);
        const alreadyBooked = bus.seats.filter(s => seatNumbers.includes(s.seatNumber) && s.isBooked);
        if (alreadyBooked.length > 0) {
            return res.status(400).json({ message: `Seats already booked: ${alreadyBooked.map(s => s.seatNumber).join(', ')}` });
        }

        bus.seats.forEach(seat => {
            if (seatNumbers.includes(seat.seatNumber)) seat.isBooked = true;
        });

        const totalFare = bus.fare * passengers.length;
        const booking = Booking.create({
            user: req.user.id,
            bus: busId,
            passengers,
            totalFare
        });
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyBookings = (req, res) => {
    try {
        const bookings = Booking.find({ user: req.user.id }).map(booking => {
            const bus = Bus.findById(booking.bus);
            return { ...booking, busDetails: bus ? { busName: bus.busName, from: bus.from, to: bus.to, date: bus.date, departureTime: bus.departureTime, arrivalTime: bus.arrivalTime, fare: bus.fare } : null };
        });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.cancelBooking = (req, res) => {
    try {
        const booking = Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.user !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        const bus = Bus.findById(booking.bus);
        if (bus) {
            const seatNumbers = booking.passengers.map(p => p.seatNumber);
            bus.seats.forEach(seat => {
                if (seatNumbers.includes(seat.seatNumber)) seat.isBooked = false;
            });
        }

        Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
        res.json({ message: 'Booking cancelled' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllBookings = (req, res) => {
    try {
        const bookings = Booking.find().map(booking => {
            const bus = Bus.findById(booking.bus);
            const user = db.users.find(u => u._id === booking.user);
            return {
                ...booking,
                busDetails: bus ? { busName: bus.busName, from: bus.from, to: bus.to, date: bus.date } : null,
                userDetails: user ? { name: user.name, email: user.email } : null
            };
        });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};