import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { port, host } from "../../common_var";

export default function OTP() {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve user details from the location state
    const { username, email, password, otp: initialExpectedOTP } = location.state || {};

    // State for the user input OTP, error message, and timer
    const [userInputOTP, setUserInputOTP] = useState('');
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [expectedOTP, setExpectedOTP] = useState(initialExpectedOTP);

    // Function to handle OTP verification
    const verifyOTP = () => {
        try {
            // Convert expected OTP to string for comparison
            const expectedOTPString = expectedOTP.toString();

            // Check if user input OTP matches the expected OTP
            if (userInputOTP === expectedOTPString) {
                // If OTP matches, navigate to the login page
                const userData = {
                    username: username,
                    email: email,
                    password: password,
                };

                signupstoreApi(userData)
                    .then((data) => {
                        console.log(data);
                        navigate('/login');
                    })
                    .catch((error) => {
                        console.error('Signup failed:', error);
                        // Handle errors, such as displaying an error message to the user
                    })
                navigate('/login');
            } else {
                // If OTP is incorrect, set an error message
                setError('Incorrect OTP. Please try again.');
            }
        } catch (error) {
            // Handle other errors (e.g., unexpected exceptions)
            console.error('Error during OTP verification:', error);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    // useEffect to check if necessary information is present on component mount
    useEffect(() => {
        if (!username || !email || !password || !initialExpectedOTP) {
            // If information is not present, navigate to the signup page
            navigate('/signup');
        }
    }, [navigate, username, email, password, initialExpectedOTP]);

    // useEffect for countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // useEffect to handle timer expiration
    useEffect(() => {
        if (timer === 0) {
            setExpectedOTP(null); // Expire the expected OTP after the timer is over
        }
    }, [timer]);

    // Function to handle resend button click
    const handleResendClick = () => {
        // Implement your logic for resending OTP (e.g., generating a new OTP)
        var userData = {
            username: username,
            email: email,
            password: password
        };
        console.log(userData);
        signupApi(userData)
            .then((data) => {
                setExpectedOTP(data.message);
                setTimer(300); // Reset the timer to 5 minutes
                setError(''); // Clear any previous error messages
            })
            .catch((error) => {
                console.error('Signup failed:', error);
                // Handle errors, such as displaying an error message to the user
            });

    };

    const signupstoreApi = async (userData) => {
        const url1 = `http://${host}:${port}/signup/user`;
        console.log(url1);
        try {
            const response = await fetch(url1, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                // Handle error if the response status is not OK
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Assuming the server sends back JSON data
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error during API call:', error.message);
            throw error;
        }
    }

    const signupApi = async (userData) => {
        const url = `http://${host}:${port}/signup/`;
        console.log(url);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                // Handle error if the response status is not OK
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Assuming the server sends back JSON data
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error during API call:', error.message);
            throw error;
        }
    }



    return (
        <Container>
            <h1>OTP Verification</h1>
            <p>Please enter the 6-digit OTP sent to your email.</p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form>
                <Form.Group controlId="otpInput">
                    <Form.Label>Enter OTP:</Form.Label>
                    <Form.Control
                        type="text"
                        maxLength="6"
                        value={userInputOTP}
                        onChange={(e) => setUserInputOTP(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" onClick={verifyOTP}>
                    Verify OTP
                </Button>
                <br />
                <br />


                <br />
                {timer > 0 ? (
                    <p>Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
                ) : (
                    <Button variant="primary" onClick={handleResendClick}>
                        Resend OTP
                    </Button>
                )}
            </Form>
        </Container>
    );
}