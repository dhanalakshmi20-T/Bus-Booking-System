const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const createSeats = totalSeats =>
    Array.from({ length: totalSeats }, (_, index) => ({
        seatNumber: String(index + 1),
        isBooked: false
    }));

module.exports = {
    create(data) {
        const totalSeats = Number(data.totalSeats);

        const bus = {
            ...data,
            _id: uuidv4(),
            totalSeats,
            availableSeats: totalSeats,
            status: data.status || 'ACTIVE',
            seats: createSeats(totalSeats),
            createdAt: new Date()
        };

        db.buses.push(bus);
        return bus;
    },

    find(query = {}) {
        return db.buses.filter(bus =>
            Object.keys(query).every(key => {
                const expected = query[key];
                const actual = bus[key];

                if (expected instanceof RegExp) {
                    return expected.test(String(actual || ''));
                }

                return actual === expected;
            })
        );
    },

    findById(id) {
        return db.buses.find(bus => bus._id === id);
    },

    findByIdAndUpdate(id, updates) {
        const index = db.buses.findIndex(bus => bus._id === id);

        if (index === -1) {
            return null;
        }

        const currentBus = db.buses[index];
        const totalSeats = Number(updates.totalSeats || currentBus.totalSeats);

        let seats = currentBus.seats;

        if (totalSeats !== currentBus.totalSeats) {
            const currentSeatMap = new Map(currentBus.seats.map(seat => [seat.seatNumber, seat]));

            seats = createSeats(totalSeats).map(seat => currentSeatMap.get(seat.seatNumber) || seat);
        }

        db.buses[index] = {
            ...currentBus,
            ...updates,
            _id: id,
            totalSeats,
            seats,
            availableSeats: seats.filter(seat => !seat.isBooked).length
        };

        return db.buses[index];
    },

    findByIdAndDelete(id) {
        const index = db.users.findIndex(bus => bus._id === id);

        if (index === -1) {
            return null;
        }

        const [deleteBus] = db.buses.splice(index, 1);
        return deleteBus;
    }
};