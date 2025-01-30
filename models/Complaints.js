const mongoose = require("mongoose");

const ComplaintsSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaints", ComplaintsSchema);
