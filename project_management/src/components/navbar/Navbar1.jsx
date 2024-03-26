// Navbar.js
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import React, { useState, useEffect } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "./Navbar.css"; // Create this CSS file for styling
import { checkSession } from "../sessioncheck/session";
import Profile from './profile.jsx';
const Navbar1 = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const options = ["E-Commerce Website", "E Commerce Website Scrum"];
  const [selectedOption, setSelectedOption] = useState(null);
  var [user, setUser] = useState({});
  var [letter, setletter] = useState('');
  var [modal, setmodal] = useState(false);

  useEffect(() => {
    if (!(loc.pathname === '/login' || loc.pathname === '/signup' || loc.pathname === '/signup/password' || loc.pathname === '/signup/otp')) {
      console.log("k");
      const fetchUserData = async () => {
        const userData = await checkSession();
        if (userData.hasOwnProperty('message')) {
          console.log("d");
          const datasend = { message: "Session Expired" }
          navigate('/login', { state: datasend });
        }
        else {
          setUser(userData);
          console.log(userData);
          function generateInitials(input) {
            // Split the input string into words
            const words = input.split(' ');
            let initials = '';
            words.forEach(word => {
              // If the word is not empty, append its first letter to the initials string
              if (word.length > 0) {
                initials += word[0].toUpperCase();
              }
            });
            // Return the initials string
            return initials;
          }
          setletter(letter = generateInitials(userData.displayName));
          console.log(letter);
        };
      }
      fetchUserData();
    }
  }, [loc.pathname]);
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
  const handleProfile = () => {
    setmodal(!modal);
  }
  function getColor(letters) {
    // Define an array of attractive colors
    const attractiveColors = ['#FF5733', '#FFC300', '#00FFFF', '#C70039'];

    let colorIndex = 0;

    // Perform operations on the string and calculate a number
    for (let i = 0; i < letters.length; i++) {
      colorIndex += letters.charCodeAt(i);
    }

    // Modulo the number by the length of the attractiveColors array to get the index
    colorIndex = colorIndex % attractiveColors.length;

    return attractiveColors[colorIndex];
  }

  // Example usage
  // const letters = 'AR';
  console.log(letter);
  const color = getColor(letter);
  console.log(color); // This will output one of the colors from the attractiveColors array based on the operations performed on the letters string


  return (
    <div>
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
            <Button onClick={handleProfile}
              variant="primary"
              style={{
                borderRadius: '50%',
                backgroundColor: color,
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                marginLeft: '15px', // Corrected property name
                // Corrected property name
              }}
            >
              {letter}
            </Button>
          </li>
        </ul>
      </nav >
      {modal && <Profile user={user} modal={handleProfile} />}
    </div>
  );
};

export default Navbar1;
