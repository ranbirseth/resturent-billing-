const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const menuRoutes = require('./menu.routes');

router.use('/menu-items', menuRoutes);
router.post('/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);

module.exports = router;
