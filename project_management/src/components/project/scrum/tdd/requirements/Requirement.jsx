import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarContextScrum from "../../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import "./Requirement.scss";
const Requirement = () => {
  const { open } = useContext(SidebarContextScrum);

  const { projectId } = useParams();
  return <div className="styled-div">Requirements</div>;
};

export default Requirement;
