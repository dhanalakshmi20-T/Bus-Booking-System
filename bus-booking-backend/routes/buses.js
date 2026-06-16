const express = require('express');
const { searchBuses, getAllBuses, getBusById, createBus, updateBus, deleteBus } = require('../controllers/busController');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/search', searchBuses);
router.get('/', getAllBuses);
router.get('/:id', getBusById);
router.post('/', auth, adminOnly, createBus);
router.put('/:id', auth, adminOnly, updateBus);
router.delete('/:id', auth, adminOnly, deleteBus);

module.exports = router;