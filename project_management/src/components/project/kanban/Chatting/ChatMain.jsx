import React, { useContext, useEffect, useState } from "react";
import SidebarContext from "../../../../sidebar_app/components/sidebar_context/SidebarContext";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./ChatMain.css";
import io from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
const socket = io.connect("http://localhost:3010");
export default function ChatMain() {
  const { open } = useContext(SidebarContext);
  const navigate = useNavigate();
  const location = useLocation();

  // const [msg, setMsg] = useState("");
  // const [room, setRoom] = useState("");
  // const [recmsg, setRecmsg] = useState("");
  // Assuming you're using useParams to get the project ID
  // const sendMessage = () => {
  //   // socket.emit("send_message", { message: "Hello" });
  //   console.log(msg, room);
  //   ///sending a message in a room
  //   socket.emit("send_message", { msg, room });
  // };
  // const joinRoom = () => {
  //   if (room !== "") {
  //     console.log(room);
  //     socket.emit("join_room", room);
  //   }
  // };
  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     setRecmsg(data.msg);
  //   });
  // }, [socket]);
  const openChatBox = (type) => {
    console.log(location.pathname);
    if (type === "You") {
      const newPath = location.pathname.replace("/chat", "/chatbox");
      navigate(newPath); // Replace "/your-path" with the actual path
    } else {
      // Handle other types if needed
      const newPath = location.pathname.replace("/chat", "/chatbox");
      navigate(newPath);
    }
  };
  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""} `}
      style={{ paddingBottom: "100px" }}
    >
      <div className="center-content">
        {/* <input
          type="text"
          placeholder="room number"
          onChange={(e) => {
            console.log(e.target.value); // Print the value to the console
            setRoom(e.target.value); // Update the room state
          }}
          value={room}
        />
        <button onClick={joinRoom}>Join Room</button>
        <input
          type="text"
          placeholder="send message"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button onClick={sendMessage}>SendMessage</button>
        <h1>Message:{recmsg}</h1> */}
        <div className="containers">
          <div
            className="child big-bold-text"
            onClick={() => openChatBox("You")}
          >
            Your Questions
          </div>
          <div className="child big-bold-text">Other's Questions</div>
          <div className="child big-bold-text">Notices</div>
        </div>
      </div>
    </div>
  );
}
