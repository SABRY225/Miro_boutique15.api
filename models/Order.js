const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      salePrice: String,
      quantity: Number,
    },
  ],
  addressInfo: {
    name: String,
    address: String,
    city: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
});

module.exports = mongoose.model("Order", OrderSchema);
