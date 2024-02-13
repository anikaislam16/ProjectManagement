import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useParams } from 'react-router-dom';
import IssuesTable from './IssuesTable';
export default function ResolutionChart({ fromDate, toDate, period }) {
    const { projectId } = useParams();
    const categories = [];
    var [doneCards, setdone] = useState([]);
    var [Issues, setIssues] = useState([]);
    const currentDate = new Date(fromDate);
    console.log(fromDate, toDate, period);
    while (currentDate <= new Date(toDate)) {
        categories.push(currentDate.toISOString().split('T')[0]); // Format: 'YYYY-MM-DD'
        switch (period) {
            case 'daily':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            case 'quarterly':
                currentDate.setMonth(currentDate.getMonth() + 3);
                break;
            case 'yearly':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
            default:
                break;
        }
    }
    console.log(categories);
    useEffect(() => {
        const fetchData = async () => {
            console.log("i");
            try {
                const response = await fetch(`http://localhost:3010/projects/kanban/${projectId}`);
                const data = await response.json();
                console.log(data);
                const lastBoardIdx = data.boards.length - 1;
                const newAllCards1 = await data.boards[lastBoardIdx].cards;
                // console.log(newAllCards1);
                setdone(doneCards = newAllCards1);
                console.log(doneCards);

                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);

                const currentTime = currentDate.toISOString().split('T')[0];
                const countedIssues = categories.map((date, index) => {
                    const endDate = index === categories.length - 1 ? currentTime : categories[index + 1];
                    const count = doneCards.filter(
                        (card) => card.finishedTime >= date && card.finishedTime < endDate
                    ).length;
                    //  console.log(count);
                    const totalTime =
                        doneCards.reduce((total, card) => {
                            if (card.finishedTime >= date && card.finishedTime < endDate) {
                                const finishedTime = new Date(card.finishedTime);
                                const creationTime = new Date(card.creationTime);
                                // Calculate day difference by rounding down to the nearest whole day
                                const dayDifference = Math.floor((finishedTime - creationTime) / (24 * 60 * 60 * 1000));
                                console.log(dayDifference);
                                total += dayDifference;
                            }
                            return total;
                        }, 0);
                    return { date, resolvedIssue: count, totalTime };
                });
                console.log(countedIssues);
                setIssues(countedIssues);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [fromDate, period])
    console.log(Issues);

    const data = Issues;
    console.log(data)
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            categories: Issues.map(item => item.date),
            labels: {
                formatter: function (val) {
                    const dateObject = new Date(val);
                    const options = { day: 'numeric', month: 'short', year: '2-digit' };
                    return dateObject.toLocaleDateString('en-US', options);
                },
            },
        },
        colors: '#06a306ea', // Red for non-resolved, Green for resolved
        yaxis: {
            title: {
                text: 'Average Time',
            },
            forceNiceScale: true,
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + ' Days per Issue '; ///eta pore change korbo....
                },
            },
        },
    });

    const [chartSeries, setChartSeries] = useState([]);
    useEffect(() => {
        setChartOptions((prevOptions) => ({
            ...prevOptions,
            xaxis: {
                ...prevOptions.xaxis,
                categories: Issues.map((item) => item.date),
            },
        }));

        const seriesData = [
            {
                name: 'Average Resolve time',
                data: Issues.map((item) => Math.round(item.totalTime / item.resolvedIssue)),
            },
        ];
        setChartSeries(seriesData);
    }, [Issues]); // Ensure that Issues is the only dependency

    return (
        <div>
            <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
            <h1 className='pt-5'>Data Table</h1>
            <IssuesTable issues={Issues} period={period} />
        </div>
    );
};
