import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import SidebarContext from "../components/sidebar_context/SidebarContext";
const ActiveSprint = () => {
  const { open } = useContext(SidebarContext);
  const { project } = useParams();
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        <p>ActiveSprint of {project}</p>
      </div>
    </div>
  );
};

export default ActiveSprint;
