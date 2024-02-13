import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useParams } from 'react-router-dom';
const BarChart = ({ fromDate, toDate, period }) => {
    const { projectId } = useParams();
    const categories = [];
    const currentDate = new Date(fromDate);
    console.log(fromDate, toDate, period);
    var [allCards, setCards] = useState([]);
    var [doneCards, setdone] = useState([]);
    var [Issues, setIssues] = useState([]);
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
    console.log(categories)
    useEffect(() => {
        const fetchData = async () => {
            console.log("i");
            try {
                const response = await fetch(`http://localhost:3010/projects/kanban/${projectId}`);
                const data = await response.json();
                const lastBoardIdx = data.boards.length - 1;
                const newAllCards = await data.boards.reduce((accumulator, column) => {
                    return accumulator.concat(column.cards || []);
                }, []);
                setCards(allCards = newAllCards);
                console.log(allCards);
                const newAllCards1 = await data.boards[lastBoardIdx].cards;
                setdone(doneCards = newAllCards1);
                console.log(doneCards);
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() + 1);

                const currentTime = currentDate.toISOString().split('T')[0];
                const countedIssues = categories.map((date, index) => {
                    const endDate = index === categories.length - 1 ? currentTime : categories[index + 1];
                    const count = allCards.filter(
                        (card) => card.creationTime >= date && card.creationTime < endDate
                    ).length;
                    const resolvedIssueCount = allCards.filter(
                        (card) =>
                            card.creationTime >= date &&
                            card.creationTime < endDate &&
                            doneCards.some((doneCard) => doneCard._id === card._id)
                    ).length;
                    return { date, createdIssue: count, nonresolvedIssue: count - resolvedIssueCount };
                });
                console.log(countedIssues);
                setIssues(countedIssues);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [fromDate, period])
    var data = Issues;
    console.log(data)
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
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
            categories: data.map(item => item.date),
            labels: {
                formatter: function (val) {
                    const dateObject = new Date(val);
                    const options = { day: 'numeric', month: 'short', year: '2-digit' };
                    return dateObject.toLocaleDateString('en-US', options);
                },
            },
        },
        colors: ['#b31f1fef', '#06a306ea'], // Red for non-resolved, Green for resolved
        yaxis: {
            title: {
                text: 'Total Issues',
            },
            forceNiceScale: true,
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + ' issues';
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
                name: 'Non-Resolved',
                data: Issues.map((item) => item.nonresolvedIssue),
            },
            {
                name: 'Resolved',
                data: Issues.map((item) => item.createdIssue - item.nonresolvedIssue),
            },
        ];
        setChartSeries(seriesData);
    }, [Issues]); // Ensure that issues is the only dependency
    return <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />;
};

export default BarChart