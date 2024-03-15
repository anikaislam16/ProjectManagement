const slideStartDueDateFixed = async (data, task) => {
    console.log(data, task)
    const allCards = data.map(dataItem => dataItem.card).flat();
    console.log(allCards);
    var foundCard = task;
    let stdate = null;
    foundCard.dependencies.forEach((id) => {
        const Card = allCards.find((card) => card._id === id);
        console.log(Card.dueDate)
        if (new Date(Card.dueDate) > new Date(stdate) || stdate === null) {
            stdate = Card.dueDate;
            console.log(stdate);
        }
    });
    if (new Date(task.start) <= new Date(stdate)) {
        // Set date to stdate + 1 with hours (0,0,0,0)
        const prevCard = allCards.find((card) => card._id === task.id);
        if (new Date(prevCard.dueDate) !== new Date(task.end)) {
            const dayDifference =
                Math.round((
                    new Date(prevCard.startDate) - new Date(task.start)
                ) /
                    (24 * 60 * 60 * 1000));
            var dueDate = new Date(task.end);
            dueDate.setDate(dueDate.getDate() + dayDifference);
            dueDate.setHours(23, 59, 0, 0);
            task.end = new Date(dueDate);
        }
        const d = new Date(stdate);
        d.setDate(d.getDate() + 1);
        d.setHours(0, 0, 0, 0);
        task.start = new Date(d);
        //  setstart(new Date(d));
        // setShowModal(true);
        console.log(task.start);
        // Now, `stdate` has been updated to the next day with hours set to 00:00:00.000
    }
    const fixingDuration = (currentCard, visited) => {
        console.log(foundCard);
        console.log(currentCard);
        if (currentCard._id === task.id) {
            currentCard.dueDate = new Date(task.end)
        }
        // Check if the current card is already visited (indicating a cycle)
        if (visited.includes(currentCard._id)) {
            return false;
        }
        //  console.log('d00');
        // Mark the current card as visited
        visited.push(currentCard._id);
        // Recursively check each dependency
        for (const workflowId of currentCard.workflow || []) {
            var workflowCard = allCards.find((card) => card._id === workflowId);
            console.log(workflowCard, workflowCard.startDate);
            const boardWithWorkflow = data.find((board) =>
                board.card.some((card) => card._id === workflowId)
            );
            console.log(workflowCard, boardWithWorkflow);
            const workflowboardId = boardWithWorkflow._id;
            console.log(new Date(workflowCard.startDate) <= new Date(currentCard.dueDate))
            console.log(new Date(workflowCard.startDate), new Date(currentCard.dueDate))
            if (new Date(workflowCard.startDate) <= new Date(currentCard.dueDate)) {
                console.log(workflowCard);
                const dayDifference =
                    Math.round((
                        new Date(currentCard.dueDate) - new Date(workflowCard.startDate)
                    ) /
                        (24 * 60 * 60 * 1000));
                console.log(dayDifference);
                var startDate = new Date(currentCard.dueDate);
                startDate.setDate(startDate.getDate() + 1);
                startDate.setHours(0, 0, 0, 0);
                workflowCard.startDate = startDate;
                var dueDate = new Date(workflowCard.dueDate);
                dueDate.setDate(dueDate.getDate() + dayDifference);
                dueDate.setHours(23, 59, 0, 0);
                console.log(workflowCard)
                workflowCard.dueDate = dueDate;
                console.log(dueDate);
                console.log(workflowCard.startDate, workflowCard.dueDate);
                console.log(workflowCard);
                const setStartDueDate = async (workflowboardid, workflowcardid, startDate, dueDate) => {
                    const boardIndex = data.findIndex(board => board.id === workflowboardid);

                    // If the board is found
                    if (boardIndex !== -1) {
                        // Find the card with _id = workflowcardid within the board
                        const cardIndex = data[boardIndex].cards.findIndex(card => card._id === workflowcardid);

                        // If the card is found
                        if (cardIndex !== -1) {
                            // Update the startDate and dueDate properties of the card
                            data[boardIndex].cards[cardIndex].startDate = startDate;
                            data[boardIndex].cards[cardIndex].dueDate = dueDate;
                        } else {
                            console.log('Card not found.');
                        }
                    } else {
                        console.log('Board not found.');
                    }

                    console.log(data);
                };
                setStartDueDate(workflowboardId, workflowId, workflowCard.startDate, workflowCard.dueDate);
            }
            //ekhon dependentCard er sathe current card er compare krbo
            fixingDuration(workflowCard, [...visited]);
        }

        // If not found in the current card or its dependencies, return false
        return false;
    };
    const visited = [];
    foundCard = allCards.find((card) => card._id === task.id);
    foundCard.startDate = task.start;
    foundCard.dueDate = task.end;
    fixingDuration(foundCard, visited);
}
module.exports = { slideStartDueDateFixed }