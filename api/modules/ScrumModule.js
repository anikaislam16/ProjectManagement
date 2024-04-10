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
<<<<<<< HEAD
    default: [], // You can set a default value if needed
=======
    default: [],    // You can set a default value if needed
>>>>>>> 3d5f624bc97d741ad0f7bdf193c3fea7ac614243
  },
  creationTime: {
    type: Date,
    default: () => new Date(),
  },
  creator: {
<<<<<<< HEAD
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
=======
    type: mongoose.Schema.Types.ObjectId, ref: "Member",
  }
>>>>>>> 3d5f624bc97d741ad0f7bdf193c3fea7ac614243
});
const ScrumProject = mongoose.model("ScrumProject", ScrumProjectSchema);

module.exports = { ScrumProject };
