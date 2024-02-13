const mongoose = require("mongoose");
const Member = require('./MemberModule');
const kanbanProjectSchema = new mongoose.Schema({
  projectName: String,
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "KanbanBoard" }],
  members: [{
    member_id: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    role: String,
  },],
  workflow: {
    type: Boolean,
    default: false
  },
  creationTime: {
    type: Date,
    default: () => new Date(),
  }
});

const KanbanProject = mongoose.model("KanbanProject", kanbanProjectSchema);

module.exports = { KanbanProject };


