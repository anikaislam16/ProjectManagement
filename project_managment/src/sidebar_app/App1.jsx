import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Sidebar1 from "./components/Sidebar1";
// import "./css/main.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import ActiveSprint from "./pages/ActiveSprint";
import BackLog from "./pages/BackLog";
import Reports from "./pages/Reports";
import Timeline from "./pages/Timeline";

const App1 = () => {
  return (
    <Router>
      <div className="App">
        <p>fsdffdf</p>
        <Sidebar1 />
        <Routes>
          <Route path="/" element={<BackLog />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/active" element={<ActiveSprint />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App1;
