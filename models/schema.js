const Joi = require("joi");

const mobileRegex = /^\+91 [6-9]\d{9}$/;

module.exports.jobSchema = Joi.object({
  post: Joi.object({
    image: Joi.string().allow(null, ""),
    jobTitle: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    salary: Joi.string()
  .custom((value, helpers) => {

    // Allow only digits or one hyphen
    const pattern = /^\d+(-\d+)?$/;
    if (!pattern.test(value)) {
      return helpers.error("any.invalid");
    }

    // If range exists
    if (value.includes("-")) {
      const [min, max] = value.split("-").map(Number);

      if (
        isNaN(min) ||
        isNaN(max) ||
        min < 0 ||
        max > 100000 ||
        min >= max
      ) {
        return helpers.error("any.invalid");
      }
    } else {
      // Single number
      const num = Number(value);

      if (isNaN(num) || num < 0 || num > 100000) {
        return helpers.error("any.invalid");
      }
    }

    return value;
  })
  .messages({
    "any.invalid": "Enter valid salary (0–100000 or range like 20000-30000)",
  })
  .allow(null, ""),

    city: Joi.string().allow(null, ""),
    contactNumber: Joi.string().pattern(mobileRegex).allow(null, ""),
    company: Joi.string().allow(null, ""),   
    jobType: Joi.string().allow(null, ""),
    tags: Joi.string().allow(null, ""),    
  }).required()
});




// Validation schema for applicant's resume submission

module.exports.resumeVali = Joi.object({
  resume: Joi.object({
    name: Joi.string().trim().required().messages({
      "string.empty": "Name is required"
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Enter a valid email",
      "string.empty": "Email is required"
    }),

    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must be 10 digits"
      }),

    jobId: Joi.string().allow(null, "")
  }).required()
});

//sand Message 
module.exports.contactSchema = Joi.object({
  contact: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().min(3).required(),
    message: Joi.string().min(5).required()
  }).required()
});


