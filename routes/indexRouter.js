const express            = require('express');
const router             = express.Router();
const orderRouter        = require('../routes/orderRouter');
const subscriptionRouter = require('../routes/subscriptionRouter');

router.use('/', orderRouter);
router.use('/', subscriptionRouter);

module.exports = router;