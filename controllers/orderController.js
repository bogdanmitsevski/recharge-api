const fetch = require('node-fetch');
class OrderController {
    async GetOrderData(req, res) {
        try {
            let myHeaders = new fetch.Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("X-Recharge-Access-Token", process.env.ACCESS_TOKEN);
            myHeaders.append("X-Recharge-Version", "2021-11");
            let requestDiscountOptions = {
                method: 'GET',
                headers: myHeaders,
            };
            if (req.body.order.discount_codes !== null) { // перевірка чи існує цей купон в recharge
                const discountResponse = await fetch(`https://api.rechargeapps.com/discounts/${req.body.order.discount_codes[0].recharge_discount_id}`, requestDiscountOptions) // отримання списку знижок, які є в recharge
                    .then(res => res.json())
                    .catch(error => console.log('error', error));
                if (discountResponse.discount.status !== 'disabled') { // перевірка чи існуючий купон є активним
                    console.log('Скидка применена');                // купон сам додається, бек не запускаємо
                    res.status(200).send();
                }
                else {                                       //якщо купон неактивний на стороні recharge, то знижка на стороні recharge не додається
                    console.log('Скидка неактивна');
                    res.status(200).send();
                }
            }
            else if (req.body.order.discount_codes === null) { //якщо купона немає в recharge(script editor варіант), то запускаємо бек, який додає знижку відповідно до купона з script editora
                const percentageDiscount = 1 - (req.body.order.total_discounts / req.body.order.total_line_items_price);
                const dataArray = [];
                for (let i = 0; i < (req.body.order.line_items).length; i++) {
                    dataArray.push({ subscriptionId: req.body.order.line_items[i].subscription_id, discountPrice: req.body.order.line_items[i].price * percentageDiscount });
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