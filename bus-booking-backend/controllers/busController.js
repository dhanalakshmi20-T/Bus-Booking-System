const Bus = require('../models/Bus');

const escapeRegex = value =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const withAvailability = bus => ({
    ...bus,
    availableSeats: bus.seats.filter(seat => !seat.isBooked).length
});

exports.searchBuses = (req, res) => {
    try {
        const from = String(req.query.from || '').trim();
        const to = String(req.query.to || '').trim();
        const date = String(req.query.date || '').trim();

        const query = {
            status: 'ACTIVE'
        };

        if (from) {
            query.from = new RegExp(escapeRegex(from), 'i');
        }

        if (to) {
            query.to = new RegExp(escapeRegex(to), 'i');
        }

        if (date) {
            query.date = date;
        }

        const buses = Bus.find(query).map(withAvailability);
        return res.json(buses);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.getAllBuses = (req, res) => {
    try {
        return res.json(
            Bus.find().map(withAvailability)
        );
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.getBusById = (req, res) => {
    const bus = Bus.findById(req.params.id);

    if (!bus) {
        return res.status(404).json({
            message: 'Bus not found'
        });
    }

    return res.json(withAvailability(bus));
};

exports.createBus = (req, res) => {
    try {
        const busDate = {
            busName: String(req.body.busName || '').trim(),
            busNumber: String(req.body.busNumber || '').trim().toUpperCase(),
            busType: String(req.body.busType || '').trim(),
            from: String(req.body.from || '').trim(),
            to: String(req.body.to || '').trim(),
            date: String(req.body.date || '').trim(),
            departureTime: String(req.body.departureTime || '').trim(),
            arrivalTime: String(req.body.arrivalTime || '').trim(),
            fare: Number(req.body.fare),
            totalSeats: Number(req.body.totalSeats),
            status: req.body.status || 'ACTivE'
        };

        const requiredFields = [
            'busName',
            'busNumber',
            'busType',
            'from',
            'to',
            'date',
            'departureTime',
            'arrivalTime'
        ];

        if (requiredFields.some(field => !busDate[field])) {
            return res.status(400).json({
                message: 'All bus details are required'
            });
        }

        if (busData.fare <= 0 || busData.totalSeats <= 0) {
            return res.status(400).json({
                message: 'Fare and total seats must be greater than zero'
            });
        }

        const duplicate = Bus.find({
            busNumber: busData.busNumber,
            date: busData.date
        })[0];

        if (duplicate) {
            return res.status(409).json({
                message: 'This bus is a;ready scheduled for the selected date'
            });
        }

        const bus = Bus.create(busData);
        return res.status(201).json(withAvailability(bus));
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.updateBus = (req, res) => {
    try {
        const updates = { ...req.body };

        delete updates._id;
        delete updates.seats;
        delete updates.createdAt;

        if (updates.fare !== undefined) {
            updates.fare = Number(updates.fare);
        }

        if (updates.totalSeats !== undefined) {
            updates.totalSeats = Number(updates.totalSeats);
        }

        if (updates.fare !== undefined && updates.fare <= 0) {
            return res.status(400).json({
                message: 'Fare must be greater than zero'
            });
        }

        if (updates.totalSeats !== undefined && updates.totalSeats <= 0) {
            return res.status(400).json({
                message: 'Total seats must be greater than zero'
            });
        }

        const bus = Bus.findByIdAndUpdate(
            req.params.id,
            updates
        );

        if (!bus) {
            return res.status(404).json({
                message: 'Bus not found'
            });
        }

        return res.json(withAvailability(bus));
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteBus = (req, res) => {
    const bus = Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
        return res.status(404).json({
            message: 'Bus not found'
        });
    }

    return res.json({
        message: 'Bus deleted successfully'
    });
};