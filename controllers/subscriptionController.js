const db = require('../models/index');
class SubscriptionController {
    async GetSubscriptionData(req, res) {
        try {
            if (req.body) {
                const newSubscription = await db.subscription.create({
                    subscription_id: req.body.subscription.id,
                    customer_id: req.body.subscription.customer_id
                });
                await newSubscription.save();
                console.log('Новая подписка была успешно добавлена');
                res.status(200).send();
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = new SubscriptionController;