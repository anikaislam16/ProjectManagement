// ControlChart.js
import React, { useContext, useState, useEffect } from "react";
import SidebarContext from "../../../../../sidebar_app/components/sidebar_context/SidebarContext";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import './ControlChart.css'; // Import your CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import ControlChartComp from './ControlChartComp';
import { useParams } from 'react-router-dom';
const ControlChart = () => {
    const { projectId } = useParams();
    const [boards, setboards] = useState([]);
    const [startTime, setDate] = useState(new Date());
    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                // Fetch project data from the API
                const response = await fetch(`http://localhost:3010/projects/kanban/${projectId}`);
                const data = await response.json();
                setDate(data.creationTime);
                console.log(startTime);
                setboards(data.boards);
                console.log(boards);
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

        // Call the fetch function
        fetchProjectData();
    }, [projectId]);

    const [isSubmitted, setIsSubmitted] = useState(false); // State to track form submission
    const [fromDate, setfromDate] = useState(null);
    const [selectedColumns, setselectedColumns] = useState([]);
    const [toDate, settoDate] = useState(null);
    const [showMyIssuesOnly, setshowMyIssuesOnly] = useState(false);
    const handleFormSubmit = async (values) => {
        // Implement the logic to fetch and update chart data based on form values
        console.log('Form values:', values);
        setIsSubmitted(true);
        setfromDate(values.fromDate);
        //  setselectedColumns((values.selectedColumns));
        const a = boards.filter(board => values.selectedColumns.includes(board._id));
        console.log(boards);
        console.log(a);
        setselectedColumns(a);
        settoDate(values.toDate);
        setshowMyIssuesOnly(values.showMyIssuesOnly);
        console.log(selectedColumns);
    };
    const getDefaultFromDate = (timeframe) => {
        const currentDate = new Date();
        console.log(currentDate);
        let defaultFromDate;

        switch (timeframe) {
            case 'lastWeek':
                defaultFromDate = new Date(currentDate);
                defaultFromDate.setDate(currentDate.getDate() - 7);
                break;
            case 'lastMonth':
                defaultFromDate = new Date(currentDate);
                defaultFromDate.setMonth(currentDate.getMonth() - 1);
                break;
            case 'last2Months':
                defaultFromDate = new Date(currentDate);
                defaultFromDate.setMonth(currentDate.getMonth() - 2);
                break;
            case 'last6Months':
                defaultFromDate = new Date(currentDate);
                defaultFromDate.setMonth(currentDate.getMonth() - 6);
                break;
            case 'lastYear':
                defaultFromDate = new Date(currentDate);
                defaultFromDate.setFullYear(currentDate.getFullYear() - 1);
                break;
            case 'allTime':
                defaultFromDate = new Date(startTime);
                if (defaultFromDate.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0])
                    defaultFromDate.setDate(currentDate.getDate() - 1);
                break;
            default:
                defaultFromDate = new Date(currentDate);
                break;
        }

        return defaultFromDate.toISOString().split('T')[0];
    };

    const { open } = useContext(SidebarContext);
    return (
        <div className={`center-div ${open ? "sidebar-open" : ""}`} style={{ paddingBottom: "100px" }}>
            <div className="center-content">
                <h2>Kanban Chart</h2>
                <div className="control-chart-form">


                    <Formik
                        initialValues={{
                            timeframe: 'lastMonth', // Default timeframe
                            toDate: new Date().toISOString().split('T')[0], // Current date
                            selectedColumns: [],
                            showMyIssuesOnly: false,
                            fromDate: getDefaultFromDate('lastMonth'),
                        }}
                        onSubmit={handleFormSubmit}
                    >
                        {({ values, setFieldValue }) => (
                            <Form className="frm">
                                <div className="form-side time">
                                    <div className="form-group">
                                        <label>Timeframe:</label>
                                        <Field as="select" name="timeframe" value={values.timeframe} onClick={(e) => {
                                            setFieldValue('fromDate', getDefaultFromDate(e.target.value));
                                            setFieldValue('toDate', new Date().toISOString().split('T')[0]);
                                        }}>
                                            <option value="lastWeek">Last Week</option>
                                            <option value="lastMonth">Last Month</option>
                                            <option value="last2Months">Last 2 Months</option>
                                            <option value="last6Months">Last 6 Months</option>
                                            <option value="lastYear">Last Year</option>
                                            <option value="allTime">All Time</option>
                                            <option value="custom">Custom</option>
                                        </Field>
                                    </div>

                                    <div className="form-group">
                                        <label>From:</label>
                                        <Field type="date" name="fromDate" onChange={(e) => {
                                            setFieldValue('timeframe', 'custom');
                                            {
                                                e.target.value > values.toDate || e.target.value > new Date().toISOString().split('T')[0] ?
                                                    setFieldValue('fromDate', values.toDate)
                                                    :
                                                    setFieldValue('fromDate', e.target.value);
                                            }
                                        }} value={values.fromDate} />
                                    </div>

                                    <div className="form-group">
                                        <label>To:</label>
                                        <Field type="date" name="toDate" onChange={(e) => {
                                            setFieldValue('timeframe', 'custom');
                                            {
                                                values.fromDate >= e.target.value || e.target.value > new Date().toISOString().split('T')[0] ?
                                                    setFieldValue('toDate', new Date().toISOString().split('T')[0])
                                                    :
                                                    setFieldValue('toDate', e.target.value);
                                            }
                                        }} value={values.toDate} />
                                    </div>
                                </div>

                                <div className="form-side others">
                                    <div className="form-group">
                                        <label>Select Columns:</label>
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-secondary dropdown-toggle"
                                                type="button"
                                                id="columnDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                            >
                                                Selected Columns
                                            </button>
                                            <div className="dropdown-menu" aria-labelledby="columnDropdown">
                                                {boards.map((board) => (
                                                    <div key={board._id} className="dropdown-item">
                                                        <Field
                                                            type="checkbox"
                                                            id={`boardCheckbox_${board._id}`}
                                                            name="selectedColumns"
                                                            value={board._id}
                                                            checked={values.selectedColumns.includes(board._id)}
                                                        />
                                                        <label htmlFor={`boardCheckbox_${board._id}`}>{board.name}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <Field type="checkbox" name="showMyIssuesOnly" />
                                        <label>Show My Issues Only</label>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Generate Chart</button>

                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                {isSubmitted && (
                    <ControlChartComp
                        fromDate={fromDate}
                        toDate={toDate}
                        selectedColumns={selectedColumns}
                        showMyIssuesOnly={showMyIssuesOnly}
                    />
                )}
            </div>
        </div>
    );
};

export default ControlChart;
