import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../sidebar_app/components/sidebar/Sidebar";
import SidebarContextProvider from "../../../sidebar_app/components/sidebar_context/SidebarContext_provider";
const ProjectKanban = () => {
  const { projectId } = useParams();
  return (
    <div>
      project :{projectId}
      <SidebarContextProvider>
        <Sidebar projectId={projectId} />
      </SidebarContextProvider>
    </div>
  );
};

export default ProjectKanban;
