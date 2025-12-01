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

// Configure passport strategy early so it is ready before middleware initialization
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// body parser and methodOverride already registered earlier

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected");

    // create session store from mongoose client (avoid race conditions)
    const store = MongoStore.create({
      client: mongoose.connection.getClient(),
      touchAfter: 24 * 3600,
      crypto: { secret: process.env.SECRET || "fallbacksecret" },
    });

    store.on("error", (err) => {
      console.error("SESSION STORE ERROR", err);
    });

    const sessionOptions = {
      store,
      secret: process.env.SECRET || "fallbacksecret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    };

    app.use(session(sessionOptions));
    app.use(flash());

    app.use(passport.initialize());
    app.use(passport.session());

    // Make flash messages & current user available in views
    app.use((req, res, next) => {
      res.locals.success = req.flash("success");
      res.locals.error = req.flash("error");
      res.locals.currentUser = req.user;
      res.locals.currentRoute = req.originalUrl || "";
      next();
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Initialize db connection + session
main();

// --------------------------------------
// Session Configuration
// --------------------------------------
// (previous duplicate session config removed — session & passport configured after DB connect)

// --------------------------------------
// Express Setup
// --------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// View engine and static files
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => res.redirect("/apply/Home"));
app.use("/", authRoutes);
app.use("/apply", applicantRoutes);
app.use("/contact", contactRoutes);
app.use("/admin", isLoggedIn, adminDashboard);

// 404 handler
app.use((req, res, next) => next(new ExpressError(404, "Page not found")));

// Central error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  console.error("🔥 SERVER ERROR:", err);

  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.status(status).json({ success: false, status, message });
  }

  res.status(status).render("error", { message });
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));




