const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { findById } = require('./User');

module.exports = {
    create: (data) => {
        const seats = [];
        for (let i = 1; i <= data.totalSeats; i++) {
            seats.push({ seatNumber: `${i}`, isBooked: false });
        }
        const bus = { _id: uuidv4(), ...data, seats, createdAt: new Date() };
        db.buses.push(bus);
        return bus;
    },
    find: (query = {}) => db.buses.filter( b =>
        Object.keys(query).every(k => {
            if (query[k] instanceof RegExp) return query[k].test(b[k]);
            return b[k] === query[k];
        })
    ),
    findById: (id) => db.buses.find(b => b._id === id),
    findByIdAndUpdate: (id, data) => {
        const idx = db.buses.findIndex(b => b._id === id);
        if (idx === -1) return null;
        db.buses[idx] = { ...db.buses[idx], ...data };
        return db.buses[idx];
    },
    findByIdAndDelete: (id) => {
        const idx = db.buses.findIndex(b => b._id === id);
        if (idx !== -1) db.buses.splice(idx, 1);
    }
};