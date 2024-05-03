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
  var [profilePicture, setProfilePicture] = useState(null); // Initial profile picture
  const searchParams = useSearchParams();
  var [user, setUser] = useState({});
  var [letter, setletter] = useState('');
  var [modal, setmodal] = useState(false);
  var [projects, setProjects] = useState([]);
  useEffect(() => {
    if (!(loc.pathname === '/login' || loc.pathname === '/signup' || loc.pathname === '/signup/password' || loc.pathname === '/signup/otp' || loc.pathname === '/forgot-password' || loc.pathname === '/forgot-password/otp' || loc.pathname === '/Updatepass')) {
      console.log("k");
      const fetchUserData = async () => {
        const userData = await checkSession();
        if (userData.hasOwnProperty('message')) {
          console.log("d");
          const datasend = { message: "Session Expired" }
          navigate('/login', { state: datasend });
        }
        else {
          setUser(user = userData);
          console.log(userData);
          if (user.picture === null) {
            setProfilePicture(null);
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
            const response = await fetch(`http://localhost:3010/signup/${user.id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data);
            setletter(letter = generateInitials(data.name));
            console.log(letter);
          }
          else {
            setProfilePicture(profilePicture = user.picture);
          }
          const fetchProjectData = async () => {
            try {
              console.log("ks");
              const response = await fetch('http://localhost:3010/projects/kanban/', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ memberId: user.id })
              });
              const data = await response.json();
              console.log(data);
              if (!data.hasOwnProperty('message')) {
                console.log('Kanban Projects find successfully:', projects);
                setProjects(projects = data.projects);
                console.log(projects);
              }
              else {
                setProjects(projects = []);
              }
              const responseScrum = await fetch('http://localhost:3010/projects/scrum/', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ memberId: user.id })
              });

              const dataScrum = await responseScrum.json();
              if (!dataScrum.hasOwnProperty('message')) {
                console.log(dataScrum.projects);
                const projectarr = [...projects, ...dataScrum.projects]
                console.log(projectarr);
                setProjects(projectarr);
              }
              console.log('Projects updated successfully:', projects);
            } catch (error) {
              console.error('Error updating projects by member:', error.message);
              throw error;
            }
          }
          fetchProjectData();
        };
      }
      fetchUserData();
    }
  }, [loc.pathname]);
  useEffect(() => {
    const Elements = document.getElementsByClassName('inv');
    if (loc.pathname === '/login' || loc.pathname === '/signup' || loc.pathname === '/signup/password' || loc.pathname === '/signup/otp' || loc.pathname === '/forgot-password' || loc.pathname === '/forgot-password/otp' || loc.pathname === '/Updatepass') {
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
    if (option.projectType === "Scrum") {
      navigate(`project/scrum/${option._id}`);
    }
    else navigate(`project/kanban/${option._id}`);
  };
  const handleHomeBtn = () => {
    navigate(`/`);
  }
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
            <Button className="btn btn-light" onClick={handleHomeBtn}> Home </Button>
          </li>
          <li className="navbar-item inv">
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                {"Your Projects"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {projects.map((project) => (
                  <Dropdown.Item
                    key={project._id}
                    onClick={() => handleOptionSelect(project)}
                  >
                    {project.projectName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </li>

          <li className="inv">
            {profilePicture ?
              <img style={{
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
              }} src={profilePicture} alt="Profile" onClick={handleProfile} /> : <Button onClick={handleProfile}
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
              </Button>}
          </li>
        </ul>
      </nav >
      {modal && <Profile user={user} modal={handleProfile} />}
    </div>
  );
};

export default Navbar1;
