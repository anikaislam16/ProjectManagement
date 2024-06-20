// CardMember.js
import React, { useState, useEffect } from 'react';
import './CardMember.css'; // Import your CSS file
import { useParams } from "react-router-dom";
import { Button } from 'react-bootstrap';
import ReplaceMemberModal from './ReplaceMemberModal.jsx';
const CardMember = (props) => {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const { projectId } = useParams();
    const [availableMembers, setMembers] = useState([]);
    const [replaceMemberModal, showReplaceMemberModal] = useState(false);
    const [replaceMember, setReplaceMember] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3010/projects/scrum/${projectId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (Array.isArray(data.members)) {
                        const fetchMemberDetails = async () => {
                            const updatedMembersPromises = data.members.map(async (member) => {
                                const memberDetailsResponse = await fetch(`http://localhost:3010/signup/${member.member_id}`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });

                                if (memberDetailsResponse.ok) {
                                    const memberDetails = await memberDetailsResponse.json();
                                    return { ...member, username: memberDetails.name, email: memberDetails.email };
                                } else {
                                    console.error('Error fetching member details:', memberDetailsResponse.statusText);
                                    return member;
                                }
                            });

                            const updatedMembers = await Promise.all(updatedMembersPromises);
                            const filteredArray = updatedMembers.filter(item => item.role === 'Developer');
                            console.log(filteredArray);
                            setMembers(filteredArray);
                            //console.log("kd", availableMembers);
                        };

                        fetchMemberDetails();
                    } else {
                        console.error('Data members is not an array:', data.members);
                    }
                } else {
                    console.error('Error fetching data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
        const fetchMembersData = async () => {
            const apiUrl = `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.cardId}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any additional headers as needed
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.card.members);
                    if (data.card.members && Array.isArray(data.card.members)) {
                        // Extract member_id values from the data.members array
                        const memberIds = data.card.members.map((member) => member.member_id);
                        console.log(memberIds);
                        return memberIds;
                    } else {
                        console.error('Invalid data format:', data);
                        // Handle errors or return an appropriate value
                    }
                } else {
                    console.error('Error fetching members data:', response.statusText);
                    // Handle errors or return an appropriate value
                }
            } catch (error) {
                console.error('Error fetching members data:', error.message);
                // Handle errors or return an appropriate value
            }
        };
        const wait = async () => {
            const membersArray = await fetchMembersData();
            setSelectedMembers(membersArray);
            console.log(membersArray);
        }
        wait();

    }, [projectId]);
    const removeMemberfromCard = async (memberId) => {
        console.log(memberId);
        setSelectedMembers((prevMembers) =>
            prevMembers.filter((id) => id !== memberId)
        );
        const key = 'members';
        const apiUrl = `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.cardId}/${key}/${memberId}`;

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
    const handleMemberClick = async (memberId, role, memberName) => { //ekhane memberId selected list e ase kina ta check kora hoi. jodi thake, tahole baad dibe. r na thakle include krbe.
        console.log('Selected Members:', selectedMembers);
        const isSelected = selectedMembers.includes(memberId);
        if (isSelected) {
            const response = await fetch(`http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.cardId}
                `);
            if (response.ok) {
                const data = await response.json();
                console.log(data.card.task);
                let cnt_task = 0;
                for (const task of data.card.task) {
                    try {
                        const response_task = await fetch(`http://localhost:3010/test/scrum/${task._id}`);
                        if (!response_task.ok) {
                            continue;
                        }
                        const data_task = await response_task.json();
                        const count = data_task.filter(item => item.creator_id === memberId).length;
                        cnt_task += count;
                    }
                    catch (error) {
                        console.error('Error fetching test cases:', error);
                    }
                }
                console.log(cnt_task)
                if (cnt_task > 0) {
                    setReplaceMember({ name: memberName, id: memberId });
                    showReplaceMemberModal(true);
                }
                else {
                    removeMemberfromCard(memberId, role);
                }
            }
        }
        //ekhane fetch api te object pathabo. = (field name, new value) new value o 1ta obj. jeta member_id r role store kore. update card name use kore krbo
        else {
            console.log(props.bid);
            console.log(props.cardId);
            setSelectedMembers((prevMembers) => [memberId, ...prevMembers]);
            const newValue = { member_id: memberId, role: role };
            const apiUrl = `http://localhost:3010/projects/scrum/${projectId}/${props.bid}/${props.cardId}`;

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
            //eta delete card name use kore korbo. ekhane, param er moddhei, boardId,cardId,field name, r field er je id k delete krbo ta pathabo.
        }
    };
    const handleReplacement = async (deletedMemberId, replacedId) => {
        console.log(deletedMemberId, replacedId)
        if (deletedMemberId === replacedId) {
            try {
                const response = await fetch(`http://localhost:3010/test/scrum/${projectId}/manytest/${props.bid}/${props.cardId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ deletedMemberId })
                });

                if (!response.ok) {
                    throw new Error('Failed to delete tests');
                }

                console.log('Tests deleted successfully');
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
        else {
            try {
                const response = await fetch(`http://localhost:3010/test/scrum/${projectId}/manytest/${props.bid}/${props.cardId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ deletedMemberId, replacedId })
                });

                if (!response.ok) {
                    throw new Error('Failed to replace tests');
                }

                console.log('Tests replaced successfully');
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
        showReplaceMemberModal(false);
        removeMemberfromCard(deletedMemberId);
    }
    // Move selected members to the beginning
    const sortedMembers = availableMembers.sort((a, b) => {
        const isSelectedA = selectedMembers.includes(a.member_id);
        const isSelectedB = selectedMembers.includes(b.member_id);

        if (isSelectedA && !isSelectedB) {
            return -1;
        } else if (!isSelectedA && isSelectedB) {
            return 1;
        } else {
            return 0;
        }
    });

    return (
        <div className="card-member-box" style={{ cursor: props.member_role === 'Scrum Master' ? 'pointer' : 'default' }}>
            <h3>Available Members</h3>
            <ul className="list-group">
                {sortedMembers.map((member) => (
                    <li
                        key={member.id}
                        onClick={() => (props.member_role === 'Scrum Master') ? handleMemberClick(member.member_id, member.role, member.username) : null}
                        className={`list-group-item d-flex justify-content-between align-items-center ${selectedMembers.includes(member.member_id) ? 'active' : ''
                            }`}
                    >
                        <div style={{ flex: 1 }}>  {/* Make sure the username and email container takes full width available except for the badge */}
                            <div>{member.username}</div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>{member.email}</div>
                        </div>
                        {selectedMembers.includes(member.member_id) && (
                            <span className="badge ">✔</span>
                        )}
                    </li>
                ))}
            </ul>
            replaceMemberModal &&   (<ReplaceMemberModal
                show={replaceMemberModal}
                handleClose={() => showReplaceMemberModal(false)}
                handleChange={handleReplacement}
                replaceMember={replaceMember}
                members={sortedMembers}
                count={selectedMembers.length}
            />)
        </div>
    );
};

export default CardMember;
