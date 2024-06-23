const checkKanbanRole = async (projectId, memberId) => {
    const response = await fetch(`${process.env.REACT_APP_HOST}/signup/kanban/${projectId}/member/${memberId}`, {
        method: "GET",
        credentials: 'include', // Include cookies
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
    }
    else {
        const data = "not valid";
        return data;
    }
}
module.exports = { checkKanbanRole };