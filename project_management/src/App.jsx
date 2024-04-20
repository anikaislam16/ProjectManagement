import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectKanban from "../src/components/project/kanban/ProjectKanban";
import "./App.css";
import ChatMain from "./components/project/kanban/Chatting/ChatMain.jsx";
import Home from "./components/home/Home";
import Navbar1 from "./components/navbar/Navbar1";
import GanttInitializer from "./components/project/kanban/GranttChart/GanttInitializer.jsx";
import Members from "./components/project/kanban/Member/Members";
import BoardMain from "./components/project/kanban/board/BoardMain";
import ProjectScrum from "./components/project/scrum/ProjectScrum";
import ScurmGanttInitializer from "./components/project/scrum/GranttChart/ScurmGanttInitializer.jsx";
import ScrumBoardMain from "./components/project/scrum/board/ScrumBoardMain";
import MemberScrum from "./components/project/scrum/member/Members";
import SprintBoardMain from "./components/project/scrum/sprint/SprintBoardMain";
import Forgetpass from "./components/Login/Forgetpass.jsx";
import OTPpass from "./components/Login/OTPpass.jsx";
import Temp from "./components/Login/Temp.jsx";
import Signup from "./components/signup/signup.jsx";
import OTP from "./components/signup/OTP.jsx";
import Login from "./components/Login/Login.jsx";
import Password from "./components/signup/Password.jsx";
import UpdatePass from "./components/Login/UpdatePass.jsx";
import ChartExample from "./components/project/scrum/reports/ChartExample.jsx";
import ControlChart from "./components/project/kanban/Report/ControlChart/ControlChart.jsx";
import RecentIssue from "./components/project/kanban/Report/RecentlyCreaedIssue/RecentIssue.jsx";
import PieChartKanban from "./components/project/kanban/Report/PieChart/PieChart.jsx";
import ResolutionTime from "./components/project/kanban/Report/ResolutionTime/ResolutionTime.jsx";
import ScrumCompleteBoardMain from "./components/project/scrum/completeBoard/ScrumCompleteBoardMain.jsx";
import BurnDown from "./components/project/scrum/reports/BurnDown.jsx";
import PieChart from "./components/project/scrum/reports/PieChart.jsx";
import SprintReport from "./components/project/scrum/reports/SprintReport.jsx";
import GraphScrum from "./components/project/scrum/reports/GraphScrum";
import ChatList from "./components/project/kanban/Chatting/chatlist/ChatList.jsx";
import ChatContextProvider from "./components/project/kanban/Chatting/context/ChatContextProvider.jsx";
import Profile_main from "./components/profile/Settings.jsx";
import MyProject from "./components/profile/MyProject.jsx";
import A from "./components/A.jsx";
import ScrumReviewBoard from "./components/project/scrum/scrum_review/ScrumReviewBoard.jsx";
import DailyScrum from "./components/project/scrum/scrum_review/dailyscrum/DailyScrum.jsx";
function App() {
  return (
    <div className="App">
      <ChatContextProvider>
        <BrowserRouter>
          <Navbar1 />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/otp" element={<OTP />} />
            <Route path="/signup/password" element={<Password />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<Forgetpass />}>
              <Route path="otp" element={<OTPpass />} />
            </Route>
            <Route path="/Updatepass" element={<UpdatePass />} />
            <Route path="/login/temp" element={<Temp />} />

            <Route
              path="/project/kanban/:projectId/"
              element={<ProjectKanban />}
            >
              <Route path="gantt" element={<GanttInitializer />} />
              <Route path="members" element={<Members />} />
              <Route index element={<BoardMain />} />
              <Route path="piechart" element={<PieChartKanban />} />
              <Route path="controlchart" element={<ControlChart />} />
              <Route path="chat" element={<ChatMain />}></Route>
              <Route path="chatbox/:type" element={<ChatList />} />
              <Route path="recentcretedchart" element={<RecentIssue />} />
              <Route path="resolutionchart" element={<ResolutionTime />} />
            </Route>
            <Route path="/project/scrum/:projectId/" element={<ProjectScrum />}>
              <Route path="gantt" element={<ScurmGanttInitializer />}></Route>
              <Route path="completed" element={<ScrumCompleteBoardMain />}>
                <Route path="mor" element={<A />} />
              </Route>
              <Route path="members" element={<MemberScrum />} />
              <Route index element={<SprintBoardMain />} />
              <Route path="board" element={<ScrumBoardMain />} />
              <Route path="velocity" element={<GraphScrum />} />
              <Route path="burn" element={<BurnDown />} />
              <Route path="report" element={<SprintReport />} />
              <Route path="pie" element={<PieChart />} />
              <Route path="chat" element={<ChatMain />}></Route>
              <Route path="chatbox/:type" element={<ChatList />} />
              <Route path="review" element={<ScrumReviewBoard />} />
              <Route path="dailyscrum" element={<DailyScrum />} />
              {/* <Route path="graph" element={<Graph />} /> */}
            </Route>
            <Route
              path="/member/:memberId/myProjects"
              element={<MyProject />}
            />
            <Route path="/member/:memberId" element={<Profile_main />} />
          </Routes>
        </BrowserRouter>
      </ChatContextProvider>
    </div>
  );
}

export default App;
