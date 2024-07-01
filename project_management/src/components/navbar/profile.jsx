import React, { useState, useEffect } from "react";
import "./profile.css";
import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../Login/auth"; // Import the removeToken function

const Profile = ({ user, modal }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_HOST}/signup/${user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setName(data.name);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUserData();
  }, [user.id]);

  const handleModal = () => {
    navigate(`/member/${name}${user.id}`, { state: { userId: user.id } });
    modal();
  };

  const handleProject = () => {
    navigate(`/member/${name}/myProjects`, { state: { userId: user.id } });
    modal();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/signup/loginmatch`,
        {
          method: "DELETE", // Assuming you handle logout with a DELETE request
          credentials: "include",
        }
      );

      if (response.ok) {
        removeToken(); // Remove the token from local storage
        modal();
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-header">
          <div className="username">{name}</div>
          <div className="email">{user.email}</div>
        </div>
        <div className="profile-options">
          <div className="option" onClick={handleModal}>
            <span>
              <img className="img" src="/settings.png" alt="settings" />
            </span>{" "}
            Settings
          </div>
          <div className="option" onClick={handleProject}>
            <span>
              <img
                className="img"
                src="/project-management.png"
                alt="projects"
              />
            </span>{" "}
            My Projects
          </div>
          <div className="option" onClick={handleLogout}>
            <span>
              <img className="img" src="/exit.png" alt="logout" />
            </span>{" "}
            LogOut
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
