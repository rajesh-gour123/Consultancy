const mongoose = require("mongoose");

const approvedUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("ApprovedUser", approvedUserSchema);
