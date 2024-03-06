import React from 'react'
import { useLocation } from 'react-router-dom';
export default function Goggle() {
    const loc = useLocation();
    var heading = '';
    var origin = '';
    if (loc.pathname === '/signup') {
        heading = 'Sign up using Google account'
        origin = 'signup'
        console.log(origin);
    }
    if (loc.pathname === '/login') {
        heading = 'Log in with Google'
        origin = 'login'
        // console.log(origin);
    }
    var onclick = async () => {
        const redirectURL = `http://localhost:3010/signup/auth/google/callback?origin=${origin}`
        window.open(redirectURL, "_self");
    }
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',  // Adjust this value if needed, sets the button to be centered vertically in the viewport
            }}>

            <button
                style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',  // Smooth transition for background color
                }}
                onClick={onclick}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}  // Change background on hover
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}   // Restore background on leave
                onMouseDown={(e) => e.target.style.backgroundColor = '#e0e0e0'}   // Change background on click
                onMouseUp={(e) => e.target.style.backgroundColor = '#f0f0f0'}     // Restore background on release
            >
                <img type='image'
                    src='./google-logo.png'
                    alt='' // Replace with the actual path to your Google logo image
                    style={{ marginRight: '10px', width: '30px', height: '30px' }}
                />
                {heading}
            </button>
        </div>
    );
}
