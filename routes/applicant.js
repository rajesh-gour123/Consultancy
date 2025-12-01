const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Application = require("../models/publicResume");
const { resumeValidation } = require("../middleware.js");
const Post= require("../models/jobPost.js");
const { uploadPdf } = require("../utils/reduceFile");

//PUBLIC HOME PAGE
router.get("/Home", wrapAsync(async (req, res) => {
    let jobs = await Post.find({});
    res.render("index.ejs", { jobs });
}));

//success page after application submission
router.get("/success", (req, res) => {
    res.render("forPublic/success");
});
//All Jobs Page
router.get("/allJobs", wrapAsync(async (req, res) => {
    const jobs = await Post.find({});
    res.render("forPublic/allJobs", { jobs, selectedJobId: null });
}));

//Perticular Job
router.get("/jobs/:id", wrapAsync(async (req, res) => {
    const jobs = await Post.find({});
    const selectedJobId = req.params.id;

    res.render("forPublic/allJobs", { jobs, selectedJobId });
}));
// For Resume Application
// Public apply page
router.get("/", (req, res) => {
  res.render("forPublic/apply");
});

// Show apply form for specific job
router.get("/job/:jobId", wrapAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const job = await Post.findById(jobId);
  if (!job) return next(new ExpressError("Job not found", 404));
  res.render("forPublic/apply", { job });
}));


// Submit application (General + Job-specific both)
// Submit application (General + Job-specific both)
router.post(
  "/",

  // Multer PDF handler (catches errors)
  (req, res, next) => {
    uploadPdf.single("resume")(req, res, (err) => {

      if (err && err.code === "LIMIT_FILE_SIZE") {
        return next(new ExpressError(400, "PDF must be less than 2MB"));
      }

      if (err) {
        return next(new ExpressError(400, err.message));
      }

      next();
    });
  },

  // Joi validation
  resumeValidation,

  wrapAsync(async (req, res) => {

    if (!req.file) {
      throw new ExpressError(400, "Resume file is required!");
    }

    const { name, email, phone, jobId } = req.body.resume;

    await Application.create({
      name,
      email,
      phone,
      jobId: jobId || null,
      resume: {
        url: req.file.path,
        filename: req.file.filename
      }
    });

    req.flash("success", "Application submitted successfully!");
    res.redirect("/apply/success");
  })
);



module.exports = router;