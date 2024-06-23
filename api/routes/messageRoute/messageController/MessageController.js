const Message = require("../../../modules/MessageModule");
const Question = require("../../../modules/QuestionModule");
const { Member } = require("../../..//modules/MemberModule");
const {sendNotificationEmail} = require("../../memberRoute/Signup/findmemberbyId");
const { KanbanProject } = require("../../../modules/KanbanModule");
const { ScrumProject } = require("../../../modules/ScrumModule");
async function yourFunction(email, question, projectName, projectType, projectId, type)
{
console.log(email, question, projectName, projectType, projectId, type);
}
async function sendNotification(question, sender, type, content) {
  const questionDoc = await Question.findById(question);
  const questionName = questionDoc.question;
  const projectType = questionDoc.projectType;
  var projectId = null;
  var project = null;
  console.log(projectType);
  if (projectType == "scrum") {
    projectId = questionDoc.scrumProject;
    //console.log(projectId);
    project = await ScrumProject.findById(projectId);
    //console.log(project);
  } else if (projectType == "kanban") {
    projectId = questionDoc.kanbanProject;
    project = await KanbanProject.findById(projectId);
  }
  const projectName = project.projectName;
  console.log(questionName, type, content, projectName);
  //console.log(questionDoc);
  // Filter the users array to include only those not in the notificationOffArray
  // First filter: exclude users in the notificationOffarray
  const usersToNotify = questionDoc.users.filter(
    (userId) => !questionDoc.notificationOffarray.includes(userId)
  );

  // Second filter: exclude the sender
  const filteredUsers = usersToNotify.filter(
    (userId) => userId.toString() !== sender.toString()
  );
 
  // Log the filtered users
  const users = await Member.find(
    {
      _id: { $in: filteredUsers },
    },
    "email"
  ); // Fetch only the email field
  type = type + " Message";
  const qName = questionName.split("#")[0];
  const emailIds = users.map((user) => user.email);
  for (let i = 0; i < emailIds.length; i++) {
    const email = emailIds[i];
    // Call your function for each email ID
    const subject = ` ${type} from ${qName} from ${projectName}`;
    const html = `<p>${type} from <b>${qName}</b> from project ${projectName}</p>
      <p>Click the button below to check Question:</p>
      <a href="${process.env.front_end}/project/${projectType}/${projectId}/chat" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;">Check Board</a>`;
    await sendNotificationEmail(
      email,
      subject,html
    );
    // Log the filtered users and their emails
    ///console.log("Filtered Users: ", filteredUsers);
    ///console.log("Email IDs: ", emailIds);

  }
}
async function createMessage(reqBody) {
  try {
    const { sender, content, question } = reqBody;

    // Create a new message instance
    const newMessage = new Message({
      sender,
      content,
      question,
      Likes: [],
    });

    // Save the new message to the database
    const savedMessage = await newMessage.save();

    // Check if the saved message exists
    if (savedMessage) {
      // Find the saved message from the database and populate its fields
      const populatedMessage = await Message.findById(savedMessage._id)
        .populate("sender", "name email")
        .populate("question");

      //console.log(populatedMessage);
      const content = populatedMessage.content;
         await sendNotification(question, sender, "New", content);
      //console.log('hi')
      //console.log(questions);
      return populatedMessage;
    } else {
      throw new Error("Saved message is null or undefined");
    }
  } catch (error) {
    // Handle errors
    throw new Error("Error creating message: " + error.message);
  }
}



async function getMessagesByChat(chatId) {
  try {
    // Find all messages with the given chatId
    const messages = await Message.find({ question: chatId })
      .populate("sender", "name email")
      .populate("question");
    return messages;
  } catch (error) {
    // Handle errors
    throw new Error(error.message);
  }
}
async function updateMessageContent(messageId, newContent) {
  try {
    // Find the message by ID and update its content
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { content: newContent },
      { new: true } // Return the updated document
    );

    if (!updatedMessage) {
      throw new Error("Message not found");
    }
    const populatedMessage = await Message.findById(messageId)
      .populate("sender", "name email")
      .populate("question");
    if (populatedMessage)
    {
        const sender = populatedMessage.sender._id;
        const question = populatedMessage.question._id;
      console.log(sender, question);
       const content = populatedMessage.content;
        await sendNotification(question, sender, "Edited", content);
      }
  
     
    return populatedMessage;
  } catch (error) {
    throw error;
  }
}
async function toggleLikeForMember(reqQuery) {
  try {
    const { memberId, messageId } = reqQuery;

    // Check if both memberId and messageId are provided
    if (!memberId || !messageId) {
      throw new Error("Both memberId and messageId must be provided.");
    }

    // Find the message by its ID
    const message = await Message.findById(messageId);

    // If message not found, throw an error
    if (!message) {
      throw new Error("Message not found.");
    }

    // Check if the memberId is already in the Likes array
    const index = message.Likes.indexOf(memberId);

    let isLiked;
    let updatedLikesCount = message.Likes.length;

    if (index === -1) {
      // If memberId is not present, add it to Likes array
      message.Likes.push(memberId);
      isLiked = true;
      updatedLikesCount++;
    } else {
      // If memberId is present, remove it from Likes array
      message.Likes.splice(index, 1);
      isLiked = false;
      updatedLikesCount--;
    }

    // Save the updated message
    await message.save();
     const messages = await Message.findById(messageId);
    console.log(messages.Likes);
    const Liked = {
      Likes: messages.Likes,
      updatedLikesCount,
      isLiked,
    };
    console.log(Liked)
   return Liked;
  } catch (error) {
    throw new Error("Error toggling like: " + error.message);
  }
}

module.exports = {
  createMessage,
  getMessagesByChat,
  updateMessageContent,
  toggleLikeForMember
};
