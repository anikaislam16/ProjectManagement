import { Task } from 'gantt-task-react';

const taskStyles = {
    backgroundColor: '#4CAF50',
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

    for (const project of projectData) {
        // Loop through cards within each project
        let minStartDate = Infinity; // Initialize with a large value
        let maxFinishedDate = -Infinity; // Initialize with a small value

        for (const card of project.card) {

            // Update minStartDate if the current card's startDate is earlier
            if (card.startDate) {
                minStartDate = Math.min(minStartDate, new Date(card.startDate).getTime());
                console.log(minStartDate)
            }

            // Update maxFinishedDate if the current card has a finishedDate and it's later
            if (card.dueDate) {
                maxFinishedDate = Math.max(maxFinishedDate, new Date(card.dueDate).getTime());
                console.log(maxFinishedDate)
            }
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
            progress: 10, // Set your desired default value
            type: "project", // Use string literal type
            styles: taskStyles,
            hideChildren: false,
        };
        console.log(projectObject)
        tasks.push(projectObject);

        for (const card of project.card) {
            const newTask: Task = {
                start: new Date(card.startDate || card.creationDate || currentDate),
                end: new Date(card.dueDate || new Date(card.creationDate || currentDate).getTime() + 7 * 24 * 60 * 60 * 1000),
                name: card.cardName,
                id: card._id,
                type: 'task',
                project: project.id,
                styles: taskStyles,
                dependencies: card.dependencies,
                progress: 20,
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
