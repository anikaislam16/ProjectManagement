import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import "./LoginPage.css"; // Import your custom CSS file for additional styling
import Goggle from "../signup/Goggle.jsx";
import { getToken, setToken, removeToken } from "./auth"; // Import the utility functions

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      document.getElementById("error").style.display = "block";
      document.getElementById("error").innerHTML = location.state.message;
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      if (data.message === "Invalid email") {
        document.getElementById("error").style.display = "block";
        document.getElementById("error").innerHTML = data.message;
      } else if (data.message === "Successful login") {
        setToken(data.token); // Store the token using utility function
        document.getElementById("error").style.display = "none";
        navigate("/");
      } else {
        document.getElementById("error").style.display = "block";
        document.getElementById("error").innerHTML = data.message;
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  async function loginUser(email, password) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/signup/loginmatch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error in loginUser:", error.message);
      throw new Error("Internal server error");
    }
  }

  const checkSession = async () => {
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/signup/loginmatch`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Session is present") {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  useEffect(() => {
    checkSession();
  }, []); // Run only once when the component mounts

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
