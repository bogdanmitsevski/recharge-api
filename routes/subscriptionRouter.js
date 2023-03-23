const express                = require('express');
const router                 = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
router.post('/subscription', subscriptionController.GetSubscriptionData);

module.exports = router;