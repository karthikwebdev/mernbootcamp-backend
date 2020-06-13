const stripe= require('stripe')('sk_test_BTaHj7SE48ZgE3Ai4zGKuWvN00IxJOW4MG')
const uuid = require("uuid")

exports.makePayment  = (req,res) => {
    const { products, token } = req.body
    console.log("PRODUCTS",products)
    let amount = 0;
    products.map(product => {
        amount = amount + product.price;
    });
    console.log(token)
    const idempotencyKey = uuid.v4()
    return stripe.customers.create({
        email:token.email,
        source:token.id
    }).then(customer => {
        stripe.charges.create({
            amount:amount*100,
            currency:"usd",
            customer:customer.id,
            receipt_email:token.email,
            description:"a test account description",
            shipping:{
                name: token.card.name,
                address: {
                    line1:token.card.address_line1,
                    line2:token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip 
                }
            }
        },{idempotencyKey})
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
} 