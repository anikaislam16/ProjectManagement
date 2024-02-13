import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import SidebarContext from "../components/sidebar_context/SidebarContext";
const Reports = () => {
  const { open } = useContext(SidebarContext);
  const { project } = useParams();
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        <p>Reports of {project}</p>
      </div>
    </div>
  );
};

export default Reports;
