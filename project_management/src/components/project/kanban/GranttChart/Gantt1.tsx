import { Gantt, Task, ViewMode } from "gantt-task-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarContext from "../../../../sidebar_app/components/sidebar_context/SidebarContext";
import { initTasks, getStartEndDateForProject } from "./helpers.ts";
import { ViewSwitcher } from "./ViewSwithcer.tsx";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
export default function Gantt1({ data }: { data: any[] }) {
  const { open } = useContext(SidebarContext);
  const { projectId } = useParams();
  const [view, setView] = useState<ViewMode>(ViewMode.Day);

  const [tasks, setTasks] = useState<Task[]>(
    initTasks(data)
  );
  const [isChecked, setIsChecked] = useState(true);
  let columnWidth = 32;
  if (view === ViewMode.Month) {
    columnWidth = 100;
  } else if (view === ViewMode.Week) {
    columnWidth = 100;
  }
  useEffect(() => {
    //  console.log(props);
    //const tasks: Task[] = [];
    const taskStyles = {
      backgroundColor: "#4CAF50",
      backgroundSelectedColor: "#FFC107",
      progressColor: "#2196F3",
    };

    //fetchData();
  }, []);
  const handleTaskChange = (task: Task) => {
    //ekhane drag n drop er karone new task ta ase.
    console.log("On date change Id:" + task.id);
    if (task.start.getHours() > 13) {
      //task e modify korbo.
      // Set the time to 23:59
      task.start.setDate(task.start.getDate() + 1);
    }
    if (task.end.getHours() < 13) {
      // Set the time to 23:59
      task.end.setDate(task.end.getDate() - 1);
    }
    // Set the time to 00:00
    task.start.setHours(0, 0, 0, 0);
    task.end.setHours(23, 59, 0, 0);
    if (task.end < task.start) {
      task.end.setDate(task.end.getDate() + 1);
    }
    console.log(task);
    let newTasks = tasks.map((t) => (t.id === task.id ? task : t));
    console.log(newTasks);
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project =
        newTasks[newTasks.findIndex((t) => t.id === task.project)];
      console.log(start, project.start);
      if (
        project.start.getDate() !== start.getDate() ||
        project.end.getDate() !== end.getDate()
      ) {
        console.log("kd");
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map((t) =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  // const handleTaskDelete = (task: Task) => {
  //   const conf = window.confirm("Are you sure about " + task.name + " ?");
  //   if (conf) {
  //     setTasks(tasks.filter((t) => t.id !== task.id));
  //   }
  //   return conf;
  // };
  // const handleProgressChange = async (task: Task) => {
  //   setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  //   console.log("On progress change Id:" + task.id);
  // };
  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };
  // const addDependencyToTask0 = () => {
  //   const currentDate = new Date();
  //   const newProject: Task = {
  //     start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
  //     end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
  //     name: "Project 2",
  //     id: "Project",
  //     progress: 10,
  //     type: "project", // Use a specific value from TaskType
  //     //  styles: taskStyles,
  //     hideChildren: false,
  //   };

  //   setTasks((prevTasks) => [...prevTasks, newProject]);

  // };
  return (
    <div
      className={`center-div ${open ? "sidebar-open" : ""}`}
      style={{ overflow: "auto", paddingBottom: "100px" }}
    >
      <div className="center-content">
        <br />
        <ViewSwitcher
          onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
        {/* <button onClick={addDependencyToTask0}>Add Dependency to Task[0]</button> */}
        <br />
        <h3>Gantt With Unlimited Height</h3>
        <div onWheel={(e) => e.preventDefault()} style={{ overflowX: "hidden" }}>
          <Gantt
            tasks={tasks}
            viewMode={view}
            onDateChange={handleTaskChange}
            ganttHeight={400}
            onSelect={handleSelect}
            onExpanderClick={handleExpanderClick}
            listCellWidth={isChecked ? "140px" : ""}
            columnWidth={columnWidth}
            fontSize="11px"
          />
        </div>
      </div>
    </div>
  );
}
