const { ScrumProject } = require("../../../modules/ScrumModule");
const { Member } = require("../../../modules/MemberModule");
const { ScrumBoard } = require("../../../modules/ScrumBoards");
const { sendJoingProjectEmail, sendRemovingProjectEmail } = require("./SendMail");
// Function to handle errors
const handleErrors = (res, error) => {
  console.error(error);
  res.status(500).json({ message: "Internal Server Error" });
};

// Get all scrum projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await ScrumProject.find();
    res.json(projects);
  } catch (error) {
    handleErrors(res, error);
  }
};

// Get a specific scrum project
const getProjectById = async (req, res) => {
  try {
    const project = await ScrumProject.findById(req.params.id).populate(
      "boards"
    );
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// Create a new scrum project
const createProject = async (req, res) => {
  const email = req.body.email;
  const existingMember = await Member.findOne({ email });
  const project = new ScrumProject({
    projectName: req.body.projectName,
    members: [
      {
        member_id: existingMember._id,
        role: 'Product owner',
      },]
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    handleErrors(res, error);
  }
};

// Update a Scrum project (using PATCH for partial updates)
const updateProject = async (req, res) => {
  try {
    const updatedProject = await ScrumProject.findByIdAndUpdate(
      req.params.id,
      {
        projectName: req.body.projectName,

        // Add more fields as needed
      },
      { new: true }
    );
    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    handleErrors(res, error);
  }
};

const deleteProject = async (req, res) => {
  try {
    await ScrumProject.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (error) {
    handleErrors(res, error);
  }
};
const deleteMemberfromProject = async (req, res) => {
  try {
    const projectId = req.params.id; // Assuming projectId is the same as memberId
    const memberId = req.params.memberId;
    console.log("project", projectId, memberId);
    // Find the ScrumProject by projectId
    const scrumProject = await ScrumProject.findOne({ _id: projectId });

    if (!scrumProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    foundMember = scrumProject.members.find(member => member.member_id.toString() === memberId);
    const Memberdetails = await Member.findOne({ _id: memberId });
    // Remove the member from the members array based on memberId
    scrumProject.members = scrumProject.members.filter(member => member.member_id.toString() !== memberId);
    console.log(Memberdetails.email, Memberdetails.name, scrumProject.projectName, foundMember.role);
    sendRemovingProjectEmail(Memberdetails.email, Memberdetails.name, scrumProject.projectName, foundMember.role);
    // Save the updated ScrumProject
    await scrumProject.save();
    // Update all boards to remove the specified member_id
    const updateResult = await ScrumBoard.updateMany(
      { 'cards.members.member_id': memberId },
      { $pull: { 'cards.$[].members': { member_id: memberId } } },
      { multi: true }
    );
    console.log('Update result:', updateResult);

    ///ekhane mail er function.
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const addMemberInProject = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { email, member_id, role, username } = req.body;

    // Find the ScrumProject by ID
    const scrumProject = await ScrumProject.findById(id);
    console.log("scrum", scrumProject);
    if (!scrumProject) {
      return res.status(200).json({ message: 'Scrum Project not found' });//ei line dekha lagbe.
    }

    sendJoingProjectEmail(email, username, id, scrumProject.projectName, role);
    // Add the new member to the members array
    scrumProject.members.push({ member_id, role });

    // Save the updated ScrumProject
    await scrumProject.save();

    res.status(200).json({ message: 'Member added successfully', scrumProject });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteMemberfromProject,
  addMemberInProject,
};
