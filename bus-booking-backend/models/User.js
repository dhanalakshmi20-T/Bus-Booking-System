const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

module.exports = {
    create(data) {
        const user = {
            _id: uuidv4(),
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
            phone: data.phone || '',
            dob: data.dob || '',
            gender: data.gender || '',
            address: data.address || '',
            role: data.role || 'user',
            status: data.status || 'ACTIVE',
            createdAt: new Date()
        };

        db.users.push(user);
        return user;
    },

    findOne(query) {
        return db.users.find(user =>
            Object.keys(query).every(key => {
                if (key === 'email') {
                    return user.email.toLowerCase() === query.email.toLowerCase();
                }

                return user[key] === query[key];
            })
        );
    },

    findById(id) {
        return db.users.find(user => user._id === id);
    },

    find() {
        return [...db.users];
    },

    findByIdAndUpdate(id, updates) {
        const index = db.users.findIndex(user => user._id === id);

        if (index === -1) {
            return null;
        }

        db.users[index] = {
            ...db.users[index],
            ...updates,
            _id: id
        };

        return db.users[index];
    },

    findByIdAndDelete(id) {
        const index = db.users.findIndex(user => user._id === id);

        if (index === -1) {
            return null;
        }

        const [deletedUser] = db.users.splice(index, 1);
        return deletedUser;
    }
};
