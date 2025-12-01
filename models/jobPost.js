

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobPostSchema = new Schema({
  image: {
    url: String,
    filename: String
  },
  jobTitle: {
    type: String,
    required: true
  },

  // optional company name
  company: {
    type: String,
    default: null
  },

  description: {
    type: String,
    required: true
  },

  salary: {
  type: String,
  default: null,
  validate: {
    validator: function (value) {
      if (!value) return true;

      // Allow number OR number-number
      if (!/^\d+(-\d+)?$/.test(value)) return false;

      if (value.includes("-")) {
        const [min, max] = value.split("-").map(Number);
        if (isNaN(min) || isNaN(max)) return false;
        if (min < 0 || max > 100000) return false;
        if (min >= max) return false;
      } else {
        const num = Number(value);
        if (isNaN(num) || num < 0 || num > 100000) return false;
      }

      return true;
    },
    message: "Enter valid salary (0–100000 or range like 20000-30000)"
  }
},

  // jobType: only Full-time or Part-time
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time"],
    default: "Full-time"
  },

  // optional tags array
  tags: {
    type: [String],
    default: []
  },

  city: {
    type: String,
    default: null
  },
  contactNumber: {
    type: String,
    default: null,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^\+91 [6-9]\d{9}$/.test(v);
      },
      message: "Phone number must be like: +91 9876543210"
    }
  },
  postedDate: {
    type: String,
    default: function () {
      const date = new Date();
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Jobpost = mongoose.model('JobPost', jobPostSchema);
module.exports = Jobpost;
