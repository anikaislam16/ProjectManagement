import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "../../Images/dashboard.svg";
import chatting from "../../Images/chatting.svg";
import { ChevronDown } from "react-feather";
import News from "../../Images/news.svg";
import Performance from "../../Images/performance.svg";
import Transactions from "../../Images/transactions.svg";
import table from "../../Images/table.svg";
import conversation from "../../Images/conversation.png";
import ulaa from "../../Images/ulaa.png";
import board from "../../Images/board.png";
import backlog from "../../Images/backlog.png";
import testing from "../../Images/testing.png";
import { Modal, Button } from "react-bootstrap";
// import Settings from "../Images/settings.svg";
// import Support from "../Images/support.svg";
// import { useLocation } from "react-router-dom";
import "../../css/main.scss";
import SidebarContextScrum from "../sidebar_context/SidebarContextScrum";
import { checkScrumRole } from "../../../components/project/scrum/checkScrumRole";
import { checkSession } from "../../../components/sessioncheck/session";
const SidebarScrum = ({ projectId }) => {
  const { open, setOpen } = useContext(SidebarContextScrum);
  console.log("open  " + open);
  const navigate = useNavigate();
  console.log("fddf " + projectId);
  const location = useLocation();
  const [graph, setGraph] = useState("");
  const [projectName, setProjectName] = useState("");
  const [closeMenu, setCloseMenu] = useState(false);
  const [showOptionBar, setShowOptionBar] = useState(false);
  var [role, setrole] = useState(null);
  console.log(location.pathname);
  console.log(location);
  const handleCloseMenu = () => {
    setCloseMenu(!closeMenu);
    setOpen(!open);
  };
  const handleReportsClick = () => {
    setShowOptionBar(!showOptionBar); // Toggle option bar visibility
  };
  const handleOptionClick = (s) => { };
  const fetchProjectName = async () => {
    console.log(projectId);
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}`
      );
      const result = await response.json();

      if (result) {
        console.log(result);
        setProjectName(result.projectName);
      } else {
        console.error("Failed to fetch project name");
      }
    } catch (error) {
      console.error("Error fetching project name:", error);
    }
  };
  useEffect(() => {
    console.log("g " + projectId);

    if (projectId) {
      const getRoles = async () => {
        const userData = await checkSession();
        if (userData.hasOwnProperty('message')) {
          const datasend = { message: "Session Expired" }
          navigate('/login', { state: datasend });
        }
        else {
          const projectrole = await checkScrumRole(projectId, userData.id);
          if (projectrole === "not valid") {
            navigate('/unauthorized');
          }
          setrole(role = projectrole.role);
        }
      }
      getRoles();
      fetchProjectName();
    }
  }, [projectId]);
  return (
    <div className={closeMenu === false ? "sidebar" : "sidebar active"}>
      <div
        className={
          closeMenu === false ? "logoContainer" : "logoContainer active"
        }
      >
        <h6 className="titles">{projectName}</h6>
      </div>
      <div
        className={
          closeMenu === false ? "burgerContainer" : "burgerContainer active"
        }
      >
        <div
          className="burgerTrigger"
          onClick={() => {
            handleCloseMenu();
          }}
        ></div>
        <div className="burgerMenu"></div>
      </div>

      <div
        className={
          closeMenu === false ? "contentsContainer" : "contentsContainer active"
        }
      >
        <ul>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}`}>
              <img src={backlog} alt="" />
              <span className="text-hidden">Backlog</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/board`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/board`}>
              <img src={Dashboard} alt="" />
              <span className="text-hidden">Board</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/completed`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/completed`}>
              <img src={table} alt="" />
              <span className="text-hidden">Completed</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/gantt`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/gantt`}>
              <img src={ulaa} alt="Transactions" />
              <span className="text-hidden">Gantt Chart</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/${graph}`
                ? "active"
                : ""
            }
            style={{ marginBottom: "0px" }}
          >
            <NavLink
              to={`/project/scrum/${projectId}/graph`}
              onClick={(event) => {
                event.preventDefault(); // Prevents the default navigation behavior
                handleReportsClick(); // Handle your custom logic (e.g., showing the option bar)
              }}
            >
              <img src={Performance} alt="Performance" />
              <span className="text-hidden">Reports </span>

              {open && <ChevronDown />}
            </NavLink>
          </li>
          {showOptionBar && open && (
            <div className="optionBarContainer">
              <div className="optionBarItem">
                <NavLink
                  to={`/project/scrum/${projectId}/velocity`}
                  className="optionLink"
                  onClick={() => setGraph("velocity")}
                >
                  <span>Velocity Chart</span>
                </NavLink>
              </div>

              {/* <div className="optionBarItem">
                <NavLink
                  to={`/project/scrum/${projectId}/graph`}
                  className="optionLink"
                >
                  <span>Sprint Report</span>
                </NavLink>
              </div> */}
              <div className="optionBarItem">
                <NavLink
                  to={`/project/scrum/${projectId}/pie`}
                  className="optionLink"
                  onClick={() => setGraph("pie")}
                >
                  <span>Pie Chart</span>
                </NavLink>
              </div>
              <div className="optionBarItem">
                <NavLink
                  to={`/project/scrum/${projectId}/burn`}
                  className="optionLink"
                  onClick={() => setGraph("burn")}
                >
                  <span>BurnDown Chart</span>
                </NavLink>
              </div>
              <div className="optionBarItem">
                <NavLink
                  to={`/project/scrum/${projectId}/report`}
                  className="optionLink"
                  onClick={() => setGraph("report")}
                >
                  <span>Sprint Report</span>
                </NavLink>
              </div>
            </div>
          )}

          <li
            className={
              location.pathname === `/project/scrum/${projectId}/members`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/members`}>
              <img src={News} alt="News" />
              <span className="text-hidden">Members</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/chat` ||
                location.pathname === `/project/scrum/${projectId}/chatbox/You` ||
                location.pathname ===
                `/project/scrum/${projectId}/chatbox/others` ||
                location.pathname === `/project/scrum/${projectId}/chatbox/notice`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/chat`}>
              <img
                src={conversation}
                alt="News"
                style={{ width: "30px", height: "30px" }}
              />

              <span className="text-hidden">Issues</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/review`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/review`}>
              <img
                src={board}
                alt="News"
                style={{ width: "30px", height: "30px" }}
              />

              <span className="text-hidden">Review</span>
            </NavLink>
          </li>
          {role === "Developer" && (<li
            className={
              location.pathname === `/project/scrum/${projectId}/tdd`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/tdd/requirements`}>
              <img
                src={testing}
                alt="News"
                style={{ width: "30px", height: "30px" }}
              />
              <span className="text-hidden">TDD</span>
            </NavLink>
          </li>)}
        </ul>
      </div>

      <Outlet />
    </div>
  );
};

export default SidebarScrum;
