const express = require('express');
const { adminOnly, auth } = require('../middleware/auth');
const {
    cancelBooking,
    confirmBooking,
    createBooking,
    deleteBooking,
    getAllBookings,
    getBookingById,
    getMyBookings
} = require('../controllers/bookingController');
const router = express.Router();

router.use(auth);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/all', adminOnly, getAllBookings);
router.get('/:id', getBookingById);
router.put('/cancel/:id', cancelBooking);
router.put('/confirm/:id', adminOnly, confirmBooking);
router.delete('/:id', adminOnly, deleteBooking);

module.exports = router;
