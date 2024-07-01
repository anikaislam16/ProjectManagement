var express = require("express");
var sign = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const nodemailer = require("nodemailer");
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
var bcrypt = require("bcryptjs");
const { generateToken, authenticateToken } = require("./auth");
require("dotenv").config();

let origin = "";

// Passport setup and Google OAuth
sign.use(passport.initialize());
passport.use(
  new OAuth2Strategy(
    {
      clientID:
        "347124022820-950l5na0gp4cipq3s01mppe6ns0albal.apps.googleusercontent.com",
      clientSecret: "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",
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

// initial google oauth login
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
      successRedirect = `${process.env.front_end}/signup/password`;
      break;
    case "login":
      successRedirect = `${process.env.front_end}/login/temp`;
      break;
    default:
      successRedirect = `${process.env.front_end}/signup`;
  }

  passport.authenticate("google", {
    successRedirect: successRedirect,
    failureRedirect: `${process.env.front_end}/login`,
  })(req, res, next);
});

const signpost = async (req, res) => {
  const { email } = req.body;
  const user = await Member.findOne({ email });
  if (user) {
    return res.status(200).json({ message: "Email already exist" });
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

const signget = async (req, res) => {
  const email = req.user.email;
  const user1 = await Member.findOne({ email });
  if (user1 != null) {
    return res.status(200).json({ message: "Email already exist" });
  }
  if (req.user) {
    const user1 = req.user;
    const token = generateToken(user1);
    res.status(200).json({ message: "user Login", user: user1, token });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
};

const logingooglematch = async (req, res) => {
  const email = req.user.email;

  try {
    const existingMember = await Member.findOne({ email });

    if (!existingMember) {
      return res.status(200).json({ message: "Invalid email" });
    }

    const token = generateToken(existingMember);

    return res.status(200).json({ message: "Successful login", token });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

sign.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    `https://project-management-topaz-ten.vercel.app`
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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

    const token = generateToken(existingMember);

    return res.status(200).json({ message: "Successful login", token });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const sessionget = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, "123anika", async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      const existingMember1 = await Member.findOne({ email: user.email });
      if (existingMember1) {
        const username = {
          ...user,
          id: existingMember1._id,
          picture: existingMember1.picture,
        };
        res.status(200).json({ message: "Session is present", user: username });
      } else {
        res.status(200).json({ message: "No session found" });
      }
    });
  } else {
    res.status(200).json({ message: "No session found" });
  }
};

const googlesessionget = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    jwt.verify(token, "123anika", async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      const existingMember1 = await Member.findOne({ email: user.email });
      if (existingMember1) {
        const username = {
          ...user,
          id: existingMember1._id,
          picture: existingMember1.picture,
        };
        res.status(200).json({ message: "Session is present", user: username });
      } else {
        res.status(200).json({ message: "No session found" });
      }
    });
  } else {
    res.status(200).json({ message: "No session found" });
  }
};

const sessiondel = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};

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
