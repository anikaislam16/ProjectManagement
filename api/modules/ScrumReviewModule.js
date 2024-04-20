const mongoose = require("mongoose");

const dailyScrumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["daily", "sprint"],
    required: true,
  },
  scrumDate: {
    type: Date,
    unique: true, // Ensures that each scrum date can only occur once
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScrumProject", // Reference to the Project model if needed
    required: true,
  },
});

const DailyScrum = mongoose.model("DailyScrum", dailyScrumSchema);

module.exports = DailyScrum;
