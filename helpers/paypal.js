const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: process.env.MODE_PAYPAL,
  client_id: process.env.CLIENT_ID,
  client_secret:process.env.CLIENT_SECERT,
});

module.exports = paypal;
