import React, { useContext, useState } from 'react';
import SidebarContext from '../../../../../sidebar_app/components/sidebar_context/SidebarContext';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Barchart from './Barchart'; // Adjust the import path based on your project structure
export default function RecentIssue() {
    const { open } = useContext(SidebarContext);
    const { projectId } = useParams(); // Assuming you're using useParams to get the project ID
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [period, setPeriod] = useState('daily');
    const [daysPreviously, setDaysPreviously] = useState(7); // Default value, you can change this as needed
    var [fromDate, setFromDate] = useState('');
    var [toDate, setToDate] = useState('');

    const generateGraph = async () => {
        const currentDate = new Date();
        const endDate = currentDate.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'
        console.log(endDate);
        let startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - daysPreviously);
        const startDateString = startDate.toISOString().split('T')[0];
        console.log(startDateString);
        setFromDate(fromDate = startDateString);
        setToDate(toDate = endDate);

        // Now you can use 'fromDate' and 'toDate' in your graph generation logic
        console.log('From Date:', fromDate);
        console.log('To Date:', toDate);
        setIsSubmitted(true);
        // Add your graph generation logic here
    };

    return (
        <div className={`center-div ${open ? 'sidebar-open' : ''} `} style={{ paddingBottom: "40px" }}>
            <div className="center-content">
                <h2>Recently Created Issue Chart</h2>
                <form>
                    <div className="mb-3">
                        <label htmlFor="period" className="form-label">Period:</label>
                        <select id="period" className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="daysPreviously" className="form-label">Days Previously:</label>
                        <input
                            type="number"
                            id="daysPreviously"
                            className="form-control"
                            value={daysPreviously}
                            onChange={(e) =>
                                setDaysPreviously(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={generateGraph}>
                        Generate Graph
                    </button>
                    {isSubmitted && (<Barchart fromDate={fromDate} toDate={toDate} period={period} />)}
                </form>
            </div>
        </div>
    );
}
