import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarContext from "../../../../sidebar_app/components/sidebar_context/SidebarContext";
import InviteMemberForm from "./InviteMemberForm";
import './Member.css';
import InvitePopup from "./InvitePopup.jsx";
const Members = () => {
  const { open } = useContext(SidebarContext);
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState(null);
  const [members, setMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3010/projects/kanban/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProjectName(data.projectName);

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
              setMembers(updatedMembers);
              console.log("mem:", members);
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
  }, [projectId]);
  const handleRemoveMember = async (memberId, role) => {
    const adminCount = members.filter(member => member.role === 'admin').length;
    if (adminCount === 1 && role === 'admin') {
      // Show the InvitePopup with the specified message
      setShowPopup(true);
    }
    else {
      setShowPopup(false);
      // Filter out the member with the specified memberId
      const updatedMembers = members.filter((member) => member.member_id !== memberId);

      // Update the state with the filtered array
      setMembers(updatedMembers);

      try {
        // Send a DELETE request to remove the member on the server
        const response = await fetch(`http://localhost:3010/projects/kanban/member/member/${projectId}/${memberId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers as needed
          },
        });

        if (response.ok) {
          console.log(`Member with ID ${memberId} successfully deleted.`);
          // Optionally, handle success scenarios here
        } else {
          console.error('Error deleting member:', response.statusText);
          // Optionally, handle error scenarios here
        }
      } catch (error) {
        console.error('Error in handleRemoveMember:', error.message);
        // Optionally, handle error scenarios here
      }
    }
  };
  const handleInvite = (newMember) => {
    // Add the new member to the members array
    setMembers([...members, newMember]);
  };
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`} style={{ overflow: 'auto', paddingBottom: "50px" }}>
      <div className="center-content">
        <h1 className="mb-4">All Current members of {projectName}</h1>

        <div className="list-group-container">
          <ul className="list-group">
            {members.map((member, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {index + 1}. {member.username}
                </div>
                <div className="text-center flex-fill">
                  {member.role}
                </div>
                <button className="btn btn-danger" onClick={() => handleRemoveMember(member.member_id, member.role)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div>
        <InviteMemberForm members={members} onInvite={handleInvite} />
      </div>
      <InvitePopup show={showPopup} handleClose={handleClosePopup} message={"Project must have at least 1 admin"} />
    </div >
  );
};

export default Members;
