import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CardSelectionModal = ({ show, handleClose, member_id, member, projectId, onDelete }) => {
    const [cards, setCards] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    // Function to fetch cards from the API
    const getCards = async () => {
        try {
            const response = await fetch(`http://localhost:3010/projects/scrum/${projectId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch project data');
            }
            const data = await response.json();
            let cards = [];
            data.boards.forEach(board => {
                board.cards.forEach(card => {
                    card.board_id = board._id;
                    cards.push(card);
                });
            });
            const filteredCards = cards
                .filter(card => card.members.some(member => member.member_id === member_id))
                .map(card => ({ id: card._id, name: card.cardName, boardId: card.board_id, members: card.members }));
            console.log(filteredCards);
            setCards(filteredCards);
        } catch (error) {
            console.error('Error fetching project data:', error.message);
        }
    };

    // Update members state when props change
    useEffect(() => {
        if (member) {
            const filteredMembers = member.filter(m => m.role === 'Developer' && m.member_id !== member_id)
                .map(({ username, member_id }) => ({ name: username, id: member_id }));
            setMembers(filteredMembers);
            if (filteredMembers.length > 0) {
                setSelectedMember(filteredMembers[0].id);
            }
            getCards();
        }
    }, [member, member_id]);

    // Handle card selection change
    const handleCardChange = (card) => {
        setSelectedCards(prevState =>
            prevState.some(selectedCard => selectedCard.id === card.id)
                ? prevState.filter(selectedCard => selectedCard.id !== card.id)
                : [...prevState, card]
        );
    };

    // Handle member selection change
    const handleMemberChange = (event) => {
        setSelectedMember(event.target.value);
    };

    // Function to remove a member from a card
    const removeMember = async (card) => {
        const apiUrl = `http://localhost:3010/projects/scrum/${projectId}/${card.boardId}/${card.id}/members/${member_id}`;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.error('Error updating members:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating members:', error.message);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            for (const card of selectedCards) {
                const checkMemberIdInCardMember = card.members && card.members.length > 0 && card.members.some(member => member.member_id === selectedMember);

                if (!checkMemberIdInCardMember) {
                    const newValue = { member_id: selectedMember, role: "Developer" };
                    const apiUrl = `http://localhost:3010/projects/scrum/${projectId}/${card.boardId}/${card.id}`;
                    try {
                        const response = await fetch(apiUrl, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                fieldName: 'members', newValue
                            }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            console.log(data);
                            // Optionally, you can return the updated data or handle it as needed
                        } else {
                            console.error('Error updating members:', response.statusText);
                            // Handle errors
                        }
                    } catch (error) {
                        console.error('Error updating members:', error.message);
                        // Handle errors
                    }
                }

                const response = await fetch(`http://localhost:3010/test/scrum/${projectId}/manytest/${card.boardId}/${card.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ deletedMemberId: member_id, replacedId: selectedMember })
                });
                console.log(response.json());
                if (!response.ok) {
                    throw new Error('Failed to replace tests');
                }
                await removeMember(card);
                console.log('Tests replaced successfully');
            }
            const updatedCards = cards.filter(card => !selectedCards.some(selectedCard => selectedCard.id === card.id));
            setCards(updatedCards);
            setSelectedCards([]);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    // Handle delete action
    const handleDelete = () => {
        setCards([]);
        setSelectedCards([]);
        onDelete(member_id);
        handleClose();
    };

    const isSubmitDisabled = selectedCards.length === 0 || members.length === 0;
    const allCardsSelected = selectedCards.length === cards.length;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Assign Cards of Deleted Member  to other Developers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 border-right">
                            <h5 className="mb-3">Select Cards</h5>
                            {cards.map(card => (
                                <Form.Check
                                    key={card.id}
                                    type="checkbox"
                                    id={`card-${card.id}`}
                                    label={card.name}
                                    checked={selectedCards.some(selectedCard => selectedCard.id === card.id)}
                                    onChange={() => handleCardChange(card)}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                        <div className="col-md-6">
                            <h5 className="mb-3">Assigned to</h5>
                            {members.map(member => (
                                <Form.Check
                                    key={member.id}
                                    type="radio"
                                    id={`member-${member.id}`}
                                    name="assignedMember"
                                    label={member.name}
                                    value={member.id}
                                    checked={selectedMember === member.id}
                                    onChange={handleMemberChange}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                {allCardsSelected ? (
                    <Button variant="danger" onClick={async () => {
                        await handleSubmit();
                        handleDelete();
                    }}>
                        Assign and Delete
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                    >
                        Assign
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default CardSelectionModal;
