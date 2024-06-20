import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './TestCard.css';

export default function TestCard(props) {
    const { id, card } = props;
    const { projectId } = useParams();
    var [allTest, setAllTest] = useState([]);
    const [testStatus, setTestStatus] = useState({});
    const [othersTestStatus, setOtherTestStatus] = useState({});

    useEffect(() => {
        let allTestCases = [];
        const getTest = async (tasks) => {
            let cnt_task = 0;
            for (const task of tasks) {
                try {
                    const response = await fetch(`http://localhost:3010/test/scrum/${task._id}`);
                    if (!response.ok) {
                        continue;
                    }
                    const data = await response.json();
                    const count = data.filter(item => item.creator_id === id).length;
                    const filterdata = data.filter(item => item.creator_id === id);
                    const remainingdata = data.filter(item => item.creator_id != id);
                    const countStatusNotPassed = remainingdata.filter(item => item.status != 'pass').length;
                    setOtherTestStatus(prevStatus => ({
                        ...prevStatus,
                        [task._id]: countStatusNotPassed
                    }));
                    if (count > 0) {
                        allTestCases = [...allTestCases, ...filterdata];
                    }
                    cnt_task += count;
                } catch (error) {
                    console.error('Error fetching test cases:', error);
                }
            }
            return cnt_task;
        };

        const fetchData = async () => {
            try {
                if (Array.isArray(card.task)) {
                    await getTest(card.task);
                } else {
                    console.error('Task is not an array:', card.task);
                }
                setAllTest(allTest = allTestCases);
                console.log(allTest);
                const statusObject = allTest.reduce((acc, test) => {
                    acc[test._id] = test.status;
                    return acc;
                }, {});
                setTestStatus(statusObject);
            } catch (error) {
                console.error('Error fetching project data:', error.message);
            }
        };

        fetchData();
    }, [projectId, card.task, id]);

    const handleTestStatusChange = async (testId, status, task_id) => {

        console.log(task_id);
        console.log(othersTestStatus);
        try {
            const response = await fetch(`http://localhost:3010/test/scrum/${task_id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ test_id: testId, status: status })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Status updated successfully:', data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

        setTestStatus(prevStatus => ({
            ...prevStatus,
            [testId]: status
        }));

    };
    useEffect(() => {
        console.log('testStatus:', testStatus);
    }, [testStatus]);

    const renderTestCases = () => {
        let currentTaskName = null;
        return allTest.map((test, index) => {
            let taskHeader = null;
            if (test.task_Name !== currentTaskName) {
                currentTaskName = test.task_Name;
                const allTests = allTest.filter(t => t.task_Name === currentTaskName);
                const allPassed = allTests.every(t => testStatus[t._id] === 'pass');
                const taskStatus = (allPassed && othersTestStatus[test.task_id] === 0) ? <img src="/completed.png" height="20" width="20" /> : <img src="/running.png" height="20" width="20" />;
                taskHeader = (
                    <div key={`header-${index}`} className="task-header">
                        <button className={`btn ${(allPassed && othersTestStatus[test.task_id] === 0) ? 'btn-success' : 'btn-warning'}`} title={`${othersTestStatus[test.task_id]} Test Cases from other developers, till not finished yet.`}
                            data-bs-toggle="tooltip">
                            <div className="task-status">{taskStatus}</div> {/* Align taskStatus to the left */}
                            {currentTaskName}
                        </button>
                        {allPassed && (
                            <img
                                src="/my_task.png"
                                height="40"
                                width="40"
                                style={{ marginLeft: '40px' }}
                                alt="Tests Status"
                                title="All my tests are completed!"
                                data-bs-toggle="tooltip"
                            />
                        )}
                    </div>
                );
            }
            var status_icon = (
                testStatus[test._id] === 'refactor' ? (
                    <img src="/refactor.png" height="20" width="20" alt="refactor" />
                ) : (
                    testStatus[test._id] === 'pass' ? (
                        <img src="/passed.png" height="20" width="20" alt="passed" />
                    ) : (
                        <img src="/failed.png" height="20" width="20" alt="failed" />
                    )
                )
            );

            return (
                <div key={test._id} className="test-case">
                    {taskHeader}
                    <div className="test-item">
                        <p><b>{test.test_Name}</b></p>
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div className="task-status">{status_icon}</div>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <button
                                        className={`dropdown-item ${testStatus[test._id] === 'pass' ? 'pass' : ''}`}
                                        onClick={() => handleTestStatusChange(test._id, 'pass', test.task_id)}
                                    >

                                        Pass
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`dropdown-item ${testStatus[test._id] === 'refactor' ? 'refactor' : ''}`}
                                        onClick={() => handleTestStatusChange(test._id, 'refactor', test.task_id)}
                                    >
                                        Refactor
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`dropdown-item ${testStatus[test._id] === 'failed' ? 'failed' : ''}`}
                                        onClick={() => handleTestStatusChange(test._id, 'failed', test.task_id)}
                                    >

                                        Failed
                                    </button>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div >
            );
        });
    };

    return (
        <div className="container mt-4">
            {allTest.length > 0 && (
                <div className="test-cases">
                    <h2 className="card-title">{card.cardName}</h2>
                    {renderTestCases()}
                </div>
            )}
            <br />
            <br />
        </div>
    );
}
