import { Task } from 'gantt-task-react';

const taskStyles = {
    backgroundColor: '#4CAF50',
    backgroundSelectedColor: '#FFC107',
    progressColor: '#2196F3',
};
const taskStyles1 = {
    backgroundColor: '#f7655b',
    backgroundSelectedColor: '#FFC107',
    progressColor: '#2196F3',
};
const taskStyles2 = {
    backgroundColor: '#f04695',
    backgroundSelectedColor: '#FFC107',
    progressColor: '#2196F3',
};
export const initTasks = (projectData: any[]): any[] => {
    const currentDate = new Date();

    interface Card {
        startDate?: Date; // Assuming startDate is a string, update the type accordingly
        dueDate?: Date;   // Assuming dueDate is a string, update the type accordingly
        cardName: string;
        _id: string;
        creationDate?: Date;
        // Add other properties as needed
    }

    interface Project {
        id: string;
        name: string;
        card?: Card[]; // Make cards optional, as it could be undefined
        // Add other properties as needed
    }

    let tasks: Task[] = [

    ];
    const lastIndex = projectData.length - 1;
    for (const project of projectData) {
        const currentIndex = projectData.indexOf(project);

        // Loop through cards within each project
        let minStartDate = Infinity; // Initialize with a large value
        let maxFinishedDate = -Infinity; // Initialize with a small value
        var totalPoints = 0;
        var completedPoints = 0;
        for (const card of project.card) {
            for (const task of card.task) {
                // Add the points of the current task to the totalPoints
                totalPoints += parseInt(task.point);

                // If the task is complete, add its points to completedPoints
                if (task.complete) {
                    completedPoints += parseInt(task.point);
                }
            }
            // Update minStartDate if the current card's startDate is earlier
            if (card.creationDate) {
                minStartDate = Math.min(minStartDate, new Date(card.creationDate).getTime());
                console.log(minStartDate)
            }

            // Update maxFinishedDate if the current card has a finishedDate and it's later
            if (card.dueDate) {
                maxFinishedDate = Math.max(maxFinishedDate, new Date(card.dueDate).getTime());
                console.log(maxFinishedDate)
            }
        }
        if (totalPoints === 0) {
            totalPoints = 1;
        }
        // Now minStartDate and maxFinishedDate hold the desired values
        console.log('Min Start Date:', new Date(minStartDate));
        console.log('Max Finished Date:', new Date(maxFinishedDate));

        const projectObject: Task = {
            start: minStartDate === Infinity ? new Date(currentDate) : new Date(minStartDate),
            end: maxFinishedDate === -Infinity ? new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000) : new Date(maxFinishedDate),
            //end: new Date(maxFinishedDate || currentDate.getTime() + 24 * 60 * 60 * 1000),
            name: project.name,
            id: project.id,
            progress: Math.round((completedPoints / totalPoints) * 100), // Set your desired default value
            type: "project", // Use string literal type
            styles: taskStyles,
            hideChildren: false,
        };
        console.log(projectObject)
        tasks.push(projectObject);
        for (const card of project.card) {
            var totalCardPoints = 0;
            var completedCardPoints = 0;
            for (const task of card.task) {
                // Add the points of the current task to the totalPoints
                totalCardPoints += parseInt(task.point);

                // If the task is complete, add its points to completedPoints
                if (task.complete) {
                    completedCardPoints += parseInt(task.point);
                }
            }
            if (totalCardPoints === 0) {
                totalCardPoints = 10000;
            }
            console.log((completedCardPoints / totalCardPoints) * 100)
            console.log(Math.round((completedCardPoints / totalCardPoints) * 100))
            console.log((new Date(card.dueDate) < new Date(card.finishedTime)));
            const newTask: Task = {
                start: new Date(card.creationDate || card.startDate || currentDate),
                end: new Date(card.dueDate || new Date(card.creationDate || currentDate).getTime() + 7 * 24 * 60 * 60 * 1000),
                name: card.cardName,
                id: card._id,
                type: 'task',
                project: project.id,
                styles: (() => {
                    if ((card.progres === 'done') && (new Date(card.dueDate) < new Date(card.finishedTime))) {
                        return taskStyles2;
                    } else if ((card.progres !== 'done') && (new Date(card.dueDate) < currentDate)) {
                        return taskStyles1;
                    } else {
                        return taskStyles;
                    }
                })(),
                dependencies: card.dependencies,
                progress: (Math.round((completedCardPoints / totalCardPoints) * 100)),
            };
            console.log(newTask);
            tasks.push(newTask);
        }
    }


    return tasks;
};


export const getStartEndDateForProject = (tasks: Task[], projectId: string) => {
    const projectTasks = tasks.filter((t) => t.project === projectId);
    let start = projectTasks[0].start;
    let end = projectTasks[0].end;

    for (let i = 0; i < projectTasks.length; i++) {
        const task = projectTasks[i];
        if (start.getTime() > task.start.getTime()) {
            start = task.start;
        }
        if (end.getTime() < task.end.getTime()) {
            end = task.end;
        }
    }

    return [start, end];
};
