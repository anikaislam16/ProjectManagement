export const isSameSenderMargin = (messages, m,i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 10;
  else return "auto";
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
export const addNoticeBoxToProject =async (
  projectType,
  projectId,
  question,
  usersArray,
  groupadmin
) => {
  
  console.log(projectType, projectId, question, usersArray, groupadmin);
  console.log(Array.isArray(usersArray));
  if (projectType === "kanban") {
    var newQuestion = null;
    newQuestion = {
      question: question,
      kanbanProject: projectId,
      users: usersArray,
      groupAdmin: groupadmin,
      projectType: "kanban",
    };
  } else if (projectType === "scrum") {
    newQuestion = {
      question: question,
      scrumProject: projectId,
      users: usersArray,
      groupAdmin: groupadmin,
      projectType:"scrum"
    };
  }
   try {
      const response = await fetch(`${process.env.REACT_APP_HOST}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add Question. Server responded with ${response.status} ${response.statusText}`
        );
      }
      
     
    } catch (error) {
      console.error("Error Could not add question:", error.message);
    }
};