import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Temp() {
    var navigate = useNavigate();
    useEffect(() => {
        // Function to fetch user data from the backend
        console.log('hello');
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3010/signup/login', {
                    method: 'GET',
                    credentials: 'include',  // Include credentials for cross-origin requests
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    if (data.message === 'Invalid email') {
                        const datasend = { message: data.message }
                        navigate('/login', { state: datasend });
                    }
                    else {
                        navigate('/');//eta home page e niye jabe. kintu homepage theke back e click krle, ei page dekhabe na. karon eipage onload ei home or login page e niye jai. tai back e click krleo, seta onload e take abar home ei niye asbe.
                    }
                } else {
                    console.error('Error fetching user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Fetch user data on component mount
        fetchUserData();
    }, [navigate]); // Empty dependency array ensures the effect runs only once on mount

    return (
        <div>

        </div>
    )
}
