import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const DependencyList = (props) => {
    const { bid, cardId, projectId, addStartDate } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedTaskInd, setSelectedTaskind] = useState(null);
    var [projectsData, setProjectsData] = useState([]);
    var [dependencies, setDependencies] = useState([]);

    var [flowId, setflowId] = useState(cardId);
    const [isHovered, setIsHovered] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [message, setmessage] = useState(null);
    useEffect(() => {
        // Fetch project data when projectId changes
        const fetchProjectData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3010/projects/kanban/${projectId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    //    console.log(data.boards);
                    setProjectsData((projectsData = data.boards));
                    console.log(projectsData);
                    var projectIndex = projectsData.findIndex(
                        (project) => project._id === bid
                    );
                    if (projectIndex !== -1) {
                        // If the index is found, find the card where _id is equal to cardId
                        var foundCard = projectsData[projectIndex].cards.find(
                            (card) => card._id === cardId
                        );

                        if (foundCard) {
                            // Do something with the found card
                            console.log("Found Card:", foundCard.dependencies);
                            var dep = foundCard.dependencies;
                            //  setworkflow(workflow = foundCard.workflow);
                            const matchingCardsAndNames = projectsData.flatMap((board) =>
                                board.cards
                                    .filter((card) => dep.includes(card._id))
                                    .map((matchingCard) => ({
                                        Name: board.name,
                                        matchingCard,
                                        _id: board._id,
                                    }))
                            );
                            setDependencies((dependencies = matchingCardsAndNames)); //eta na dile, porer line(console.log) e ager value shor krbe. r evabe value assign krte, useState const na diye var dite hoi.
                            console.log(dependencies);
                            correctDurationOfDecendentCard(flowId);
                        } else {
                            console.log("Card not found with the specified cardId.");
                        }
                    }
                } else {
                    console.error("Failed to fetch project data");
                }
            } catch (error) {
                console.error("Error during fetch:", error);
            }
        };
        fetchProjectData();
    }, [projectId, showModal]);
    // Define tasks for each board
    const cyclecheck = (newValue) => {
        const allCards = projectsData.flatMap((project) => project.cards);
        const foundCard = allCards.find((card) => card._id === newValue);
        const findCardRecursivelyWithCycleDetection = (currentCard, visited) => {
            // Check if the current card is already visited (indicating a cycle)
            if (visited.includes(currentCard._id)) {
                return false;
            }

            // Mark the current card as visited
            visited.push(currentCard._id);

            // Check if cardId is present in the dependencies of the current card
            if (
                currentCard.dependencies &&
                currentCard.dependencies.includes(cardId)
            ) {
                return true;
            }

            // Recursively check each dependency
            for (const dependencyId of currentCard.dependencies || []) {
                const dependentCard = allCards.find(
                    (card) => card._id === dependencyId
                );
                console.log(dependentCard);
                if (
                    dependentCard &&
                    findCardRecursivelyWithCycleDetection(dependentCard, [...visited])
                ) {
                    return true;
                }
            }

            // If not found in the current card or its dependencies, return false
            return false;
        };

        // Initialize the visited array
        const visited = [];

        // Start the recursion for the foundCard
        const CycleDetection = findCardRecursivelyWithCycleDetection(
            foundCard,
            visited
        );
        console.log(allCards);
        return CycleDetection;
    };
    const correctDurationOfDecendentCard = (newValue) => {
        const allCards = projectsData.flatMap((project) => project.cards);
        const foundCard = allCards.find((card) => card._id === newValue);
        const fixingDuration = (currentCard, visited) => {
            console.log(foundCard);
            // Check if the current card is already visited (indicating a cycle)
            if (visited.includes(currentCard._id)) {
                return false;
            }
            //  console.log('d00');
            // Mark the current card as visited
            visited.push(currentCard._id);

            // Recursively check each dependency
            for (const workflowId of currentCard.workflow || []) {
                const workflowCard = allCards.find((card) => card._id === workflowId);
                console.log(workflowCard);
                const projectWithWorkflow = projectsData.find((project) =>
                    project.cards.some((card) => card._id === workflowId)
                );
                const workflowboardId = projectWithWorkflow._id;
                if (new Date(workflowCard.startDate) <= new Date(currentCard.dueDate)) {
                    const dayDifference =
                        Math.round(
                            (new Date(currentCard.dueDate) - new Date(workflowCard.startDate)
                            ) /
                            (24 * 60 * 60 * 1000));
                    console.log(dayDifference);
                    const startDate = new Date(currentCard.dueDate);
                    startDate.setDate(startDate.getDate() + 1);
                    startDate.setHours(0, 0, 0, 0);
                    workflowCard.startDate = startDate;
                    const dueDate = new Date(workflowCard.dueDate);
                    dueDate.setDate(dueDate.getDate() + dayDifference);
                    dueDate.setHours(23, 59, 0, 0);
                    workflowCard.dueDate = dueDate;
                    console.log(workflowCard.startDate, workflowCard.dueDate);
                    if (workflowId === cardId) {
                        addStartDate(workflowCard.startDate, workflowCard.dueDate);
                    }
                    setStartDueDate(workflowboardId, workflowId, workflowCard);
                }
                //ekhon dependentCard er sathe current card er compare krbo
                fixingDuration(workflowCard, [...visited]);
            }

            // If not found in the current card or its dependencies, return false
            return false;
        };
        const visited = [];
        fixingDuration(foundCard, visited);
    };
    const setStartDueDate = async (workflowboardid, workflowcardid, card) => {
        const apiUrl = `http://localhost:3010/projects/kanban/${projectId}/${workflowboardid}/${workflowcardid}`;

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fieldName: "startDate",
                    newValue: card.startDate,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const response1 = await fetch(
                    `http://localhost:3010/projects/kanban/${projectId}/${workflowboardid}/${workflowcardid}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            fieldName: "dueDate",
                            newValue: card.dueDate,
                        }),
                    }
                );
                if (response1.ok) {
                    const data1 = await response1.json();
                    console.log(data1);
                }
                // Optionally, you can return the updated data or handle it as needed
            } else {
                console.error("Error updating date:", response.statusText);
                // Handle errors
            }
        } catch (error) {
            console.error("Error updating date:", error.message);
            // Handle errors
        }
    };
    const handleAddDependency = async () => {
        // Add your logic here when the "Save Dependency" button is clicked
        const newValue = projectsData[selectedIndex].cards[selectedTaskInd]._id;
        const isValuePresent = dependencies.some(
            (dependency) => dependency.matchingCard._id === newValue
        );
        if (isValuePresent) {
            setShowErrorModal(true);
            setmessage("This card is already added to dependency");
            console.log(isValuePresent);
        }
        else if (cyclecheck(newValue)) {
            setShowErrorModal(true);
            setmessage("This Dependency is not possible. It creates a cycle");
        } else {
            const storedependency = async () => {
                const apiUrl = `http://localhost:3010/projects/kanban/${projectId}/${bid}/${cardId}`;

                try {
                    const response = await fetch(apiUrl, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            fieldName: "dependencies",
                            newValue,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        const response1 = await fetch(
                            `http://localhost:3010/projects/kanban/${projectId}/${projectsData[selectedIndex]._id}/${newValue}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    fieldName: "workflow",
                                    newValue: cardId,
                                }),
                            }
                        );
                        if (response1.ok) {
                            const data1 = await response1.json();
                            console.log(data1);
                        }
                        // Optionally, you can return the updated data or handle it as needed
                    } else {
                        console.error("Error updating dependencies:", response.statusText);
                        // Handle errors
                    }
                } catch (error) {
                    console.error("Error updating dependencies:", error.message);
                    // Handle errors
                }
            };
            await storedependency();
            setflowId((flowId = newValue));
            setShowModal(false);
        }

        // You can use selectedBoard and selectedTask in your logic
    };

    const handleCloseModal = () => {
        setShowModal(false);
        console.log(projectsData);
        console.log(selectedTaskInd);
    };
    const handleDropdownChange = (e) => {
        const selectedOptionIndex = e.target.selectedIndex - 1;
        setSelectedBoard(e.target.value);
        setSelectedIndex(selectedOptionIndex);

        // Now, you can use selectedOptionIndex as the index of the selected option
        console.log(`Selected Index: ${selectedOptionIndex}`);
    };
    const RemoveDependency = async (index) => {
        const apiUrl = `http://localhost:3010/projects/kanban/${projectId}/${bid}/${cardId}/dependencies/${dependencies[index].matchingCard._id}`;
        try {
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const response1 = await fetch(
                    `http://localhost:3010/projects/kanban/${projectId}/${dependencies[index]._id}/${dependencies[index].matchingCard._id}/workflow/${cardId}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response1.ok) {
                    const data = await response1.json();
                    console.log(data);
                }
                setDependencies((prevDependencies) => {
                    const newDependencies = [...prevDependencies];
                    newDependencies.splice(index, 1);
                    return newDependencies;
                });
                // Optionally, you can return the updated data or handle it as needed
            } else {
                console.error("Error updating dependencies:", response.statusText);
                // Handle errors
            }
        } catch (error) {
            console.error("Error updating dependencies:", error.message);
            // Handle errors
        }
    };
    const closeErrorModal = () => {
        setShowErrorModal(false);
    };
    return (
        <div>
            <ul className="list-group">
                {dependencies.map((dependency, index) => (
                    <li
                        key={index}
                        className={`list-group-item d-flex justify-content-between align-items-center`}
                    >
                        {dependency.matchingCard.cardName} ({dependency.Name})
                        <span
                            className="badge "
                            onClick={() => RemoveDependency(index)}
                            style={{
                                cursor: isHovered ? "pointer" : "default",
                                // Add other styles as needed
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            ❌
                        </span>
                    </li>
                ))}
            </ul>
            {showErrorModal && (
                <Modal show={showErrorModal} onHide={closeErrorModal}>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body style={{ backgroundColor: "#dc2626", color: "white" }}>
                        {message}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={closeErrorModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Add Dependency
                </Button>

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Dependency</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="selectBoard">
                                <Form.Label>Select Board</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedBoard || ""}
                                    onChange={handleDropdownChange}
                                >
                                    <option value="" disabled>
                                        Select a board
                                    </option>
                                    {projectsData.map((project, index) => (
                                        <option key={index} value={project.name}>
                                            {project.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <br />
                            {selectedIndex !== null && (
                                <Form.Group controlId="selectTask">
                                    <Form.Label>{`Select Task for ${projectsData[selectedIndex].name}`}</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedTask || ""}
                                        onChange={(e) => {
                                            setSelectedTask(e.target.value);
                                            const selectedOptionIndex = e.target.selectedIndex;
                                            const selectedOptionKey =
                                                e.target.options[selectedOptionIndex].getAttribute(
                                                    "data-key"
                                                );
                                            setSelectedTaskind(selectedOptionKey);
                                        }}
                                    >
                                        <option value="" disabled>
                                            Select a task
                                        </option>
                                        {projectsData[selectedIndex].cards.map(
                                            (card, cardIndex) =>
                                                !(
                                                    projectsData[selectedIndex]._id === bid &&
                                                    card._id === cardId
                                                ) && (
                                                    <option
                                                        value={card.cardName}
                                                        key={cardIndex}
                                                        data-key={cardIndex}
                                                    >
                                                        {card.cardName}
                                                    </option>
                                                )
                                        )}
                                    </Form.Control>
                                </Form.Group>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAddDependency}
                            disabled={!selectedTask}
                        >
                            Save Dependency
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default DependencyList;
