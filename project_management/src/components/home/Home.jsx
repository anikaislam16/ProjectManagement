import React, { useEffect } from "react";
import Types from "../projectTypes/Types";
import { useNavigate } from "react-router-dom";
import { getToken } from "../Login/auth";
const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
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
    checkSession();
  }, [navigate]); // Empty dependency array means it will run only once

  return (
    <div>
      <Types />
    </div>
  );
};

export default Home;
