const express = require('express');
const {
    deleteUser,
    getAllUsers,
    updateUserRole,
    updateUserStatus
} = require('../controllers/userController');
const { adminOnly, auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth, adminOnly);
router.get('/', getAllUsers);
router.put('/:id/status', updateUserStatus);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
