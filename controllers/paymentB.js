var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "pxpghpnjz2sdkdh3",
  publicKey: "hcmvgjdmvfxd2j4m",
  privateKey: "f297a38b013a4eb553b4c44d2ac512bf"
});

exports.getToken = (req,res) => {
    gateway.clientToken.generate({}, function (err, response) {
        if(err){
            res.status(500).send(err)
        }else{
            res.send(response)
        }
    });
} 

exports.processPayment = (req,res) => {

    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
          if(err){
              res.status(500).send(err)
          }else{
              res.send(result)
          }
      });
}