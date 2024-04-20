import ChatContext from "./ChatContext";
import React, { useContext, useState } from "react";

const ChatContextProvider = (props) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [selectedChatMembers, setSelectedChatMembers] = useState();
  const [chatOwner, setChatOwner] = useState();
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        users,
        setUsers,
        chatOwner,
        setChatOwner,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatContextProvider;
