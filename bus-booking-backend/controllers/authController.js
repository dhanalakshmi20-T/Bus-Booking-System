const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existing = User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        const user = User.create({ name, email, password: hashed, phone, role: 'user' });
        res.status(201).json({
            token: generateToken(user),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({
            token: generateToken(user),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProfile = (req, res) => {
    try {
        const user = User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const { password, ...profile } = user;
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};