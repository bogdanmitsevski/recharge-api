const express         = require('express');
const router          = express.Router();
const orderController = require('../controllers/orderController');
router.post('/order', orderController.GetOrderData);

module.exports = router;