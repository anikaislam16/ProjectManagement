import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { port, host } from "../../common_var";
const Password = () => {
    const [user, setUserData] = useState(null);
    var navigate = useNavigate();
    useEffect(() => {
        // Function to fetch user data from the backend
        console.log('hello');
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3010/signup/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',  // Include credentials for cross-origin requests
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    if (data.message === 'Email already exist') {
                        const datasend = { message: data.message }
                        navigate('/signup', { state: datasend });
                    }
                    else {
                        if (data.user) {
                            // Assuming that the user information is nested under the "user" key
                            setUserData(data.user);
                        } else {
                            console.error('Error fetching user data: User not found in response');
                        }
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

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string().min(6, 'Password must be at least 6 characters')
                .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number').required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            // Check if there are any errors before making the POST request
            if (formik.isValid) {
                // Merge user data with password value
                const userData = {
                    username: user.displayName,
                    email: user.email,
                    password: values.password,
                };

                signupApi(userData)
                    .then((data) => {
                        console.log(data);
                        navigate('/login');
                    })
                    .catch((error) => {
                        console.error('Signup failed:', error);
                        // Handle errors, such as displaying an error message to the user
                    });
            }
        }
    });
    const signupApi = async (userData) => {
        const url = `http://${host}:${port}/signup/user`;
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
            <Row className="mt-5">
                <Col xs={12} md={6} className="mx-auto">
                    <div className="form-box p-4" onMouseEnter={() => formik.setFieldTouched('password', true)}>
                        <h2 className="text-center mb-4">Sign up using Google</h2>
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    {...formik.getFieldProps('password')}
                                    isValid={formik.touched.password && !formik.errors.password}
                                    isInvalid={formik.touched.password && !!formik.errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm your password"
                                    {...formik.getFieldProps('confirmPassword')}
                                    isValid={formik.touched.confirmPassword && !formik.errors.confirmPassword}
                                    isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.confirmPassword}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Button type="submit" variant="primary" className="mt-3">
                                Sign Up
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Password;
