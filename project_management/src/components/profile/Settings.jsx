import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SettingsPage.css'; // Import your custom CSS file
import '@fortawesome/fontawesome-free/css/all.css';
import { Modal, Button } from "react-bootstrap";
import ChangePass from './changePass';
//import { checkSession } from '../sessioncheck/session';
const Profile_main = () => {
    var [profilePicture, setProfilePicture] = useState(null); // Initial profile picture
    var [letter, setletter] = useState('');
    var [user, setuser] = useState(null);
    const [editingUsername, setEditingUsername] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setemail] = useState('');
    const [editingOrganization, setEditingOrganization] = useState(false);
    const [organization, setOrganization] = useState('Your Organization');
    const [editpass, setEditpass] = useState(false);
    const [confirmpass, setconfirmpass] = useState(false);
    const [password, setpassword] = useState(false);
    const location = useLocation();
    const [modal, showmodal] = useState(false);
    const [fields, setfieldsname] = useState(''); //this is for showing on modal, that which field is updating.
    useEffect(() => {
        const id = location.state.userId;
        console.log(id);
        const fetchUserData = async () => {
            const response = await fetch(`http://localhost:3010/signup/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data);
            // setuser(user = await checkSession());
            // console.log(user);
            setuser(user = data);
            setUserName(user.name);
            setemail(user.email);
            if (user.organization !== null) {
                setOrganization(user.organization);
            }
            if (user.picture === null) {
                function generateInitials(input) {
                    // Split the input string into words
                    const words = input.split(' ');
                    let initials = '';
                    words.forEach(word => {
                        // If the word is not empty, append its first letter to the initials string
                        if (word.length > 0) {
                            initials += word[0].toUpperCase();
                        }
                    });
                    // Return the initials string
                    return initials;
                }
                setletter(letter = generateInitials(user.name));
                console.log(letter);
            }
            else {
                setProfilePicture(profilePicture = user.picture);
            }
        };
        fetchUserData();
    }, [])
    // Access the user object from the state


    // Now you can use the user object in your component
    console.log(user); // Example usage

    // Function to handle file input change
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) { //file selected na hole eikhane asbe na.
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => { //when file successfully loaded in the browser, tokhon ei onload event call hoi.
                const dataSizeInBytes = new TextEncoder().encode(JSON.stringify(e.target.result)).length;
                if (dataSizeInBytes < 999990) { //this is because , body parser size is set 1MB in the index.js in backend. means, 1 api can send or recieve max. 1MB data at a time
                    setProfilePicture(profilePicture = e.target.result);
                    console.log(profilePicture);
                    const updateUserPicture = async (id, pictureByte) => {
                        console.log(pictureByte)
                        try {
                            const response = await fetch('http://localhost:3010/signup/updateMember', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    id: id,
                                    field: 'picture',
                                    value: pictureByte
                                })
                            });

                            if (!response.ok) {
                                console.log("not updated");
                            }

                            const data = await response.json();
                            user.picture = pictureByte;
                            console.log('User picture updated successfully:', data);
                            setfieldsname('Profile Picture');
                            showmodal(true);
                        } catch (error) {
                            console.error('Error updating user picture:', error.message);
                            throw error;
                        }
                    };
                    updateUserPicture(user._id, profilePicture);
                    document.getElementById('warningSize').style.display = 'none';
                }
                else {
                    document.getElementById('warningSize').style.display = 'block';
                }
            };
        }
    };
    function getColor(letters) {
        // Define an array of attractive colors
        const attractiveColors = ['#FF5733', '#FFC300', '#00FFFF', '#C70039'];

        let colorIndex = 0;

        // Perform operations on the string and calculate a number
        for (let i = 0; i < letters.length; i++) {
            colorIndex += letters.charCodeAt(i);
        }

        // Modulo the number by the length of the attractiveColors array to get the index
        colorIndex = colorIndex % attractiveColors.length;

        return attractiveColors[colorIndex];
    }
    const color = getColor(letter);
    console.log(color);
    const handleEditNameClick = () => {
        setEditingUsername(true);
    };
    const updateField = async (field, value) => {
        try {
            console.log(value, user._id);
            const response = await fetch('http://localhost:3010/signup/updateMember', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: user._id,
                    field: field,
                    value: value
                })
            });

            if (!response.ok) {
                console.log("not updated");
            }

            const data = await response.json();
            //  user.picture = pictureByte;
            console.log('User info updated successfully:', data);
        } catch (error) {
            console.error('Error updating user info:', error.message);
            throw error;
        }
    }
    const handleCancelNameClick = () => {
        setEditingUsername(false);
        setUserName(user.name);
    };

    const handleUpdateNameClick = (e) => {
        // Perform update logic here, e.g., send a request to update the username
        console.log('Updating username:', userName);
        setEditingUsername(false);
        console.log(e);
        updateField('name', userName);
        setfieldsname('User Name');
        showmodal(true);
    };
    const handleEditOrgClick = () => {
        setEditingOrganization(true);
    };

    const handleCancelOrgClick = () => {
        setEditingOrganization(false);
        setOrganization(user.organization ? user.organization : 'Your Organization');
    };

    const handleUpdateOrgClick = () => {
        // Perform update logic here, e.g., send a request to update the username
        console.log('Updating Organiztion:', organization);
        setEditingOrganization(false);
        updateField('organization', organization);
        setfieldsname('Organization Name');
        showmodal(true);
    };
    const handleEditpass = () => {
        setEditpass(true);
    };

    const handleCancelpass = () => {
        setEditpass(false);
        console.log(password);
    };

    const handleUpdatepass = () => {

        const comparePassword = async (email, password) => {
            try {
                const response = await fetch('http://localhost:3010/signup/loginmatch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    throw new Error('Failed to login');
                }

                const data = await response.json();
                return data; // Return data from the server
            } catch (error) {
                console.error('Error logging in:', error.message);
                throw error;
            }
        };
        comparePassword(email, password)
            .then(data => {
                if (data.message === 'Incorrect password') {
                    console.log("kd");
                    document.getElementById('wrongpass').style.display = 'block';
                }
                else {
                    document.getElementById('wrongpass').style.display = 'none';
                    setconfirmpass(true);
                }
            })
            .catch(error => {
                console.error('Login failed:', error.message);
            });
        //updateField('organization', organization);
    };
    const passchanged = () => {
        setconfirmpass(false);
        setEditpass(false);
        setfieldsname('Password');
        showmodal(true);
    }
    const handleCloseModal = () => {
        showmodal(false); // Hide the modal
    };
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Settings</h2>
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card p-4">
                        <div className="mb-4">
                            <h5 className="mb-3">Profile Picture</h5>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="profile-picture-wrapper">
                                    {profilePicture ?
                                        <img className="profile-picture" src={profilePicture} alt="Profile" /> :
                                        <Button className="profile-picture"
                                            variant="primary"
                                            style={{
                                                backgroundColor: color,
                                            }}
                                        >
                                            <h1> {letter} </h1>
                                        </Button>
                                    }
                                    <div className="overlay">
                                        <label htmlFor="upload-input" className="camera-icon">
                                            <i className="fas fa-camera"></i>
                                        </label>
                                        <input id="upload-input" type="file" accept="image/*" onChange={handleFileInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div id='warningSize' style={{ color: 'red', display: 'none' }}>
                                *picture size should be below 1MB
                            </div>
                        </div>
                        <hr />
                        <div className="mb-4">
                            <h5 className="mb-3">Email</h5>
                            <span className="display-text">{email}</span>
                        </div>
                        <hr />
                        <div className="mb-4">
                            <h5 className="mb-3">User Name</h5>
                            {editingUsername ? (
                                <div className="edit-mode"> {/*this div will be visible while editing userName */}
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                    <div className="btn-group mt-2">
                                        <button className="btn btn-primary" onClick={handleUpdateNameClick}>Update</button>
                                        <button className="btn btn-secondary" onClick={handleCancelNameClick}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-between align-items-center">{/*this div will be visible while normal time */}
                                    <span className="display-text">{userName}</span>
                                    <i className="fas fa-pencil-alt text-primary" onClick={handleEditNameClick}></i>
                                </div>
                            )}
                        </div>
                        <hr />
                        <div className="mb-4">
                            <h5 className="mb-3">Password</h5>
                            {editpass ? (confirmpass ? (
                                <div>
                                    <ChangePass func={passchanged} />
                                </div>
                            ) :
                                (<div className="edit-mode"> {/*this div will be visible while editing userName */}
                                    < h3 > Type Existing Password</h3>
                                    <input
                                        type="password"
                                        className="form-control"
                                        onChange={(e) => setpassword(e.target.value)}
                                    />
                                    <div id='wrongpass' style={{ color: 'red', display: 'none' }}>
                                        *Incorrect Password
                                    </div>
                                    <div className="btn-group mt-2">
                                        <button className="btn btn-primary" onClick={handleUpdatepass}>Check Password</button>
                                        <button className="btn btn-secondary" onClick={handleCancelpass}>Cancel</button>
                                    </div>
                                </div>)

                            ) : (
                                <div className="d-flex justify-content-between align-items-center">{/*this div will be visible while normal time */}
                                    <span className="display-text">********</span>
                                    <i className="fas fa-pencil-alt text-primary" onClick={handleEditpass}></i>
                                </div>
                            )}
                        </div>
                        <hr />
                        <div className="mb-4">
                            <h5 className="mb-3">Organization Name</h5>
                            {editingOrganization ? (
                                <div className="edit-mode"> {/*this div will be visible while editing userName */}
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={organization}
                                        onChange={(e) => setOrganization(e.target.value)}
                                    />
                                    <div className="btn-group mt-2">
                                        <button className="btn btn-primary" onClick={handleUpdateOrgClick}>Update</button>
                                        <button className="btn btn-secondary" onClick={handleCancelOrgClick}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-between align-items-center">{/*this div will be visible while normal time */}
                                    <span className="display-text">{organization}</span>
                                    <i className="fas fa-pencil-alt text-primary" onClick={handleEditOrgClick}></i>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
            <Modal show={modal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{`${fields} Updated Successfully`}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
};

export default Profile_main;
