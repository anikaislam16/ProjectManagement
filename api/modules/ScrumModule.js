const mongoose = require("mongoose");
const ScrumProjectSchema = new mongoose.Schema({
  projectName: String,
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "ScrumBoard" }],
  members: [{
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    role: String,
  }],
});
const ScrumProject = mongoose.model("ScrumProject", ScrumProjectSchema);

module.exports = { ScrumProject };
