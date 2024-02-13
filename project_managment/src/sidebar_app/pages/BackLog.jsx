import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import SidebarContext from "../components/sidebar_context/SidebarContext";
const BackLog = () => {
  const { open } = useContext(SidebarContext);
  const { project } = useParams();
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        <p>Backlog of {project}</p>
      </div>
    </div>
  );
};

export default BackLog;
