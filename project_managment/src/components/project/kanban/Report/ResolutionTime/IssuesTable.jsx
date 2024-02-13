import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const IssuesTable = ({ issues, period }) => {
    const calculateInterval = (index) => {
        const options = { day: 'numeric', month: 'short', year: '2-digit' };
        if (period === 'daily') {
            return new Date(issues[index].date).toLocaleDateString('en-US', options);
        } else {
            const startDate = new Date(issues[index].date).toLocaleDateString('en-US', options);
            const endDate = index === issues.length - 1 ? "Today" : new Date(issues[index + 1].date).toLocaleDateString('en-US', options);
            return `${startDate} - ${endDate}`;
        }
    };

    return (
        <table className="table table-bordered table-striped mt-4">
            <thead className="thead-dark">
                <tr>
                    <th>Period</th>
                    <th>Issues Resolved</th>
                    <th>Total Resolution</th>
                    <th>Avg. Resolution Time</th>
                </tr>
            </thead>
            <tbody>
                {issues.map((issue, index) => (
                    <tr key={index}>
                        <td>{calculateInterval(index)}</td>
                        <td>{issue.resolvedIssue}</td>
                        <td>{issue.totalTime}</td>
                        <td>{isNaN(issue.totalTime / issue.resolvedIssue) ? 0 : Math.round(issue.totalTime / issue.resolvedIssue)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default IssuesTable;
