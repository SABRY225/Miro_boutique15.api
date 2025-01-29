const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    orderId:String,
    name: String,
    address: String,
    city: String,
    phone: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
