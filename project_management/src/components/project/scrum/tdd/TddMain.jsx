import React, { useContext } from "react";
import { NavLink, useParams, useNavigate, Outlet } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";

const TddMain = () => {
  const { open } = useContext(SidebarContextScrum);
  const { projectId } = useParams();
  const navigate = useNavigate();
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <Navbar bg="light" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavLink
              className="nav-link"
              to={`/project/scrum/${projectId}/tdd/requirements`}
            >
              Requirements
            </NavLink>
            <NavLink
              className="nav-link"
              to={`/project/scrum/${projectId}/tdd/design`}
            >
              Design
            </NavLink>
            <NavLink
              className="nav-link"
              to={`/project/scrum/${projectId}/tdd/plan`}
            >
              Plan
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="center-content"></div>
      <Outlet />
    </div>
  );
};

export default TddMain;
