import React, { useContext } from "react";
import { NavLink, useParams, useNavigate, Outlet } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import SidebarContext from "../../../../sidebar_app/components/sidebar_context/SidebarContext";

const TddMainKanban = () => {
    const { open } = useContext(SidebarContext);
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
                            to={`/project/kanban/${projectId}/tdd/requirements`}
                        >
                            Requirements
                        </NavLink>
                        <NavLink
                            className="nav-link"
                            to={`/project/kanban/${projectId}/tdd/design`}
                        >
                            Design
                        </NavLink>
                        <NavLink
                            className="nav-link"
                            to={`/project/kanban/${projectId}/tdd/plan`}
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

export default TddMainKanban;
