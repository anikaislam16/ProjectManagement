import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { port, host } from "../../common_var";
const UpdatePass = () => {
    const location = useLocation();
    var navigate = useNavigate();
    const { email } = location.state || {};
    useEffect(() => {
        if (!email) {
            // If information is not present, navigate to the signup page
            navigate('/login');
        }
    }, [navigate, email]);
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
                    email: email,
                    password: values.password,
                };
                UpdatePass(userData)
                    .then((data) => {
                        console.log(data);
                        navigate('/login');
                    })
                    .catch((error) => {
                        console.error('Password recovery failed:', error);
                        // Handle errors, such as displaying an error message to the user
                    });

            }
        }
    });
    const UpdatePass = async (userData) => {
        const url = `http://${host}:${port}/signup/user`;
        console.log(url);
        try {
            const response = await fetch(url, {
                method: 'PUT',
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
        <Container>
            <Row className="mt-5">
                <Col xs={12} md={6} className="mx-auto">
                    <div className="form-box p-4" onMouseEnter={() => formik.setFieldTouched('password', true)}>
                        <h2 className="text-center mb-4">Change Password</h2>
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
                                Update
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default UpdatePass;

