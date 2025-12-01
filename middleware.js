const {jobSchema, resumeVali,contactSchema} = require("./models/schema.js");
const ExpressError = require("./utils/expressError.js");

module.exports.validatePost = (req, res, next) => {
    const { error } = jobSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
}



module.exports.resumeValidation = (req, res, next) => {
  const { error } = resumeVali.validate(req.body);
  if (error) {
    const msg = error.details.map(err => err.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Please login first");
    return res.redirect("/login");
  }
  next();
};


// Contact form validation
module.exports.validateContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, msg);
  }
  next();
};