const fetch = require('node-fetch');
class OrderController {
    async GetOrderData(req, res) {
        try {
            if (req.body.order.total_discounts !== 0) {
                const percentageDiscount = 1 - (req.body.order.total_discounts / req.body.order.total_line_items_price);
                const dataArray = [];
                for (let i = 0; i < (req.body.order.line_items).length; i++) {
                    dataArray.push({ subscriptionId: req.body.order.line_items[i].subscription_id, discountPrice: req.body.order.line_items[i].price * percentageDiscount });
                    let myHeaders = new fetch.Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("X-Recharge-Access-Token", process.env.ACCESS_TOKEN);
                    myHeaders.append("X-Recharge-Version", "2021-11");
                    let requestOptions = {
                        method: 'PUT',
                        headers: myHeaders,
                        body: `{"price":"${dataArray[i].discountPrice}"}`,
                        redirect: 'follow'
                    };
                    await fetch(`https://api.rechargeapps.com/subscriptions/${dataArray[i].subscriptionId}`, requestOptions)
                        .then(response => response.text())
                        .then(result => console.log(result))
                        .catch(error => console.log('error', error));
                    console.log('Цена на подписку обновлена');
                }
            }
            res.status(200).send();
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = new OrderController;