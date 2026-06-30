const express = require('express');
const { adminOnly, auth } = require('../middleware/auth');
const { createBooking, getMyBookings, getAllBookings, getBookingById, cancelBooking } = require('../controllers/bookingController');
const router = express.Router();

router.use(auth);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/all', adminOnly, getAllBookings);
router.get('/:id', getBookingById);
router.put('/cancel/:id', cancelBooking);

module.exports = router;