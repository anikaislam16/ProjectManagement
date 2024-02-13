const mongoose = require("mongoose");
const app = require('./index');
mongoose
    .connect("mongodb://127.0.0.1:27017/student")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });
app.listen(process.env.port, () => {
    console.log(`Server is running on http://${process.env.host}:${process.env.port}`);
});