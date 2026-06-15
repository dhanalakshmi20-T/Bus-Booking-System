const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { create, findById } = require('./Bus');

module.exports = {
    create: (data) => {
        const user = { _id: uuidv4(), ...data, createdAt: new Date() };
        db.users.push(user);
        return user;
    },
    findOne: (query) => db.users.find(u =>
        Object.keys(query).every(k => u[k] === query[k])
    ),
    findById: (id) => db.users.find(u => u._id === id),
};