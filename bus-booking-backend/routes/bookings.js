const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const { createBooking, getMyBookings, cancelBooking, getAllBookings } = require('../controllers/bookingController');
const router = express.Router();

router.post('/', auth, createBooking);
router.get('/my', auth, getMyBookings);
router.put('/cancel/:id', auth, cancelBooking);
router.get('/all', auth, adminOnly, getAllBookings);

module.exports = router;