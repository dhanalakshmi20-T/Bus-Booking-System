const Bus = require("../models/Bus");

exports.searchBuses = (req, res) => {
    try {
        const { from, to, date } = req.query;
        const query = {};
        if (from) query.from = new RegExp(from, 'i');
        if (to) query.to = new RegExp(to, 'i');
        if (date) query.date = date;
        const buses = Bus.find(query);
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBusById = (req, res) => {
    try {
        const bus = Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBus = (req, res) => {
    try {
        const bus = Bus.create(req.body);
        res.status(201).json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBus = (req, res) => {
    try {
        const bus = Bus.findByIdAndUpdate(req.params.id, req.body);
        if (!bus) return res.status(404).json({ message: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteBus = (req, res) => {
    try {
        Bus.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bus deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllBuses = (req, res) => {
    try {
        const buses = Bus.find();
        res.json(buses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};