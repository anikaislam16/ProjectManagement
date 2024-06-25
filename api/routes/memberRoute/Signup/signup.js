var express = require("express");
var sign = express.Router();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const cors = require("cors");
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
let origin = "";

// setup session
sign.use(
  session({
    secret: "12345anika",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://islamanika252:OkPP7MdnGnyBhEBW@student.4omsy08.mongodb.net/student?retryWrites=true&w=majority&appName=student",
      collectionName: "sessions",
    }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 30 * 24 * 60 * 60000, // Session duration in milliseconds (1 day in this example)
      httpOnly: true,
    },
  })
);

var signpost = async (req, res) => {
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

  // Send the OTP to the provided email
  const text = `Your OTP for email verification is: ${otp}`;
  sendOtpEmail(email, text);

  // Respond with success message
  return res.status(200).json({ message: otp });
};
const findEmailotp = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email exists in the Member schema
    const existingMember = await Member.findOne({ email });

    if (!existingMember) {
      // Email not found
      return res.status(200).json({ message: "Invalid email" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send the OTP to the provided email
    const text = `Your OTP for email verification is: ${otp}`;
    sendOtpEmail(email, text);

    // Respond with success message
    return res.status(200).json({ message: otp });
  } catch (error) {
    console.error("Error in sending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// setuppassport
sign.use(passport.initialize());
sign.use(passport.session());
passport.use(
  new OAuth2Strategy(
    {
      clientID:
        "347124022820-950l5na0gp4cipq3s01mppe6ns0albal.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/signup/auth/google/callback", // Adjusted callback URL
      scope: ["profile", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      // // Your verification logic goes here
      // console.log("Verify callback executed");
      // console.log(profile.displayName);
      // console.log(profile.email);

      // Example: Store user data in the session
      const user = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        // Add any other necessary fields
      };

      // You can store the user data in the session
      // Alternatively, you might want to store only the user ID in the session
      // and fetch user data when needed
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

// initial google ouath login
sign
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

sign.route("/auth/google/callback").get(
  ///eta 2bar execute hoi.
  (req, res, next) => {
    // Determine the origin of the request (e.g., from signup or login)
    if (req.query.origin !== undefined) {
      //2nd time execution e origin value change jate na hoi, sejonno.
      origin = req.query.origin;
    }
    //onsole.log(origin);
    // Set the success redirect URL based on the origin
    let successRedirect;
    switch (origin) {
      case "signup":
        successRedirect = `${process.env.front_end}/signup/password`;
        break;
      case "login":
        successRedirect = `${process.env.front_end}/login/temp`;
        break;
      default:
        successRedirect = `${process.env.front_end}/signup`; // Default redirect
    }

    passport.authenticate("google", {
      successRedirect: successRedirect,
      failureRedirect: `${process.env.front_end}/login`,
    })(req, res, next);
  }
);

const signget = async (req, res) => {
  //console.log("fsd");
  const email = req.user.email;
  //console.log(email)
  const user1 = await Member.findOne({ email });
  //console.log(user1);
  if (user1 != null) {
    return res.status(200).json({ message: "Email already exist" });
  }
  if (req.user) {
    // console.log('nulld');
    const user1 = req.user;
    res.status(200).json({ message: "user Login", user: user1 });
  } else {
    res.status(400).json({ message: "Not Authorized" });
  }
};

const logingooglematch = async (req, res) => {
  const email = req.user.email;

  try {
    // Check if the email exists in the Member schema
    const existingMember = await Member.findOne({ email });

    if (!existingMember) {
      // Email not found
      return res.status(200).json({ message: "Invalid email" });
    }

    // Successful login
    return res.status(200).json({ message: "Successful login" });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
sign.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `${process.env.front_end}`);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const loginmatch = async (req, res) => {
  const { email, password } = req.body;
  //console.log(email);
  try {
    // Check if the email exists in the Member schema
    const existingMember = await Member.findOne({ email });

    if (!existingMember) {
      // Email not found
      return res.status(200).json({ message: "Invalid email" });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      existingMember.password
    );

    if (!passwordMatch) {
      // Incorrect password
      return res.status(200).json({ message: "Incorrect password" });
    }
    req.session.isAuth = true;
    req.session.user = {
      displayName: existingMember.name,
      email: existingMember.email,
    };
    //console.log(req.session);

    // Successful login
    return res.status(200).json({ message: "Successful login" });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const sessionget = async (req, res) => {
  if (req.session && req.session.user) {
    const email = req.session.user.email;
    //console.log(email);
    const existingMember1 = await Member.findOne({ email });
    if (existingMember1) {
      const username = {
        ...req.session.user,
        id: existingMember1._id,
        picture: existingMember1.picture,
      };
      res.status(200).json({ message: "Session is present", user: username }); //here req.session.user directly dile kaj krbe na.
      // console.log(username);
    } else res.status(200).json({ message: "No session found" });
  } else {
    res.status(200).json({ message: "No session found" });
  }
};
const googlesessionget = async (req, res) => {
  //console.log(req.session);
  //console.log(req.user);
  if (req.session && req.user) {
    const email = req.user.email;
    const existingMember1 = await Member.findOne({ email });
    if (existingMember1) {
      const username = {
        ...req.user,
        id: existingMember1._id,
        picture: existingMember1.picture,
      };
      res.status(200).json({ message: "Session is present", user: username });
      //console.log(username);
    } else res.status(200).json({ message: "No session found" });
  } else {
    res.status(200).json({ message: "No session found" });
  }
};
const sessiondel = async (req, res) => {
  req.session.destroy((err) => {
    //console.log('dwkf`');
    if (err) {
      //console.log('dwkf`');
      console.error("Error during logout:", err);
      res.status(500).json({ message: "Internal server error during logout" });
    } else {
      //console.log('dkf');
      // Respond with a success message
      res.clearCookie("connect.sid"); // Clear the session cookie
      //console.log('dkf`');
      res.status(200).json({ message: "Logout successful" });
    }
  });
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
