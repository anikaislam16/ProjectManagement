import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
const GanttScrum = () => {
  const { open } = useContext(SidebarContextScrum);
  const { projectId } = useParams();
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        <p>ActiveSprint of {projectId}</p>
      </div>
    </div>
  );
};

export default GanttScrum;
