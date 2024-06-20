
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReplaceMemberModal = ({ show, handleClose, handleChange, replaceMember, members, count }) => {
    count--;
    var [id, setId] = useState(null);
    useEffect(() => {
        setId(id = replaceMember.id);
        console.log(replaceMember);
    }, [replaceMember])
    members = members.slice(0, (count));
    members = members.filter(member => member.member_id !== replaceMember.id);
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Replace Member</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="deleteTests">
                        <Form.Check
                            type="radio"
                            label={`Delete all test for ${replaceMember.name}`}
                            name="replaceMemberOptions"
                            onChange={() => setId(id = replaceMember.id)}
                            checked={(id === replaceMember.id || id === undefined)}
                        />
                    </Form.Group>
                    <h5 className="mt-4">Replace creator for all tests created by {replaceMember.name}</h5>
                    {members.map((member, index) => (
                        (<Form.Group key={index} controlId={`replaceMember${index}`} className="custom-form-check">
                            <Form.Check
                                type="radio"
                                label={<><b>{member.username}</b>&nbsp;&nbsp;&nbsp;&nbsp; ({member.email})</>}
                                name="replaceMemberOptions"
                                className="custom-radio"
                                onChange={() => setId(id = member.member_id)}
                            />
                        </Form.Group>)
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleChange(replaceMember.id, id)}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReplaceMemberModal;
