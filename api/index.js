const express = require("express");
 
const morgan = require("morgan");
const memberRoute = require("./routes/memberRoute/MemberInfo");
const TestRoute=require('./routes/testRoute/TestRoute.js')
const kanbanRoute = require("./routes/kanbanRoute/KanbanRoute");
const connectToMongoDB = require("./server.js");


const app = express();


const ScrumRoute = require("./routes/scrumRoute/ScrumRoute.js");
const pdfRoute = require("./routes/pdfRoutes/pdfRoutes.js");
const MessageRoute = require("./routes/messageRoute/MessageRoute.js");
const cors = require("cors");
const env = require("dotenv");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");

// Parse JSON request body
app.use(bodyParser.json({ limit: '1mb' })); // Adjust the limit as needed

env.config({ path: "./data.env" });
app.use(cookieParser());

const Signroute = require("./routes/memberRoute/Signup/signup");

env.config({ path: "./data.env" });



// Parse JSON request body
app.use(bodyParser.json({ limit: '1mb' })); // Adjust the limit as needed
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));
connectToMongoDB();

// Define a route for the index page
app.get("/", (req, res) => {
  res.send("Welcome to the Project Management");
});


app.use(
  cors({
    origin: `${process.env.front_end}`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
const PORT = process.env.PORT || 3000;
 const server=app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 
app.use("/members", memberRoute);
app.use("/projects/kanban", kanbanRoute);
app.use("/projects/scrum", ScrumRoute);
app.use("/signup", Signroute);
app.use("/pdf", pdfRoute);
app.use("/message", MessageRoute);
app.use("/test", TestRoute);

