import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import "./ProjectPage.css"; // Import your custom CSS file
export default function MyProject() {
  const location = useLocation();
  const navigate = useNavigate();
  var [id, setid] = useState(null);
  var [projects, setProjects] = useState([]);
  const [authorized, setauthorized] = useState(true);
  useEffect(() => {
    if (location.state === null) {
      setauthorized(false);
    } else {
      setauthorized(true);
      setid((id = location.state.userId));
      const fetchProjectData = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_HOST}/projects/kanban/`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ memberId: id }),
            }
          );
          const data = await response.json();
          console.log(data);
          if (!data.hasOwnProperty("message")) {
            console.log("Kanban Projects find successfully:", projects);
            setProjects((projects = data.projects));
          }
          const responseScrum = await fetch(
            `${process.env.REACT_APP_HOST}/projects/scrum/`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ memberId: id }),
            }
          );

          const dataScrum = await responseScrum.json();
          if (!dataScrum.hasOwnProperty("message")) {
            console.log(dataScrum.projects);
            const projectarr = [...projects, ...dataScrum.projects];
            console.log(projectarr);
            setProjects(projectarr);
          }
          console.log("Projects updated successfully:", projects);
        } catch (error) {
          console.error("Error updating projects by member:", error.message);
          throw error;
        }
      };
      fetchProjectData();
    }
  }, [location.pathname]);
  console.log(projects);
  const handleClick = (creatorName, creatorId) => {
    navigate(`/member/${creatorName}${creatorId}`, {
      state: { userId: creatorId },
    });
    console.log(`Clicked on ${creatorName} with ID ${creatorId}`);
  };
  const handleProjectButton = (projectType, projectId) => {
    console.log(projectType);
    const projecttype = projectType === "Scrum" ? "scrum" : "kanban";
    console.log(projecttype);
    navigate(`/project/${projecttype}/${projectId}`);
  };
  return (
    <div>
      {authorized ? (
        <div className="container mt-5">
          <h2 className="text-center mb-4">My Projects</h2>
          <div className="row">
            {projects.map((project) => (
              <div key={project._id} className="col-md-4 mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title
                      data-toggle="tooltip"
                      data-placement="top"
                      title={project.projectName}
                    >
                      {project.projectName}
                    </Card.Title>
                    <br />
                    <div className="row">
                      <div className="col-5">
                        <Card.Text>
                          <b>Project Type:</b>
                        </Card.Text>
                      </div>
                      <div className="col-7">
                        <Card.Text>{project.projectType}</Card.Text>
                      </div>
                      <div className="col-5">
                        <Card.Text>
                          <b>Creation Date:</b>
                        </Card.Text>
                      </div>
                      <div className="col-7">
                        <Card.Text>
                          {new Date(project.creationTime).toLocaleDateString()}
                        </Card.Text>
                      </div>
                      <div className="col-5">
                        <Card.Text>
                          <b>Creator:</b>
                        </Card.Text>
                      </div>
                      <div className="col-7">
                        <Card.Text
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() =>
                            handleClick(project.creatorName, project.creatorId)
                          }
                        >
                          {project.creatorName}
                        </Card.Text>
                      </div>
                      <div className="col-5">
                        <Card.Text>
                          <b>No. of Members:</b>
                        </Card.Text>
                      </div>
                      <div className="col-7">
                        <Card.Text>{project.members}</Card.Text>
                      </div>
                      <div className="col-5">
                        <Card.Text>
                          <b>Week Days:</b>
                        </Card.Text>
                      </div>
                      <div className="col-7">
                        <Card.Text>{project.weekDays.join(", ")}</Card.Text>
                      </div>
                      <div className="col-5">
                        <Card.Text>
                          <b>Your Role:</b>
                        </Card.Text>
                      </div>
                      <div className="col-7">
                        <Card.Text>{project.role}</Card.Text>
                      </div>
                    </div>
                    <br />
                    <Button
                      variant="primary"
                      className="projectbtn"
                      onClick={() =>
                        handleProjectButton(project.projectType, project._id)
                      }
                    >
                      Go To Boards
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h2>This page is unauthorized for You</h2>
      )}
    </div>
  );
}
