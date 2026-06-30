const User = require('../models/User');

const publicUser = user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    status: user.status || 'ACTIVE',
    createdAt: user.createdAt
});

exports.getAllUsers = (req, res) => {
    return res.json(User.find().map(publicUser));
};

exports.updateUserStatus = (req, res) => {
    const status = String(req.body.status || '').toUpperCase();
    if (!['ACTIVE', 'BLOCKED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid user status' });
    }
    if (req.params.id === req.user.id && status === 'BLOCKED') {
        return res.status(400).json({ message: 'You cannot block your own account' });
    }
    const user = User.findByIdAndUpdate(req.params.id, { status });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(publicUser(user));
};

exports.updateUserRole = (req, res) => {
    const role = String(req.body.role || '').toLowerCase();
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid user role' });
    }
    if (req.params.id === req.user.id && role !== 'admin') {
        return res.status(400).json({ message: 'You cannot remove your own admin role' });
    }
    const user = User.findByIdAndUpdate(req.params.id, { role });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(publicUser(user));
};

exports.deleteUser = (req, res) => {
    if (req.params.id === req.user.id) {
        return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    const user = User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted successfully' });
};
