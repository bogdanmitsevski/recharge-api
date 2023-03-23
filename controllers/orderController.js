const db = require('../models/index');
const fetch = require('node-fetch');
class OrderController {
    async GetOrderData(req, res) {
        try {
            if (req.body.order.total_discounts) {
                const currentSubscription = await db.subscription.findOne({
                    where: {
                        customer_id: req.body.order.customer_id,
                    },
                    order: [['id', 'DESC']]
                });
                let myHeaders = new fetch.Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("X-Recharge-Access-Token", process.env.ACCESS_TOKEN);
                myHeaders.append("X-Recharge-Version", "2021-11");
                let requestOptions = {
                    method: 'PUT',
                    headers: myHeaders,
                    body: `{"price":"${req.body.order.total_price}"}`,
                    redirect: 'follow'
                };
                fetch(`https://api.rechargeapps.com/subscriptions/${currentSubscription.subscription_id}`, requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
                console.log('Цена на подписку обновлена');
                res.status(200).send();
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = new OrderController;