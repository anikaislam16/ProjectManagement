import React from 'react';
import "./profile.css";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
const Profile = ({ user, modal }) => {
    const loc = useLocation();
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    const handlemodal = () => {
        modal();
    }
    const handleLogout = async () => {
        try {
            // Send a request to the backend to handle the logout
            const response = await fetch("http://localhost:3010/signup/loginmatch", {
                method: 'DELETE', // Assuming you handle logout with a POST request
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                // Redirect to the login page or perform any other actions after successful logout
                modal();
                navigate('/login');
            } else {
                // Send a request to the backend to handle the logout
                const response = await fetch("http://localhost:3010/signup/login", {
                    method: 'DELETE', // Assuming you handle logout with a POST request
                    credentials: 'include', // Include cookies
                });

                if (response.ok) {
                    // Redirect to the login page or perform any other actions after successful logout
                    modal();
                    navigate('/login');
                }
                else {
                    console.error('Logout failed');
                }

            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-box">
                <div className="profile-header">
                    <div className="username">{user.displayName}</div>
                    <div className="email">{user.email}</div>
                </div>
                <div className="profile-options">
                    <div className="option" onClick={handlemodal}><span>
                        <img className="img" src="/settings.png" />
                    </span> <Link to={`/member/${user.displayName}${user.id}`} className="btn-link">
                            Settings
                        </Link></div>
                    <div className="option" onClick={handlemodal}><span>
                        <img className="img" src="/project-management.png" />
                    </span>My Projects</div>
                    <div className="option" onClick={handleLogout}><span>
                        <img className="img" src="/exit.png" />
                    </span>  <Link to="/login" className="btn-link">
                            LogOut
                        </Link></div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
