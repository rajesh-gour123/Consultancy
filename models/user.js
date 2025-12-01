const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

// adds username + hashed password + helper methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
