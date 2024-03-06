import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, Outlet } from 'react-router-dom';
import { port, host } from "../../common_var";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Forgetpass = () => {
    const navigate = useNavigate();

    // Formik and Yup integration
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: (values) => {
            handleSendOTP(values.email);
        },
    });

    const handleSendOTP = (email) => {
        const userData = { email: email };
        FindEmailApi(userData)
            .then((data) => {
                if (data.message === 'Invalid email') {
                    document.getElementById('error').style.display = 'block';
                    navigate('/forgot-password');
                }
                else {
                    document.getElementById('error').style.display = 'none';
                    // Navigate to the OTP page with data
                    const datasend = { email: email, otp: data.message };
                    navigate('otp', { state: datasend });
                }
            })
            .catch((error) => {
                console.error('Password recovery failed:', error);
                // Handle errors, such as displaying an error message to the user
            });
    };

    const FindEmailApi = async (userData) => {
        const url = `http://${host}:${port}/signup/login/forgetpass`;
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
            console.log(responseData);
            return responseData;
        } catch (error) {
            console.error('Error during API call:', error.message);
            throw error;
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-4">Email Verification</h2>
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={formik.touched.email && formik.errors.email}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <br />
                            <Button variant="primary" type="submit" style={{ display: 'block', width: '100%' }}>
                                Send OTP
                            </Button>
                            <p style={{ display: 'none', color: 'red' }} id='error'><br />*Invalid Email</p>
                        </Form>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default Forgetpass;
