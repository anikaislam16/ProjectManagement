const checkScrumRole = async (projectId, memberId) => {
    const response = await fetch(`${process.env.REACT_APP_HOST}/signup/scrum/${projectId}/member/${memberId}`, {
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
module.exports = { checkScrumRole };