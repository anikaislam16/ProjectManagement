const Message = require("../../../modules/MessageModule");

async function createMessage(reqBody) {
  try {
    const { sender, content, question } = reqBody;

    // Create a new message instance
    const newMessage = new Message({
      sender,
      content,
      question,
    });

    // Save the new message to the database
    const savedMessage = await newMessage.save();

    // Find the saved message from the database and populate its fields
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("sender", "name email")
      .populate("question");

    console.log(populatedMessage);
    return populatedMessage;
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

    return populatedMessage;
  } catch (error) {
    throw error;
  }
}
module.exports = {
  createMessage,
  getMessagesByChat,
  updateMessageContent
};
