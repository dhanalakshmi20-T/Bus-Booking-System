const db = require('../config/db');
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

const addBookingDetails = booking => {
    const bus = Bus.findById(booking.bus);
    const user = db.users.find(item => item._id === booking.user);

    return {
        ...booking,
        busDetails: bus
            ? {
                busName: bus.busName,
                busNumber: bus.busNumber,
                busType: bus.busType,
                from: bus.from,
                to: bus.to,
                date: bus.date,
                departureTime: bus.departureTime,
                arrivalTime: bus.arrivalTime,
                fare: bus.fare
            }
        : null,
    userDetails: user
        ? {
            name: user.name,
            email: user.email,
            phone: user.phone
        }
    : null
    };
};

exports.createBooking = (req, res) => {
    try {
        const busId = String(req.body.busId || '').trim();
        const passengers = Array.isArray(req.body.passengers) ? req.body.passengers : [];

        if (!busId || passengers.length === 0) {
            return res.status(400).json({
                message: 'Bus and passenger details are required'
            });
        }

        if (passengers.length > 6) {
            return res.status(400).json({
                message: 'A maximum of 6 seats can be booked at once'
            });
        }

        const bus = Bus.findById(busId);

        if (!bus || bus.status !== 'ACTIVE') {
            return res.status(404).json({
                message: 'Bus is unavailable'
            });
        }

        const normalizedPassengers = passengers.map(passenger => ({
            name: String(passenger.name || '').trim(),
            age: Number(passenger.age),
            gender: String(passenger.gender || '').trim(),
            seatNumber: String(passenger.seatNumber || '').trim()
        }));

        const invalidPassenger = normalizedPassengers.some(passenger =>
            !passenger.name ||
            !passenger.gender ||
            !passenger.seatNumber ||
            passenger.age < 1 ||
            passenger.age > 99
        );

        if (invalidPassenger) {
            return res.status(400).json({
                message: 'Valid passenger details are required'
            });
        }

        const requestedSeats = normalizedPassengers.map(passenger => passenger.seatNumber);

        if (new Set(requestedSeats).size !== requestedSeats.length) {
            return res.status(400).json({
                message: 'Duplicate seats cannot be selected'
            });
        }

        const unavailableSeats = requestedSeats.filter(seatNumber => {
            const seat = bus.seat.find(item => item.seatNumber === seatNumber);

            return !seat || seat.isBooked;
        });

        if (unavailableSeats.length > 0) {
            return res.status(409).json({
                message: `Seats unavailable: ${unavailableSeats.join(', ')}`
            });
        }

        bus.seats.forEach(seat => {
            if (requestedSeats.includes(seat.seatNumber)) {
                seat.isBooked = true;
            }
        });

        bus.availableSeats = bus.seats.filter(seat => !seat.isBooked).length;

        const booking = Booking.create({
            user: req.user.id,
            bus: busId,
            passengers: normalizedPassengers,
            totalFare: Number(bus.fare) * passengers.length
        });

        return res.status(201).json(
            addBookingDetails(booking)
        );
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.getMyBookings = (req, res) => {
    try {
        const bookings = Booking.find({
            user: req.user.id
        })
            .map(addBookingDetails)
            .sort(
                (first, second) =>
                    new Date(second.bookingDate).getTime() -
                    new Date(first.bookingDate).getTime()
            );
        return res.json(bookings);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.getAllBookings = (req, res) => {
    try {
        const bookings = Booking.find()
            .map(addBookingDetails)
            .sort(
                (first, second) =>
                    new Date(second.bookingDate).getTime() -
                    new Date(first.bookingDate).getTime()
            );
        return res.json(bookings);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.cancelBooking = (req, res) => {
    try {
        const booking = Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        const ownsBooking = booking.user === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!ownsBooking && !isAdmin) {
            return res.status(403).json({
                message: 'You cannot cancel this booking'
            });
        }

        if (booking.status === 'CANCELLED') {
            return res.status(409).json({
                message: 'Booking is already cancelled'
            });
        }

        const bus = Bus.findById(booking.bus);

        if (bus) {
            const bookedSeats = booking.passengers.map(
                passenger => passenger.seatNumber
            );

            bus.seats.forEach(seat => {
                if (bookedSeats.includes(seat.seatNumber)) {
                    seat.isBooked = false;
                }
            });

            bus.availableSeats = bus.seats.filter(
                seat => !seat.isBooked
            ).length;
        }

        const updatesBooking = Booking.findByIdAndUpdate(
            req.params.id,
            {
                status: 'CANCELLED',
                cancelledAt: new Date().toISOString()
            }
        );

        return res.json({
            message: 'Booking cancelled successfully',
            booking: addBookingDetails(updatesBooking)
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.getBookingById = (req, res) => {
    try {
        const booking = Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }

        const ownsBooking = booking.user === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!ownsBooking && !isAdmin) {
            return res.status(403).json({
                message: 'You cannot view this booking'
            });
        }

        return res.json(addBookingDetails(booking));
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};