
const Question = require("../../../modules/QuestionModule");

// Function to create a question
async function createQuestion(req, res) {
  try {
    // Extracting necessary data from request body
    const {
      question,
      scrumProject,
      kanbanProject,
      users,
      groupAdmin,
      projectType,
    } = req.body;
    console.log(question, scrumProject, kanbanProject, users, groupAdmin ,projectType);
    // Creating a new question instance
    const newQuestion = new Question({
      question,
      scrumProject,
      kanbanProject,
      users,
      groupAdmin,
      projectType,
    });

    // Saving the new question to the database
    const savedQuestion = await newQuestion.save();

    // Find the saved question from the database and populate the users and groupAdmin fields
    const populatedQuestion = await Question.findById(savedQuestion._id)
      .populate("users", "-password") // Exclude password field from users
      .populate("groupAdmin", "-password"); // Exclude password field from groupAdmin

    // Print something
    console.log("Question created successfully:", populatedQuestion);

    // Sending the populated question as response
    res.status(201).json(savedQuestion);
  } catch (error) {
    // Handling errors
    console.error("Error creating question:", error.message);
    res.status(500).json({ message: error.message });
  }
}
const findChatsForMe = async (req, res) => {
   console.log("Hell");
    try {
      const { groupAdminId, ProjectId, projectType } = req.body;
      const projectIdString = ProjectId.toString();
      var chats = null;
      if (projectType === "scrum")
      {
        chats = await Question.find({
          $and: [
            { groupAdmin: groupAdminId },
            { scrumProject: ProjectId },
            {
              question: { $not: { $regex: projectIdString, $options: "i" } },
            }, // Exclude case-insensitive match
          ],
        }).exec();
        }
      else
      {
         chats = await Question.find({
           $and: [
             { groupAdmin: groupAdminId },
             { kanbanProject: ProjectId },
             {
               question: { $not: { $regex: projectIdString, $options: "i" } },
             }, // Exclude case-insensitive match
           ],
         }).exec();
        }

      res.json(chats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const findChats = async (req, res) => {
  try {
    console.log('Hell no')
    const { groupAdminId, ProjectId, projectType } = req.body;
    const projectIdString = ProjectId.toString();
    let chats = null;

    if (projectType === "scrum") {
      chats = await Question.find({
        $and: [
          { scrumProject: ProjectId },
          { users: { $in: [groupAdminId] } },
          { groupAdmin: { $ne: groupAdminId } },
          {
            question: { $not: { $regex: projectIdString, $options: "i" } },
          }, // Exclude case-insensitive match// Check if groupAdminId is in the users array
        ],
      }).exec();
      console.log(chats)
    } else {
      chats = await Question.find({
        $and: [
          { kanbanProject: ProjectId },
          { users: { $in: [groupAdminId] } },
          { groupAdmin: { $ne: groupAdminId } },
          {
            question: { $not: { $regex: projectIdString, $options: "i" } },
          }, // Exclude case-insensitive match// Check if groupAdminId is in the users array
        ],
      }).exec();
    }
 
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const findNotice = async (req, res) => {
  try {
  
    const { groupAdminId, ProjectId, projectType } = req.body;
    let chats = null;
    console.log(groupAdminId, ProjectId, projectType);
    const projectIdString = ProjectId.toString();
    if (projectType === "scrum") {
      chats = await Question.find({
        $and: [
          { scrumProject: ProjectId },
          { users: { $in: [groupAdminId] } },

          {
            question: { $regex: projectIdString, $options: "i" },
          }, // Case-insensitive match
        ],
      }).exec();
      console.log(chats);
    } else {
      chats = await Question.find({
        $and: [
          { kanbanProject: ProjectId },
          { users: { $in: [groupAdminId] } },
          {
            question: { $regex: projectIdString, $options: "i" },
          }, // Case-insensitive match
        ],
      }).exec();
    }

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const addUserToQuestion = async (req, res) => {
  const { projectId, projectType, userId } = req.body;
 console.log(projectId, projectType, userId);
  try {
    if (!projectId || !userId) {
      return res
        .status(400)
        .json({ error: "projectId and userId are required" });
    }

    let query;
    if (projectType === "kanban") {
      query = {
        kanbanProject: projectId,
        users: { $ne: userId },
      };
    } else if (projectType === "scrum") {
      query = {
        scrumProject: projectId,
        // Ensure userId is not in the users array
        // Ensure groupAdmin is not equal to userId
      };
    } else {
      return res.status(400).json({ error: "Invalid project type" });
    }

    // Find questions matching the query
    const questions = await Question.find(query);
    console.log(questions);
    // Update questions with userId not in users array
    for (const question of questions) {
      if (!question.users.includes(userId)) {
        question.users.push(userId);
        await question.save();
      }
    }

    // Fetch the updated documents
    const updatedQuestions = await Question.find(query);

    res.status(200).json(updatedQuestions);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error adding user to questions",
        details: error.message,
      });
  }
};
const removeUserFromQuestion = async (req, res) => {
  const { projectId, projectType, userId } = req.body;
  console.log(projectId, projectType, userId);

  try {
    if (!projectId || !userId) {
      return res
        .status(400)
        .json({ error: "projectId and userId are required" });
    }

    let query;
    if (projectType === "kanban") {
      query = {
        kanbanProject: projectId,
        users: userId, // Find questions where userId is in the users array
      };
    } else if (projectType === "scrum") {
      query = {
        scrumProject: projectId,
        users: userId, // Find questions where userId is in the users array
      };
    } else {
      return res.status(400).json({ error: "Invalid project type" });
    }

    // Find questions matching the query
    const questions = await Question.find(query);
   

    // Update questions by removing userId from users array
    for (const question of questions) {
      const userIndex = question.users.indexOf(userId);
      console.log(userIndex);
      if (userIndex > -1) {
        question.users.splice(userIndex, 1);
        await question.save();
      }
    }

    // Fetch the updated documents
    const updatedQuestions = await Question.find(query);

    res.status(200).json(updatedQuestions);
  } catch (error) {
    res.status(500).json({
      error: "Error removing user from questions",
      details: error.message,
    });
  }
};
const updateNotification = async (req, res) => {
   const { questionId, userId } = req.body;

   try {
     if (!questionId || !userId) {
       return res
         .status(400)
         .json({ error: "questionId and userId are required" });
     }

     // Find the question by its ID
     const question = await Question.findById(questionId);

     if (!question) {
       return res.status(404).json({ error: "Question not found" });
     }

     // Check if the user is already in the notificationOffarray
     const userIndex = question.notificationOffarray.indexOf(userId);

     if (userIndex === -1) {
       // User is not in notificationOffarray, push them
       question.notificationOffarray.push(userId);
     } else {
       // User is in notificationOffarray, remove them
       question.notificationOffarray.splice(userIndex, 1);
     }

     // Save the updated question
     await question.save();

     res.status(200).json(question);
   } catch (error) {
     res.status(500).json({
       error: "Error toggling user notification",
       details: error.message,
     });
   }
};


module.exports = {
  createQuestion,
  findChats,
  findChatsForMe,
  findNotice,
  addUserToQuestion,
  removeUserFromQuestion,
  updateNotification
}; // Exporting the function
