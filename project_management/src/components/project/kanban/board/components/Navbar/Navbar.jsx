import React from "react";
import "./Navbar.css";
const Navbar = (props) => {
  return (
    <div className="navbar">
      <h2> Kanban Board</h2>
      <input
        type="checkbox"
        className="checkbox"
        id="checkbox"
        style={{ transition: "all 200ms" }}
        onChange={props.switchTheme}
      />
      <label for="checkbox" class="label">
        <i className="fas fa-moon fa-sm"></i>
        <i className="fas fa-sun fa-sm"></i>
        <div className="ball" />
      </label>
    </div>
  );
};

export default Navbar;
