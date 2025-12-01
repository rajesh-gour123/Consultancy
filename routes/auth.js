const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const ApprovedUser = require("../models/approvedUser");
const wrapAsync = require("../utils/wrapAsync.js");


// GET register
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// POST register
router.post("/register", wrapAsync(async (req, res) => {

  const { email, username, password } = req.body;

  // Validate required inputs (optional but recommended)
  if (!email || !username || !password) {
    req.flash("error", "All fields are required.");
    return res.redirect("/register");
  }
  // Allow signup only if email exists in ApprovedUser list
  const approved = await ApprovedUser.findOne({ email });
  if (!approved) {
    req.flash("error", "You are not an authorized person");
    return res.redirect("/register");
  }

  // Create new user
  const user = new User({ email, username });
  await User.register(user, password); 

  req.flash("success", "Signup successful. You can now login.");
  res.redirect("/login");

}));

// GET login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// POST login
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect("/admin/dashboard");
  }
);

// GET logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully");
    res.redirect("/apply/Home");
  });
});

module.exports = router;
