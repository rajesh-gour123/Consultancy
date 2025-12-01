if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const adminDashboard = require("./routes/dashboard");
const applicantRoutes = require("./routes/applicant");
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/auth");
const ApprovedUser = require("./models/approvedUser");

const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/expressError");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const MongoStore = require("connect-mongo");
const User = require("./models/user");

const path = require("path");
const { isLoggedIn } = require("./middleware");

// app.get("/seed",async(req, res) => {
//   await ApprovedUser.create({ email: "demo1@gmail.com" });
//   res.send("Approved email added successfully");
//   console.log("Approved email added successfully");
// });
// --------------------------------------
// MongoDB Atlas Connection
// --------------------------------------

//const dbUrl = "mongodb://127.0.0.1:27017/Consultancy";
const dbUrl = process.env.ATLAS_URL

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Local MongoDB Connected");
  } catch (err) {
    console.error(err);
  }
}

main();

// --------------------------------------
// Session Configuration
// --------------------------------------
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET, 
  },
  touchAfter: 24 * 3600
});

store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});

const sessionOptions = {
 // store,
  secret: process.env.SECRET || "fallbacksecret", 
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

// --------------------------------------
// Express Setup
// --------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// --------------------------------------

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Globals (Flash + User)
// --------------------------------------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  res.locals.currentRoute = req.originalUrl || "";
  next();
});
// --------------------------------------
// View Engine + Static
// --------------------------------------
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static("public"));

// --------------------------------------
// Routes
// --------------------------------------
app.use("/", authRoutes);            // Register / Login (Public)
app.use("/apply", applicantRoutes);  // Public job page + resume
app.use("/contact", contactRoutes);  // Contact form

// Admin protected routes
app.use("/admin", isLoggedIn, adminDashboard);

// --------------------------------------
// 404 - Not Found
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error Handler
// Custom Global Error Handler (Final Middleware)
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  console.error("🔥 SERVER ERROR:", err);

  // For API Requests (Postman, Hoppscotch)
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.status(status).json({
      success: false,
      status,
      message,
    });
  }

  // For Browser (EJS)
  res.status(status).render("error", { message });
});


// --------------------------------------
// Server
// --------------------------------------
app.listen(8080, () => {
  console.log("Server running on port 8080");
});




