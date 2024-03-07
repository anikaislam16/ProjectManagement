import React from "react";
import { useParams } from "react-router-dom";
import SidebarScrum from "../../../sidebar_app/components_scrum/sidebar/SidebarScrum";
import SidebarContextScrumProvider from "../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum_provider";
const ProjectScrum = () => {
  const { projectId } = useParams();
  return (
    <div>
      project :{projectId}
      <SidebarContextScrumProvider>
        <SidebarScrum projectId={projectId} />
      </SidebarContextScrumProvider>
    </div>
  );
};

export default ProjectScrum;
