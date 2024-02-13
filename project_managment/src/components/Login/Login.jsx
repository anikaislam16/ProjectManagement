import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "./LoginPage.css"; // Import your custom CSS file for additional styling
import { port, host } from "../../common_var";
import Goggle from "../signup/Goggle.jsx";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3010/signup/loginmatch', {
          method: "GET",
          credentials: 'include', // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          if (data.message === 'Session is present')
            navigate('/');
          else {
            const response = await fetch('http://localhost:3010/signup/login', {
              method: "PUT",
              credentials: 'include', // Include cookies
            });

            if (response.ok) {
              const data = await response.json();
              console.log(data.message)
              if (data.message === 'Session is present')
                navigate('/');
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkSession();
  }, [navigate]); // Empty dependency array means it will run only once

  useEffect(() => {
    if (location.state) {
      document.getElementById("error").style.display = "block";
      document.getElementById("error").innerHTML = location.state.message;
    }
  }, [location.state]);
  // Dummy function for handling form submission
  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(email, password)
      .then((data) => {
        if (data.message === "Invalid email") {
          document.getElementById("error").style.display = "block";
          document.getElementById("error").innerHTML = data.message;
        }
        if (data.message === "Successful login") {
          document.getElementById("error").style.display = "none";
          navigate("/");
        } else {
          document.getElementById("error").style.display = "block";
          document.getElementById("error").innerHTML = data.message;
        }
      })
      .catch((error) => console.error("Error:", error.message));
    // Handle login logic here
  };
  async function loginUser(email, password) {
    try {
      const response = await fetch(`http://localhost:${port}/signup/loginmatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials (cookies)
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle error response
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // Successful response
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error in loginUser:", error.message);
      throw new Error("Internal server error");
    }
  }
  return (
    <div className="login-container">
      <div className="login-box">
        <Form className="login-form" onSubmit={handleLogin}>
          <h2 className="mb-4 text-center">Login</h2>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mb-3">
            Login
          </Button>
          <p style={{ display: "none", color: "red" }} id="error">
            <br />
          </p>

          <div className="text-end">
            <Link to="/forgot-password">Forgot Password?</Link>
            <span className="mx-2">|</span>
            <Link to="/signup">Create an Account</Link>
          </div>
        </Form>
        <Goggle />
      </div>
    </div>
  );
};

export default Login;
