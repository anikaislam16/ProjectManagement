import React, { useEffect } from 'react';
import Types from "../projectTypes/Types";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:3010/signup/loginmatch', {
          method: "GET",
          credentials: 'include', // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message)
          if (data.message === 'No session found') {
            const response = await fetch('http://localhost:3010/signup/login', {
              method: "PUT",
              credentials: 'include', // Include cookies
            });

            if (response.ok) {
              const data = await response.json();
              console.log(data.message)
              if (data.message === 'No session found') {
                const datasend = { message: "Session Expired" }
                navigate('/login', { state: datasend });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
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
