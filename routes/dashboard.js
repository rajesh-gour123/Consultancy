const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Post= require("../models/jobpost");
const resumeView = require("../models/publicResume");
const ContactMessage = require("../models/contactMessage");
const { validatePost,validateContact} = require("../middleware.js");
const { cloudinary } = require("../cloudConfig");
const { uploadImage } = require("../utils/reduceFile");




// OWNER DASHBOARD
router.get("/dashboard", async (req, res) => {

  const allPosts = await Post.find({});

  const fullTimeCount = await Post.countDocuments({ jobType: "Full-time" });
  const partTimeCount = await Post.countDocuments({ jobType: "Part-time" });

  const totalApplicants = await resumeView.countDocuments();

  res.render("owner/dashboard", {
    allPosts,
    fullTimeCount,
    partTimeCount,
    totalApplicants
  });
});


// CREATE NEW POST FORM
router.get("/createNewPost", (req, res) => {
    res.render("owner/createPost");
});


// SAVE NEW POST
router.post(
  "/createNewPost",
  uploadImage.single("photo"),
  validatePost,
  wrapAsync(async (req, res) => {

    if (!req.file) {
      throw new ExpressError(400, "Image is required!");
    }

    // ---------------------------
    // SALARY VALIDATION (Simple)
    // Supports: number OR number-number
    // Range: 0 to 100000
    // ---------------------------
    let salary = req.body.post.salary;

    // Only digits or one hyphen allowed
    if (!/^\d+(-\d+)?$/.test(salary)) {
      throw new ExpressError(400, "Enter valid salary (0–100000 or range 20000-30000)");
    }

    if (salary.includes("-")) {
      const [min, max] = salary.split("-").map(Number);

      if (
        isNaN(min) ||
        isNaN(max) ||
        min < 0 ||
        max > 100000 ||
        min >= max
      ) {
        throw new ExpressError(400, "Enter valid salary (0–100000 or range 20000-30000)");
      }

      req.body.post.salary = `${min}-${max}`;

    } else {
      const num = Number(salary);

      if (isNaN(num) || num < 0 || num > 100000) {
        throw new ExpressError(400, "Enter valid salary (0–100000)");
      }

      req.body.post.salary = num.toString();
    }

    // ---------------------------
    // TAG CLEANING
    // ---------------------------
    let tags = [];
    if (req.body.post.tags) {
      tags = req.body.post.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    // ---------------------------
    // SAVE NEW POST
    // ---------------------------
    const newPost = new Post({
      ...req.body.post,
      tags,
      image: {
        url: req.file.path,
        filename: req.file.filename
      }
    });

    await newPost.save();

    req.flash("success", "Job posted successfully!");
    res.redirect("/admin/dashboard");
  })
);


// EDIT POST FORM
router.get("/:id/edit",wrapAsync(async (req, res,next) => {
    let {id} = req.params;
    const post = await Post.findById(id);
    if(!post){
       return next(new ExpressError(404,"post not found"));
    }
    res.render("owner/editPost", { post });
}))
;

// UPDATE POST
router.put(
  "/:id/edit",
  uploadImage.single("photo"),
  validatePost,
  wrapAsync(async (req, res, next) => {

    const { id } = req.params;
    let post = await Post.findById(id);

    if (!post) {
      throw new ExpressError(404, "Post not found");
    }

    // -------------------------------
    // SALARY VALIDATION (same as create route)
    // -------------------------------
    let salary = req.body.post.salary;

    if (!/^\d+(-\d+)?$/.test(salary)) {
      throw new ExpressError(400, "Enter valid salary (0–100000 or range 20000-30000)");
    }

    if (salary.includes("-")) {
      const [min, max] = salary.split("-").map(Number);

      if (
        isNaN(min) ||
        isNaN(max) ||
        min < 0 ||
        max > 100000 ||
        min >= max
      ) {
        throw new ExpressError(400, "Enter valid salary (0–100000 or range 20000-30000)");
      }

      req.body.post.salary = `${min}-${max}`;

    } else {
      const num = Number(salary);
      if (isNaN(num) || num < 0 || num > 100000) {
        throw new ExpressError(400, "Enter valid salary (0–100000)");
      }
      req.body.post.salary = num.toString();
    }

    // -------------------------------
    // UPDATE MAIN FIELDS
    // -------------------------------
    post.jobTitle = req.body.post.jobTitle;
    post.description = req.body.post.description;
    post.salary = req.body.post.salary;
    post.city = req.body.post.city;
    post.contactNumber = req.body.post.contactNumber;
    post.company = req.body.post.company;
    post.jobType = req.body.post.jobType;

    // -------------------------------
    // TAG UPDATE
    // -------------------------------
    let tags = [];
    if (req.body.post.tags) {
      tags = req.body.post.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }
    post.tags = tags;

    // -------------------------------
    // IMAGE UPDATE
    // -------------------------------
    if (req.file) {
      if (post.image?.filename) {
        await cloudinary.uploader.destroy(post.image.filename);
      }

      post.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await post.save();
    req.flash("success", "Post updated successfully!");
    res.redirect("/admin/dashboard");
  })
);




// DELETE POST
router.delete(
  "/:id/delete",
  wrapAsync(async (req, res,next) => {
    let { id } = req.params;

    let post = await Post.findById(id);
    if (!post) {
      return next (new ExpressError(404, "Post not found"));
    }
    if (post.image && post.image.filename) {
      await cloudinary.uploader.destroy(post.image.filename);
    }

    await Post.findByIdAndDelete(id);

    req.flash("success", "Post deleted successfully!");
    res.redirect("/admin/dashboard");
  })
);


//For Applicants resume viewing

//All resumes
router.get("/resumeAll",wrapAsync(async (req, res) => {
    const applications = await resumeView.find().sort({ appliedAt: -1 }).populate('jobId');
    res.render("owner/resumeAll", { applications });
}));


//Single resume view
router.get(
  "/resume/:id/view",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const application = await resumeView.findById(id);
    if (!application) {
      return next(new ExpressError(404,"Application not found!"));
    }

    res.render("owner/viewApplication", { application });
  })
);

//delete 
router.delete(
  "/resume/:id/delete",
  wrapAsync(async (req, res,next) => {
    const { id } = req.params;

    const application = await resumeView.findById(id);
    if (!application) {
      return next(new ExpressError(404,"Application not found!"));
    }

    // Delete PDF from Cloudinary
    await cloudinary.uploader.destroy(application.resume.filename, {
      resource_type: "raw"
    });

    // Delete database entry
    await resumeView.findByIdAndDelete(id);

    req.flash("success", "Application deleted successfully!");
    res.redirect("/admin/resumeAll");
  })
);

// Contact Messages Dashboard
// GET contact page


router.get("/messages",wrapAsync(async (req, res) => {
  const messages = await ContactMessage.find({}).sort({ sentAt: -1 });
  res.render("owner/message", { messages });
}));

router.get("/messages/:id/view",wrapAsync(async (req, res, next) => {
  const { id } = req.params;

  const message = await ContactMessage.findById(id);
  if (!message) return next(new ExpressError(404, "Message not found"));

  res.render("owner/viewMessage", { message });
}));

router.delete("/messages/:id/delete",wrapAsync(async (req, res, next) => {
  const { id } = req.params;

  const message = await ContactMessage.findById(id);
  if (!message) return next(new ExpressError(404, "Message not found"));

  await ContactMessage.findByIdAndDelete(id);

  req.flash("success", "Message deleted successfully!");
  res.redirect("/admin/messages");
}));


module.exports = router;