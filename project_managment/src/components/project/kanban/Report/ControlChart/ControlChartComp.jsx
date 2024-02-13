import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { checkSession } from '../../../../sessioncheck/session';
import { useNavigate } from "react-router-dom";
const ControlChartComp = ({ fromDate, toDate, selectedColumns, showMyIssuesOnly }) => {
    var [allCards, setCards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                let user = await checkSession();
                console.log(user);

                if (user.message === "Session Expired") {
                    navigate('/login', { state: user });
                }

                console.log(selectedColumns);

                const newAllCards = await selectedColumns.reduce((accumulator, column) => {
                    return accumulator.concat(column.cards || []);
                }, []);
                setCards(allCards = newAllCards);

                if (showMyIssuesOnly) {
                    const filteredCards = newAllCards.filter(card => {
                        return card.members.some(member => member.member_id === user.id);
                    });
                    console.log(filteredCards);
                    setCards(allCards = filteredCards);
                }
                console.log(allCards);
            } catch (error) {
                console.error('Error checking session:', error);
            }
        };

        checkUserSession();
    }, [navigate, selectedColumns, showMyIssuesOnly]);
    const filteredBoards = allCards.map(card => {
        const filteredBoard = card.board.filter(board => {
            return selectedColumns.some(selectedColumn => selectedColumn._id === board.id);
        });
        return { ...card, board: filteredBoard };
    });
    const filteredCardData = filteredBoards.map(({ creationTime, board }) => {
        console.log(creationTime);
        if (new Date(creationTime).toISOString().split('T')[0] >= new Date(fromDate).toISOString().split('T')[0] && new Date(creationTime).toISOString().split('T')[0] <= new Date(toDate).toISOString().split('T')[0]) {
            console.log(creationTime);
            const totalTime = board.reduce((sum, boardItem) => sum + boardItem.total, 0);
            const newDate = new Date(creationTime);
            return { creationDate: newDate.toISOString().split('T')[0], totalTime };
        }
    }).filter(Boolean);
    console.log(filteredCardData);

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    // Sort data by creationDate
    filteredCardData.sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate));
    console.log(filteredCardData);
    // Calculate average total time
    const totalTimes = filteredCardData.map((point) => point.totalTime);
    const averageTotalTime = totalTimes.reduce((sum, time) => sum + time, 0) / totalTimes.length;

    // Track point occurrences for sizing markers
    const pointSizeMap = {};
    filteredCardData.forEach((point, index) => {
        const key = `${point.creationDate}-${point.totalTime}`;
        pointSizeMap[key] = (pointSizeMap[key] || 0) + 1;
    });
    console.log(pointSizeMap);
    // Prepare series data for scatter plot
    const seriesData = {
        single: [],
        multiple: [],
    };

    // Prepare data for the curve line
    const curveLineData = [{
        x: new Date(fromDate).getTime(),
        y: Number(averageTotalTime.toFixed(2)),
    }];


    filteredCardData.forEach((point, index, array) => {
        const key = `${point.creationDate}-${point.totalTime}`;
        const series = pointSizeMap[key] === 1 ? 'single' : 'multiple';
        const markerSize = pointSizeMap[key] > 1 ? 10 : 5;

        // Populate seriesData for scatter plot
        seriesData[series].push({
            x: new Date(point.creationDate).getTime(),
            y: point.totalTime,
            markerSize,
        });

        // Create data for the curve line
        if (index >= 4 && array.length > 4) {
            const avgTotalTime =
                (array.slice(index - 4, index + 5).reduce((sum, p) => sum + p.totalTime, 0) / 9).toFixed(2);

            curveLineData.push({
                x: new Date(point.creationDate).getTime(),
                y: Number(avgTotalTime),
            });
        }
    });
    curveLineData.sort((a, b) => {
        if (a.x === b.x) {
            return b.y - a.y;  // Sort in descending order for the same x value
        } else {
            return a.x - b.x;  // Sort based on x values if they are different
        }
    });
    console.log(curveLineData);
    // ApexCharts options
    const options = {
        chart: {
            type: ['scatter', 'scatter', 'line'],

        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val) {
                    return formatDate(val);
                },
            },
            title: {
                text: 'ISSUE TRANSITION DATE',
            },
            colors: ['#71C7FF', '#990000', '#FEBC3B']
        },
        yaxis: {
            title: {
                text: 'ELAPSED TIME (DAYS)',
            },
        },
        stroke: {
            curve: 'straight'
        },
        markers: {
            size: [4, 7, 1],
            colors: ['#0066cc', '#00e64d', '#FEBC3B'],
            strokeColors: ['#0066cc', '#00e64d', '#FEBC3B']
            //showNullDataPoints: true,

        },
        tooltip: {
            enabled: true,
            shared: false,
            intersect: true,
            followCursor: true,  // Enable followCursor for line series
        },
        annotations: {
            yaxis: [
                {
                    y: averageTotalTime,
                    borderColor: '#FF0000',
                    borderWidth: 2,
                    label: {
                        borderColor: '#FF0000',
                        style: {
                            color: '#FF0000',
                            background: 'none',
                            fontWeight: 'bold',
                        },
                        text: 'Average Total Time',
                    },
                },
            ],
        },
    };

    const series = [
        {
            name: 'Issue',
            type: "scatter",
            data: seriesData.single,
        },
        {
            name: 'Cluster of Issue',
            type: "scatter",
            data: seriesData.multiple,
        },
        {
            name: 'Rolling average',
            type: 'line',
            marker: {

            },
            data: curveLineData,
        },
    ];


    return (
        <div>
            <ReactApexChart
                series={series}
                options={options}
                height={550}
            />
        </div >
    );
};

export default ControlChartComp;
