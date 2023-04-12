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
            async function addDiscount(requestBody) {
                const percentageDiscount = 1 - (requestBody.order.total_discounts / requestBody.order.total_line_items_price);
                const dataArray = [];
                for (let i = 0; i < (requestBody.order.line_items).length; i++) {
                    dataArray.push({ subscriptionId: requestBody.order.line_items[i].subscription_id, discountPrice: requestBody.order.line_items[i].price * percentageDiscount });
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
            if (req.body.order.discount_codes !== null) { // перевірка чи існує цей купон в recharge
                const discountResponse = await fetch(`https://api.rechargeapps.com/discounts/${req.body.order.discount_codes[0].recharge_discount_id}`, requestDiscountOptions) // отримання списку знижок, які є в recharge
                    .then(res => res.json())
                    .catch(error => console.log('error', error));
                if (discountResponse.discount.status !== 'disabled' && discountResponse.discount.usage_limits.automatic_redemptions_per_customer > 0) { // перевірка чи існуючий купон є активним
                    console.log('Скидка, доступная на несколько чарджей, применена');             // купон сам додається, бек не запускаємо
                    res.status(200).send();
                }
                else if (req.body.order.discount_codes !== null && discountResponse.discount.usage_limits.automatic_redemptions_per_customer === 0) {
                    addDiscount(req.body);
                    console.log('Скидка, доступная на один charge, применена');
                    res.status(200).send();

                }
                else {                                       //якщо купон неактивний на стороні recharge, то знижка на стороні recharge не додається
                    console.log('Скидка неактивна');
                    res.status(200).send();
                }
            }
            else if (req.body.order.discount_codes === null) { //якщо купона немає в recharge(script editor варіант), то запускаємо бек, який додає знижку відповідно до купона з script editora
                addDiscount(req.body);
                res.status(200).send();
            }

            res.status(200).send();
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = new OrderController;