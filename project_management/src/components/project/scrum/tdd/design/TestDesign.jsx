import React, { useEffect } from "react";
import { NavLink, useParams, useNavigate, Outlet } from "react-router-dom";
const TestDesign = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      TestDesign
      <button onClick={() => navigate(`/project/scrum/${projectId}/tdd/test`)}>
        Click
      </button>
      <Outlet />
    </div>
  );
};

export default TestDesign;
