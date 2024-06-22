import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SidebarContext from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum.jsx";
import InviteMemberForm from "./InviteMemberForm";
import "./Member.css";
import InvitePopup from "./InvitePopup.jsx";
import { checkSession } from "../../../sessioncheck/session.js";
import { checkScrumRole } from "../checkScrumRole.js";
import CardSelectionModal from "./CardSelectionModal.jsx";
const MemberScrum = () => {
  const navigate = useNavigate();
  const { open } = useContext(SidebarContext);
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState(null);
  const [members, setMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [projectType, setprojectType] = useState("");
  var [role, setrole] = useState(null);
  const [userId, setuserId] = useState(null);
  const [testReplaceModal, showTestReplaceModal] = useState(false);
  var [deletedMemberId, setDeletedMemberId] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const isKanbanInPath = location.pathname.includes("kanban");
    const type = isKanbanInPath ? "kanban" : "scrum";
    setprojectType(type);
  }, []);
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const removeUserFromQuestion = async (projectId, projectType, userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/message/remove-users`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            projectType,
            userId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_HOST}/projects/scrum/${projectId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          setProjectName(data.projectName);

          if (Array.isArray(data.members)) {
            const fetchMemberDetails = async () => {
              const updatedMembersPromises = data.members.map(
                async (member) => {
                  const memberDetailsResponse = await fetch(
                    `${process.env.REACT_APP_HOST}/signup/${member.member_id}`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (memberDetailsResponse.ok) {
                    const memberDetails = await memberDetailsResponse.json();
                    return {
                      ...member,
                      username: memberDetails.name,
                      email: memberDetails.email,
                    };
                  } else {
                    console.error(
                      "Error fetching member details:",
                      memberDetailsResponse.statusText
                    );
                    return member;
                  }
                }
              );

              const updatedMembers = await Promise.all(updatedMembersPromises);
              setMembers(updatedMembers);
              console.log("mem:", members);
            };

            fetchMemberDetails();
          } else {
            console.error("Data members is not an array:", data.members);
          }
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    const getRoles = async () => {
      const userData = await checkSession();
      if (userData.hasOwnProperty("message")) {
        const datasend = { message: "Session Expired" };
        navigate("/login", { state: datasend });
      } else {
        const projectrole = await checkScrumRole(projectId, userData.id);
        setrole((role = projectrole.role));
      }
    };
    fetchData();
    getRoles();
  }, [projectId]);
  const deleteMemberfromProject = async (memberId) => {
    const updatedMembers = members.filter(
      (member) => member.member_id !== memberId
    );

    // Update the state with the filtered array
    setMembers(updatedMembers);

    try {
      // Send a DELETE request to remove the member on the server
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/projects/scrum/member/member/${projectId}/${memberId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers as needed
          },
        }
      );

      if (response.ok) {
        console.log(`Member with ID ${memberId} successfully deleted.`);
        try {
          const result = await removeUserFromQuestion(
            projectId,
            projectType,
            memberId
          );
          console.log("User removal result:", result);
        } catch (error) {
          console.error("Error in handleRemoveUser:", error);
        }
        // Optionally, handle success scenarios here
      } else {
        console.error("Error deleting member:", response.statusText);
        // Optionally, handle error scenarios here
      }
    } catch (error) {
      console.error("Error in handleRemoveMember:", error.message);
      // Optionally, handle error scenarios here
    }
    if (userId === memberId) {
      navigate(`/`);
    }
  }

  const handleRemoveMember = async (memberId, role) => {//ekhane change
    const adminCount = members.filter(
      (member) => member.role === "Scrum Master"
    ).length;
    if (adminCount === 1 && role === "Scrum Master") {
      // Show the InvitePopup with the specified message
      setShowPopup(true);
    } else {
      setShowPopup(false);
      if (role === "Developer") {
        setDeletedMemberId(deletedMemberId = memberId);
        showTestReplaceModal(true);
      }
      else {
        deleteMemberfromProject(memberId);
      }
    }
  };
  const handleInvite = (newMember) => {
    // Add the new member to the members array
    setMembers([...members, newMember]);
  };
  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""}`}
      style={{ overflow: "auto", paddingBottom: "80px" }}
    >
      <div className="center-content">
        <h3 className="mb-4">All Current members of {projectName}</h3>

        <div className="list-group-container" style={{ maxHeight: "450px" }}>
          <ul
            className="list-group"
            style={
              role === "Scrum Master"
                ? { maxHeight: "300px" }
                : { maxHeight: "430px" }
            }
          >
            {members.map((member, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className={role === "Scrum Master" ? "col-4" : "col-9"}>
                  <div>
                    {index + 1}. {member.username}
                  </div>
                  <div className="text-muted">
                    <h6 style={{ color: "gray" }}>{member.email}</h6>
                  </div>
                </div>
                <div className={role === "Scrum Master" ? "col-6" : "col-3"}>
                  {member.role}
                </div>
                {role === "Scrum Master" && (
                  <div className="col-2">
                    <div class="d-flex justify-content-start align-items-center">
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleRemoveMember(member.member_id, member.role)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {role === "Scrum Master" && (
        <div>
          <InviteMemberForm members={members} onInvite={handleInvite} />
        </div>
      )}
      <InvitePopup
        show={showPopup}
        handleClose={handleClosePopup}
        message={"Project must have at least 1 Scrum Master"}
      />
      (<CardSelectionModal
        show={testReplaceModal}
        handleClose={() => showTestReplaceModal(false)}
        member_id={deletedMemberId}
        member={members}
        projectId={projectId}
        onDelete={deleteMemberfromProject}
      />)
    </div>
  );
};

export default MemberScrum;
