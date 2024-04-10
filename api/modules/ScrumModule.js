const mongoose = require("mongoose");
const ScrumProjectSchema = new mongoose.Schema({
  projectName: String,
  projectType: {
    type: String,
    default: "Scrum",
  },
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "ScrumBoard" }],
  members: [
    {
      member_id: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
      role: String,
    },
  ],
  weekdays: {
    type: [String], // Assuming you want an array of strings for weekdays
    default: [],    // You can set a default value if needed
  }
});
const ScrumProject = mongoose.model("ScrumProject", ScrumProjectSchema);

module.exports = { ScrumProject };
