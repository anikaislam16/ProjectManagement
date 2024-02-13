import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Form as BootstrapForm } from "react-bootstrap";
import InvitePopup from "./InvitePopup.jsx"; // Adjust the path accordingly
import "bootstrap/dist/css/bootstrap.min.css";
import "./InviteMemberForm.css";
import { useParams } from "react-router-dom";
const InviteMemberForm = ({ members, onInvite }) => {
    const { projectId } = useParams();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            role: "developer",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            role: Yup.string().required("Role is required"),
        }),
        onSubmit: (values) => {
            // Check if the email is already present in any existing member's email
            const isEmailAlreadyExists = members.some((member) => member.email === values.email);

            if (isEmailAlreadyExists) {
                setPopupMessage(
                    <div>
                        <p>
                            The user with email <span style={{ color: 'red' }}>{values.email}</span> is already in this project.
                        </p>
                    </div>
                );
                setShowPopup(true);
            } else {
                const handleFetchMemberInfo = async () => {
                    try {
                        const em = values.email;
                        const response = await fetch(`http://localhost:3010/signup/${em}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        const data = await response.json();
                        console.log(data);
                        if (response.ok) {
                            if (data.message === "Member not found") {
                                setPopupMessage(
                                    <div>
                                        <p>
                                            The user with email <span style={{ color: 'red' }}>{values.email}</span> is not registered in our System.
                                        </p>
                                    </div>
                                );
                                setShowPopup(true);
                            }
                            else {
                                const newMember = {
                                    email: values.email,
                                    member_id: data._id,
                                    role: values.role,
                                    username: data.name,
                                };
                                //  console.log(projectId, data._id);
                                const response = await fetch(`http://localhost:3010/projects/scrum/member/member/${projectId}/${data._id}`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(newMember),
                                });

                                const data1 = await response.json();
                                if (response.ok) {
                                    console.log('Member added successfully', data1.scrumProject);
                                    // Handle success, if needed
                                } else {
                                    console.error('Error adding member:', data1.message);
                                    // Handle error, if needed
                                }
                                // Call the onInvite function to add the new member
                                onInvite(newMember);

                                // Reset form fields
                                formik.resetForm();
                            }
                        } else {
                            console.error('Error fetching member info:', data.message);
                        }
                    } catch (error) {
                        console.error('Error fetching member info:', error.message);
                    }
                };
                handleFetchMemberInfo();
            }
        },
    });

    return (
        <div className="card invite-member-card">
            <div className="card-body">
                <h3 className="card-title">Invite New Member</h3>
                <BootstrapForm onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <BootstrapForm.Group controlId="email">
                            <BootstrapForm.Label>Email:</BootstrapForm.Label>
                            <BootstrapForm.Control
                                type="email"
                                name="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-danger">{formik.errors.email}</div>
                            )}
                        </BootstrapForm.Group>
                    </div>
                    <div className="mb-3">
                        <BootstrapForm.Group controlId="role">
                            <BootstrapForm.Label>Role:</BootstrapForm.Label>
                            <BootstrapForm.Control
                                as="select"
                                name="role"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.role}
                            >
                                <option value="Product owner">Product owner</option>
                                <option value="Stackholder">Stackholder</option>
                                <option value="Scrum Master"> Scrum Master</option>
                                <option value="Developer">Developer</option>
                            </BootstrapForm.Control>
                            {formik.touched.role && formik.errors.role && (
                                <div className="text-danger">{formik.errors.role}</div>
                            )}
                        </BootstrapForm.Group>
                    </div>
                    <Button type="submit" variant="primary">
                        Invite
                    </Button>
                </BootstrapForm>
            </div>

            {/* Popup */}
            <InvitePopup show={showPopup} handleClose={handleClosePopup} message={popupMessage} />
        </div>
    );
};

export default InviteMemberForm;
