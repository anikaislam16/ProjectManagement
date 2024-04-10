const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/student");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}
module.exports = connectToMongoDB;