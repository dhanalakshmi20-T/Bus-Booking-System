const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

module.exports = {
    create(data) {
        const id = uuidv4();

        const booking = {
            _id: id,
            bookingId: `BK${Date.now()}`,
            user: data.user,
            bus: data.bus,
            passengers: data.passengers,
            totalFare: Number(data.totalFare),
            status: data.status || 'CONFIRMED',
            bookingDate: new Date().toISOString()
        };

        db.bookings.push(booking);
        return booking;
    },

    find(query = {}) {
        return db.bookings.filter(booking =>
            Object.keys(query).every(
                key => booking[key] === query[key]
            )
        );
    },

    findById(id) {
        return db.bookings.find(
            booking => booking._id === id || booking.bookingId === id
        );
    },

    findByIdAndUpdate(id, updates) {
        const index = db.bookings.findIndex(
            booking => booking._id === id || booking.bookingId === id
        );

        if (index === -1) {
            return null;
        }

        db.bookings[index] = {
            ...db.bookings[index],
            ...updates
        };

        return db.bookings[index];
    },

    findByIdAndDelete(id) {
        const index = db.bookings.findIndex(
            booking => booking._id === id || booking.bookingId === id
        );

        if (index === -1) {
            return null;
        }

        const [deleteBooking] = db.bookings.splice(index, 1);
        return deleteBooking;
    }
};