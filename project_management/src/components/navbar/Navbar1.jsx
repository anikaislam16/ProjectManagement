// Navbar.js
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "./Navbar.css"; // Create this CSS file for styling
const Navbar1 = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const options = ["E-Commerce Website", "E Commerce Website Scrum"];
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    const Elements = document.getElementsByClassName('inv');
    if (loc.pathname === '/login' || loc.pathname === '/signup' || loc.pathname === '/signup/password' || loc.pathname === '/signup/otp') {
      for (let i = 0; i < Elements.length; i++) {
        Elements[i].style.display = 'none';
      }
    } else {
      for (let i = 0; i < Elements.length; i++) {
        Elements[i].style.display = 'block';
      }
    }
  }, [loc.pathname]);
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === "E Commerce Website Scrum") {
      navigate(`project/scrum/65c9a900d23ab9f4a66c12a7`);
    }
    else navigate(`project/kanban/65c31680fe586db7e1c341db`);
  };
  const handleLogout = async () => {
    try {
      // Send a request to the backend to handle the logout
      const response = await fetch("http://localhost:3010/signup/loginmatch", {
        method: 'DELETE', // Assuming you handle logout with a POST request
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        // Redirect to the login page or perform any other actions after successful logout
        navigate('/login');
      } else {
        // Send a request to the backend to handle the logout
        const response = await fetch("http://localhost:3010/signup/login", {
          method: 'DELETE', // Assuming you handle logout with a POST request
          credentials: 'include', // Include cookies
        });

        if (response.ok) {
          // Redirect to the login page or perform any other actions after successful logout
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
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item inv">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              {"Your Projects"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {options.map((option) => (
                <Dropdown.Item
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </li>

        <li className="inv">
          <button className="custom-btn" onClick={handleLogout}>
            <Link to="/login" className="btn-link">
              LogOut
            </Link>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar1;
