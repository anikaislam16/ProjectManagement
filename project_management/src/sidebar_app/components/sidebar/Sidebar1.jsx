import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Icon from "../Images/Icon.svg";
import Dashboard from "../Images/dashboard.svg";
import News from "../Images/news.svg";
import Performance from "../Images/performance.svg";
import Profile from "../Images/profile.png";
import Transactions from "../Images/transactions.svg";
// import Settings from "../Images/settings.svg";
// import Support from "../Images/support.svg";
// import { useLocation } from "react-router-dom";

const Sidebar = ({ project }) => {
  console.log("fddf " + project);
  const location = useLocation();
  const [closeMenu, setCloseMenu] = useState(false);
  console.log(location.pathname);
  console.log(location);
  const handleCloseMenu = () => {
    setCloseMenu(!closeMenu);
  };
  return (
    <div className={closeMenu === false ? "sidebar" : "sidebar active"}>
      <div
        className={
          closeMenu === false ? "logoContainer" : "logoContainer active"
        }
      >
        <img src={Icon} alt="icon" className="logo" />
        <h2 className="title">Project</h2>
      </div>
      <div
        className={
          closeMenu === false ? "burgerContainer" : "burgerContainer active"
        }
      >
        <div
          className="burgerTrigger"
          onClick={() => {
            handleCloseMenu();
          }}
        ></div>
        <div className="burgerMenu"></div>
      </div>
      <div
        className={
          closeMenu === false ? "profileContainer" : "profileContainer active"
        }
      >
        <img src={Profile} alt="profile" className="profile" />
        <div className="profileContents">
          <p className="name">Hello, John👋</p>
          <p>johnsmith@gmail.com</p>
        </div>
      </div>
      <div
        className={
          closeMenu === false ? "contentsContainer" : "contentsContainer active"
        }
      >
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <NavLink to={`/`}>
              <img src={Dashboard} alt="" />
              <span className="text-hidden">Backlog</span>
            </NavLink>
          </li>
          <li className={location.pathname === "/timeline" ? "active" : ""}>
            <NavLink to={`/timeline`}>
              <img src={Transactions} alt="Transactions" />
              <span className="text-hidden">Timeline</span>
            </NavLink>
          </li>
          <li className={location.pathname === "/reports" ? "active" : ""}>
            <NavLink to={`/reports`}>
              <img src={Performance} alt="Performance" />
              <span className="text-hidden">Reports</span>
            </NavLink>
          </li>
          <li className={location.pathname === "/active" ? "active" : ""}>
            <NavLink to={`/active`}>
              <img src={News} alt="News" />
              <span className="text-hidden">Active Sprint</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default Sidebar;
