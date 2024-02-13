const express = require("express");
const morgan = require("morgan");
const memberRoute = require("./routes/memberRoute/MemberInfo");
const app = express();
const kanbanRoute = require('./routes/kanbanRoute/KanbanRoute');
const ScrumRoute = require("./routes/scrumRoute/ScrumRoute.js");
const pdfRoute = require('./routes/pdfRoutes/pdfRoutes.js');
const cors = require("cors");
var env = require("dotenv");
const cookieParser = require("cookie-parser");
env.config({ path: "./data.env" });
app.use(cookieParser());
const Signroute = require("./routes/memberRoute/Signup/signup");
app.use(express.json());
//app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

// Define a route for the index page
app.get("/", (req, res) => {
  res.send("Welcome to the Backend Index Page!");
});
app.use(cors({ origin: true, credentials: true }));
app.use(
    cors({
        origin: `http://localhost:${process.env.front_port}`,
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);

// Use the memberRoute for paths starting with "/members"
app.use("/members", memberRoute);
app.use('/projects/kanban', kanbanRoute);
app.use("/projects/scrum", ScrumRoute);
app.use("/signup", Signroute);
app.use("/pdf", pdfRoute);
module.exports = app;
