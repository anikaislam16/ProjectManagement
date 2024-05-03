const checkScrumRole = async (projectId, memberId) => {
    const response = await fetch(`http://localhost:3010/signup/scrum/${projectId}/member/${memberId}`, {
        method: "GET",
        credentials: 'include', // Include cookies
    });
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
    }
}
module.exports = { checkScrumRole };