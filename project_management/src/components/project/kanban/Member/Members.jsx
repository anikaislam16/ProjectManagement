import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarContext from "../../../../sidebar_app/components/sidebar_context/SidebarContext";
import InviteMemberForm from "./InviteMemberForm";
import './Member.css';
import InvitePopup from "./InvitePopup.jsx";
import { checkSession } from "../../../sessioncheck/session.js";
import { checkKanbanRole } from "../checkKanbanRole.js";
const Members = () => {
  const navigate = useNavigate();
  const { open } = useContext(SidebarContext);
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState(null);
  const [members, setMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  var [role, setrole] = useState(null);
  const [userId, setuserId] = useState(null);
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
    const getRoles = async () => {
      const userData = await checkSession();
      if (userData.hasOwnProperty('message')) {
        const datasend = { message: "Session Expired" }
        navigate('/login', { state: datasend });
      }
      else {
        const projectrole = await checkKanbanRole(projectId, userData.id);
        setrole(role = projectrole.role);
      }
    }
    fetchData();
    getRoles();
  }, [projectId]);
  const handleRemoveMember = async (memberId, role) => {
    const adminCount = members.filter(member => member.role === 'admin').length;
    console.log(adminCount);
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
      if (userId === memberId) {
        navigate(`/`);
      }
    }
  };
  const handleInvite = (newMember) => {
    // Add the new member to the members array
    setMembers([...members, newMember]);
  };
  const handledragpermission = async (memberId) => {
    const updatedMembers = members.map(member => {
      if (member.member_id === memberId) {
        // Toggle the 'drag' status
        return { ...member, drag: member.drag === 'enable' ? 'disable' : 'enable' };
      }
      return member;
    });

    // Update the members state with the new array
    setMembers(updatedMembers);
    const url = `http://localhost:3010/projects/kanban/member/member/${projectId}/${memberId}`;
    try {
      const response = await fetch(url, {
        method: 'PUT', // Specify the method
        headers: {
          'Content-Type': 'application/json' // Specify the content type
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Assuming server sends back JSON data
      console.log('Success:', data);
    } catch (error) {
      console.error('Error updating member drag status:', error);
    }
  }
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`} style={{ overflow: 'auto', paddingBottom: "50px" }}>
      <div className="center-content">
        <h1 className="mb-4">All Current members of {projectName}</h1>

        <div className="list-group-container" style={{ maxHeight: '450px' }}>
          <ul className="list-group" style={role === 'admin' ? { maxHeight: '300px' } : { maxHeight: '430px' }}>
            {members.map((member, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div className={role === 'admin' ? "col-4" : "col-6"}>
                  <div>{index + 1}. {member.username}</div>
                  <div className="text-muted"><h6 style={{ color: 'gray' }}>{member.email}</h6></div>
                </div>
                <div className={role === 'admin' ? "col-5" : "col-4"}>
                  {member.role}
                </div>
                {role === 'admin' ?
                  <div className="col-3">
                    <div class="d-flex justify-content-start align-items-center">
                      <button className="btn btn-danger m-2" onClick={() => handleRemoveMember(member.member_id, member.role)}>
                        Remove
                      </button>
                      {member.role === 'developer' && <button className="btn btn-primary m-2 " style={member.drag === 'enable' ? { backgroundColor: 'blue' } : { backgroundColor: "#84ADEA" }} onClick={() => {
                        handledragpermission(member.member_id);
                      }}>
                        {member.drag === 'enable' ?
                          <div>
                            Enable workflow control</div> : <div> Disable workflow control</div>}
                      </button>}
                    </div>
                  </div> :
                  <div className="col-2" style={member.drag === 'enable' ? { color: 'blue' } : { color: "red" }}>
                    {member.role === 'developer' && <div>{member.drag === 'enable' ?
                      <div>
                        Workflow control enabled</div> : <div> Workflow control disabled</div>}</div>}
                  </div>
                }
              </li>
            ))}
          </ul>
        </div>

      </div>
      {
        role === 'admin' &&
        <div>
          <InviteMemberForm members={members} onInvite={handleInvite} />
        </div>
      }

      <InvitePopup show={showPopup} handleClose={handleClosePopup} message={"Project must have at least 1 admin"} />
    </div >
  );
};

export default Members;
