const express = require("express");
const sign = express.Router();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const {
  Userinfostore,
  UserinfoUpdate,
  updateMemberinfo,
} = require("./storeuser.js");
const { Member } = require("../../../modules/MemberModule.js");
const {
  findMemberbyId,
  memberget,
  findMemberRoleInProject,
  sendOtpEmail,
} = require("./findmemberbyId.js");
require("dotenv").config();

let origin = "";

// Setup session
sign.use(
  session({
    secret: process.env.SESSION_SECRET || "12345anika",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGO_URL ||
        "mongodb+srv://islamanika252:OkPP7MdnGnyBhEBW@student.4omsy08.mongodb.net/student?retryWrites=true&w=majority&appName=student",
      collectionName: "sessions",
    }),
    cookie: {
      secure: false, // Allows the cookie to be sent over both HTTP and HTTPS
      maxAge: 30 * 24 * 60 * 60 * 1000, // Session duration in milliseconds (30 days in this example)
      httpOnly: false, // Allows the cookie to be accessed via JavaScript (not recommended for security reasons)
    },
  })
);

// Middleware to handle CORS and Headers
sign.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);

sign.use(express.json()); // To parse JSON bodies

// Middleware to initialize Passport
sign.use(passport.initialize());
sign.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/signup/auth/google/callback",
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
      };
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Initial Google OAuth login
sign
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

sign.route("/auth/google/callback").get((req, res, next) => {
  if (req.query.origin !== undefined) {
    origin = req.query.origin;
  }
  let successRedirect;
  switch (origin) {
    case "signup":
      successRedirect = `${process.env.FRONT_END_URL}/signup/password`;
      break;
    case "login":
      successRedirect = `${process.env.FRONT_END_URL}/login/temp`;
      break;
    default:
      successRedirect = `${process.env.FRONT_END_URL}/signup`;
  }

  passport.authenticate("google", {
    successRedirect: successRedirect,
    failureRedirect: `${process.env.FRONT_END_URL}/login`,
  })(req, res, next);
});

// Route for handling email signup
const signpost = async (req, res) => {
  const { email } = req.body;
  const user = await Member.findOne({ email });
  if (user) {
    return res.status(200).json({ message: "Email already exists" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email is required in the request body." });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  const text = `Your OTP for email verification is: ${otp}`;
  sendOtpEmail(email, text);
  return res.status(200).json({ message: otp });
};

const findEmailotp = async (req, res) => {
  const { email } = req.body;
  try {
    const existingMember = await Member.findOne({ email });
    if (!existingMember) {
      return res.status(200).json({ message: "Invalid email" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const text = `Your OTP for email verification is: ${otp}`;
    sendOtpEmail(email, text);
    return res.status(200).json({ message: otp });
  } catch (error) {
    console.error("Error in sending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Route for handling email login
const loginmatch = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingMember = await Member.findOne({ email });
    if (!existingMember) {
      return res.status(200).json({ message: "Invalid email" });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      existingMember.password
    );
    if (!passwordMatch) {
      return res.status(200).json({ message: "Incorrect password" });
    }
    req.session.isAuth = true;
    req.session.user = {
      displayName: existingMember.name,
      email: existingMember.email,
    };
    return res.status(200).json({ message: "Successful login" });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Route to get session information
const sessionget = async (req, res) => {
  if (req.session && req.session.user) {
    const email = req.session.user.email;
    const existingMember1 = await Member.findOne({ email });
    if (existingMember1) {
      const username = {
        ...req.session.user,
        id: existingMember1._id,
        picture: existingMember1.picture,
      };
      return res
        .status(200)
        .json({ message: "Session is present", user: username });
    } else {
      return res.status(200).json({ message: "No session found" });
    }
  } else {
    return res.status(200).json({ message: "No session found" });
  }
};

// Route to handle Google session retrieval
const googlesessionget = async (req, res) => {
  if (req.session && req.user) {
    const email = req.user.email;
    const existingMember1 = await Member.findOne({ email });
    if (existingMember1) {
      const username = {
        ...req.user,
        id: existingMember1._id,
        picture: existingMember1.picture,
      };
      return res
        .status(200)
        .json({ message: "Session is present", user: username });
    } else {
      return res.status(200).json({ message: "No session found" });
    }
  } else {
    return res.status(200).json({ message: "No session found" });
  }
};

// Route to delete session
const sessiondel = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res
        .status(500)
        .json({ message: "Internal server error during logout" });
    } else {
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout successful" });
    }
  });
};

// Define routes
sign.route("/user").post(Userinfostore).put(UserinfoUpdate);
sign.route("/updateMember").put(updateMemberinfo);
sign.route("/").post(signpost);
sign
  .route("/login")
  .get(logingooglematch)
  .post(signget)
  .put(googlesessionget)
  .delete(sessiondel);
sign.route("/loginmatch").post(loginmatch).get(sessionget).delete(sessiondel);
sign.route("/login/forgetpass").post(findEmailotp);
sign.route("/:id").get(findMemberbyId).put(memberget);
sign
  .route("/:projectType/:projectId/member/:memberId")
  .get(findMemberRoleInProject);

module.exports = sign;
