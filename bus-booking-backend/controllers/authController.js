const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const publicUser = user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    dob: user.dob || '',
    gender: user.gender || '',
    address: user.address || '',
    role: user.role,
    status: user.status
});

const generateToken = user => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

exports.register = async (req, res) => {
    try {
        const name = String(req.body.name || '').trim();
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');
        const phone = String(req.body.phone || '').trim();

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must contain at least 6 characters'
            });
        }

        if (phone && !/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                message: 'Phone number must contain 10 digits'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email is already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'user',
            status: 'ACTIVE'
        });

        return res.status(201).json({
            token: generateToken(user),
            user: publicUser(user)
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const password = String(req.body.password || '');

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        if (user.status === 'BLOCKED') {
            return res.status(403).json({
                message: 'Your account has been blocked'
            });
        }

        return res.json({
            token: generateToken(user),
            user: publicUser(user)
        });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.getProfile = (req, res) => {
    const user = User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    return res.json(publicUser(user));
};

exports.updateProfile = (req, res) => {
    const name = String(req.body.name || '').trim();
    const phone = String(req.body.phone || '').trim();

    if (!name) return res.status(400).json({ message: 'Name is required' });
    if (phone && !/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Phone number must contain 10 digits' });
    }

    const user = User.findByIdAndUpdate(req.user.id, {
        name,
        phone,
        dob: String(req.body.dob || ''),
        gender: String(req.body.gender || ''),
        address: String(req.body.address || '').trim()
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(publicUser(user));
};

exports.changePassword = async (req, res) => {
    try {
        const currentPassword = String(req.body.currentPassword || '');
        const newPassword = String(req.body.newPassword || '');
        const user = User.findById(req.user.id);

        if (!currentPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Valid current and new passwords are required' });
        }
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        User.findByIdAndUpdate(user._id, { password: await bcrypt.hash(newPassword, 10) });
        return res.json({ message: 'Password changed successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
