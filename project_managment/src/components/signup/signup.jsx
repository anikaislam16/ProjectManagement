import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Signup.css'; // Import your custom CSS file
import { port, host } from "../../common_var";
import Google from './Goggle.jsx';
const Signup = () => {
    var navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {

        if (location.state) {
            document.getElementById('error').style.display = 'block';
            console.log(location.state.message);
        }
    }, [location.state]);
    const initialValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters')
            .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number').required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    const onSubmit = (values) => {
        console.log('Form submitted:', values);
        if (Object.keys(formik.errors).length === 0) {
            const userData = {
                username: values.username,
                email: values.email,
                password: values.password
            };

            signupApi(userData)
                .then((data) => {
                    if (data.message === 'Email already exist') {
                        document.getElementById('error').style.display = 'block';
                    }
                    else {
                        document.getElementById('error').style.display = 'none';
                        const datasend = { ...userData, otp: data.message };
                        //navigate to login page
                        console.log(datasend);
                        navigate('/signup/otp', { state: datasend });
                    }
                })
                .catch((error) => {
                    console.error('Signup failed:', error);
                    // Handle errors, such as displaying an error message to the user
                });

        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit,
    });

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
        <div className="container d-flex justify-content-center  align-items-center" >
            <div className="signup-box p-4 m-3 shadow">
                <h1 style={{ textAlign: 'center' }} >Sign Up</h1>
                <br />
                <form onSubmit={formik.handleSubmit} id="form">
                    <div className="pt-3">
                        <label htmlFor="username" className="form-label">
                            Username:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                        />
                        {formik.touched.username && formik.errors.username ? (
                            <div className="text-danger">{formik.errors.username}</div>
                        ) : null}
                    </div>

                    <div className="pt-3">
                        <label htmlFor="email" className="form-label">
                            Email:
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-danger">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div className="pt-3">
                        <label htmlFor="password" className="form-label">
                            Password:
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-danger">{formik.errors.password}</div>
                        ) : null}
                    </div>

                    <div className="pt-3">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.confirmPassword}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="text-danger">{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        Submit
                    </button>
                </form>
                <p style={{ display: 'none', color: 'red' }} id='error'><br />*Email already exist</p>
                <div className="mt-3">
                    <p>
                        Already have an account?<Link to='/login'>Login</Link>
                    </p>
                </div>

                <div className="mt-3">
                    <br />
                    <Google />
                    {/* Add your Google Sign-up logic here */}
                </div>
            </div>
        </div>
    );
};

export default Signup;
