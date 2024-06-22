import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "../../Images/dashboard.svg";
import News from "../../Images/news.svg";
import Performance from "../../Images/performance.svg";
import Transactions from "../../Images/transactions.svg";
import { ChevronDown } from "react-feather";
import chatting from "../../Images/chatting.svg";
import "../../css/main.scss";
import testing from "../../Images/testing.png";
import SidebarContext from "../sidebar_context/SidebarContext";
import conversation from "../../Images/conversation.png"
import { checkKanbanRole } from "../../../components/project/kanban/checkKanbanRole";
import { checkSession } from "../../../components/sessioncheck/session";
const Sidebar = ({ projectId }) => {
  const { open, setOpen } = useContext(SidebarContext);
  console.log("open  " + open);
  console.log("fddf " + projectId);
  const navigate = useNavigate();
  const location = useLocation();
  const [projectName, setProjectName] = useState("");
  const [closeMenu, setCloseMenu] = useState(false);
  const [showOptionBar, setShowOptionBar] = useState(false);
  const [graph, setGraph] = useState("");
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
  const fetchProjectName = async () => {
    console.log(projectId);
    try {
      const response = await fetch(
        `http://localhost:3010/projects/kanban/${projectId}`
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
          const projectrole = await checkKanbanRole(projectId, userData.id);
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
        <h6 className="title">{projectName}</h6>
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
              location.pathname === `/project/kanban/${projectId}`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/kanban/${projectId}`}>
              <img src={Dashboard} alt="" />
              <span className="text-hidden">Board</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/kanban/${projectId}/gantt`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/kanban/${projectId}/gantt`}>
              <img src={Transactions} alt="Transactions" />
              <span className="text-hidden">Gantt Chart</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/kanban/${projectId}/${graph}`
                ? "active"
                : ""
            }
            style={{ marginBottom: "0px" }}
          >
            <NavLink
              to={`/project/kanban/${projectId}/graph`}
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
                  to={`/project/kanban/${projectId}/controlchart`}
                  className="optionLink"
                  onClick={() => setGraph("controlchart")}
                >
                  <span>Control Chart</span>
                </NavLink>
              </div>

              {/* <div className="optionBarItem">
                <NavLink
                  to={`/project/kanban/${projectId}/graph`}
                  className="optionLink"
                >
                  <span>Sprint Report</span>
                </NavLink>
              </div> */}
              <div className="optionBarItem">
                <NavLink
                  to={`/project/kanban/${projectId}/piechart`}
                  className="optionLink"
                  onClick={() => setGraph("piechart")}
                >
                  <span>Pie Chart</span>
                </NavLink>
              </div>
              <div className="optionBarItem">
                <NavLink
                  to={`/project/kanban/${projectId}/recentcretedchart`}
                  className="optionLink"
                  onClick={() => setGraph("recentcretedchart")}
                >
                  <span>Recently Created Chart</span>
                </NavLink>
              </div>
              <div className="optionBarItem">
                <NavLink
                  to={`/project/kanban/${projectId}/resolutionchart`}
                  className="optionLink"
                  onClick={() => setGraph("resolutionchart")}
                >
                  <span>Resolution Time Chart</span>
                </NavLink>
              </div>
            </div>
          )}
          <li
            className={
              location.pathname === `/project/kanban/${projectId}/members`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/kanban/${projectId}/members`}>
              <img src={News} alt="News" />
              <span className="text-hidden">Members</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/kanban/${projectId}/chat`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/kanban/${projectId}/chat`}>
              <img
                src={conversation}
                alt="News"
                style={{ width: "30px", height: "30px" }}
              />
              <span className="text-hidden">Issues</span>
            </NavLink>
          </li>
          {role === "developer" && (<li
            className={
              location.pathname === `/project/kanban/${projectId}/tdd`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/kanban/${projectId}/tdd/requirements`}>
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

export default Sidebar;
