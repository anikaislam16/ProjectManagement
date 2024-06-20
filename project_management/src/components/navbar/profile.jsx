import React, { useState, useEffect } from "react";
import "./profile.css";
import { Link, useNavigate } from "react-router-dom";
const Profile = ({ user, modal }) => {
  // const loc = useLocation();
  const navigate = useNavigate();
  //const searchParams = useSearchParams();
  const [name, setname] = useState("");
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
        setname(data.name); // Uncomment if you have a state variable for name
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUserData();
  }, []);
  const handlemodal = () => {
    navigate(`/member/${name}${user.id}`, { state: { userId: user.id } });
    modal();
  };
  const handleproject = () => {
    navigate(`/member/${name}/myProjects`, { state: { userId: user.id } });
    modal();
  };
  const handleLogout = async () => {
    try {
      // Send a request to the backend to handle the logout
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/signup/loginmatch`,
        {
          method: "DELETE", // Assuming you handle logout with a POST request
          credentials: "include", // Include cookies
        }
      );

      if (response.ok) {
        // Redirect to the login page or perform any other actions after successful logout
        modal();
        navigate("/login");
      } else {
        // Send a request to the backend to handle the logout
        const response = await fetch(
          `${process.env.REACT_APP_HOST}/signup/login`,
          {
            method: "DELETE", // Assuming you handle logout with a POST request
            credentials: "include", // Include cookies
          }
        );

        if (response.ok) {
          // Redirect to the login page or perform any other actions after successful logout
          modal();
          navigate("/login");
        } else {
          console.error("Logout failed");
        }
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
          {/* <Link to={{
                        pathname: `/member/${user.displayName}${user.id}`,
                        state: true
                    }} className="btn-link" onClick={handlemodal1}> */}
          <div className="option" onClick={handlemodal}>
            <span>
              <img className="img" src="/settings.png" />
            </span>{" "}
            Settings
          </div>
          {/* </Link> */}
          <div className="option" onClick={handleproject}>
            <span>
              <img className="img" src="/project-management.png" />
            </span>{" "}
            My Projects
          </div>
          <div className="option" onClick={handleLogout}>
            <span>
              <img className="img" src="/exit.png" />
            </span>{" "}
            LogOut
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
