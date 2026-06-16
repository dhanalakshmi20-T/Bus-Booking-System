const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    create: (data) => {
        const booking = { _id: uuidv4(), ...data, status: 'confirmed', bookingDate: new Date() };
        db.bookings.push(booking);
        return booking;
    },
    find: (query = {}) => db.bookings.filter(b =>
        Object.keys(query).every(k => b[k] === query[k])
    ),
    findById: (id) => db.bookings.find(b => b._id === id),
    findByIdAndUpdate: (id, data) => {
        const idx = db.bookings.findIndex(b => b._id === id);
        if (idx === -1) return null;
        db.bookings[idx] = { ...db.bookings[idx], ...data };
        return db.bookings[idx];
    }
};