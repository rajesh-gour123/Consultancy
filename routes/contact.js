const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ContactMessage = require("../models/contactMessage");
const { validateContact } = require("../middleware");


router.get("/mess", (req, res) => {
  res.render("home/contact");
});



router.post("/mess", wrapAsync(async (req, res) => {

  const { name, email, subject, message } = req.body.contact || {};

  await ContactMessage.create({
    name,
    email,
    subject,
    message
  });

  req.flash("success", "Message sent successfully!");
  res.redirect("/apply/success");

}));

module.exports = router;