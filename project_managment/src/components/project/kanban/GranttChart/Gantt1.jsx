import React, { useContext, useEffect } from "react";
import Gantt from "frappe-gantt";
import "frappe-gantt/dist/frappe-gantt.css";
import SidebarContext from '../../../../sidebar_app/components/sidebar_context/SidebarContext';
import { useParams } from 'react-router-dom';
const Gantt1 = () => {
  const { open } = useContext(SidebarContext);
  const { projectId } = useParams();

  const tasks = [
    {
      id: 'task1',
      label: 'Task 1',
      start: '2024-02-10',
      end: '2024-02-15',
      duration: 5,
      progress: 30,
      dependencies: [],
    },
    {
      id: 'task2',
      label: 'Task 2',
      start: '2024-02-16',
      end: '2024-02-20',
      duration: 5,
      progress: 0,
      dependencies: [],
    },
    {
      id: 'task3',
      label: 'Task 3',
      start: '2024-02-10',
      end: '2024-02-15',
      duration: 5,
      progress: 30,
      dependencies: [],
    },
    {
      id: 'task4',
      label: 'Task 4',
      start: '2024-02-10',
      end: '2024-02-15',
      duration: 5,
      progress: 30,
      dependencies: [],
    }
    // Add more tasks as needed
  ];

  useEffect(() => {
    const gantt = new Gantt(".gantt", tasks, {
      on_click: (task) => {
        console.log("Task Clicked:", task);
      },
    });

    gantt.refresh(tasks);
  }, [tasks]);

  const taskColumns = [
    {
      label: 'Tasks',
      value: 'label',
      size: '60%',
    },
    {
      label: 'Duration (hours)',
      value: 'duration',
      formatFunction: (duration) => `${duration} hours`,
    },
  ];


  return (
    <div className={`center-div ${open ? 'sidebar-open' : ''} `} style={{ paddingBottom: "40px" }}>
      <div className="center-content">
        <p>ActiveSprint of {projectId}</p>
        <div>
          <h1>Frappe Gantt Chart in React</h1>
          <div style={{ display: 'flex' }}>
            <div className="gantt" style={{ height: '500px', width: '60%' }} />
            <div style={{ width: '40%', marginLeft: '20px' }}>
              <h2>Task Details</h2>
              <table>
                <thead>
                  <tr>
                    {taskColumns.map(column => (
                      <th key={column.label}>{column.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Render task details */}
                  {tasks.map(task => (
                    <tr key={task.id}>
                      {taskColumns.map(column => (
                        <td key={column.label}>{column.formatFunction ? column.formatFunction(task[column.value]) : task[column.value]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gantt1;
