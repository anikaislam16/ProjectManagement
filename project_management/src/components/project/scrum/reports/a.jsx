import React from "react";
import ReactApexChart from "react-apexcharts";

const ControlChartComp = () => {
  const fromDate = new Date();
  const toDate = new Date() + 14 * 60 * 60 * 24;
  const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate.toISOString().split("T")[0];
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };

  // Sample data (replace with your actual data)
  let filteredCardData = [
    { creationDate: addDays(fromDate, 14), totalTime: 5 },
    { creationDate: addDays(fromDate, 14), totalTime: 5 },
    { creationDate: addDays(fromDate, 14), totalTime: 8 },
    { creationDate: addDays(fromDate, 0), totalTime: 3 },
    { creationDate: addDays(toDate, 0), totalTime: 7 },
    { creationDate: addDays(fromDate, 1), totalTime: 8 },
    { creationDate: addDays(fromDate, 19), totalTime: 10 },
    { creationDate: addDays(fromDate, 19), totalTime: 10 },
    { creationDate: addDays(fromDate, 21), totalTime: 5 },
    { creationDate: addDays(fromDate, 6), totalTime: 1 },
    { creationDate: addDays(toDate, 9), totalTime: 11 },
    { creationDate: addDays(fromDate, 10), totalTime: 9 },
    // Add more card data
  ];

  // Sort data by creationDate
  filteredCardData.sort(
    (a, b) => new Date(a.creationDate) - new Date(b.creationDate)
  );

  // Calculate average total time
  const totalTimes = filteredCardData.map((point) => point.totalTime);
  const averageTotalTime =
    totalTimes.reduce((sum, time) => sum + time, 0) / totalTimes.length;

  // Track point occurrences for sizing markers
  const pointSizeMap = {};
  filteredCardData.forEach((point, index) => {
    const key = `${point.creationDate}-${point.totalTime}`;
    pointSizeMap[key] = (pointSizeMap[key] || 0) + 1;
  });

  // Prepare series data for scatter plot
  const seriesData = {
    single: [],
    multiple: [],
  };

  // Prepare data for the curve line
  const curveLineData = [];

  filteredCardData.forEach((point, index, array) => {
    const key = `${point.creationDate}-${point.totalTime}`;
    const series = pointSizeMap[key] === 1 ? "single" : "multiple";
    const markerSize = pointSizeMap[key] > 1 ? 10 : 5;

    // Populate seriesData for scatter plot
    seriesData[series].push({
      x: new Date(point.creationDate).getTime(),
      y: point.totalTime,
      markerSize,
    });

    // Create data for the curve line
    if (index >= 4 && index < array.length - 4) {
      const avgTotalTime = (
        array
          .slice(index - 4, index + 5)
          .reduce((sum, p) => sum + p.totalTime, 0) / 9
      ).toFixed(2);

      curveLineData.push({
        x: new Date(point.creationDate).getTime(),
        y: Number(avgTotalTime),
      });
    }
  });

  // ApexCharts options
  const options = {
    chart: {
      type: "scatter",
      stacked: false,
    },
    xaxis: {
      type: "datetime",
      labels: {
        formatter: function (val) {
          return formatDate(val);
        },
      },
    },
    yaxis: {
      title: {
        text: "Total Time",
      },
    },
    markers: {
      size: 5,
    },
    annotations: {
      yaxis: [
        {
          y: averageTotalTime,
          borderColor: "#FF0000",
          borderWidth: 2,
          label: {
            borderColor: "#FF0000",
            style: {
              color: "#FF0000",
              background: "none",
              fontWeight: "bold",
            },
            text: "Average Total Time",
          },
        },
      ],
    },
  };

  // Adding a line series for the curve line
  const curveLineSeries = [
    {
      name: "Curve Line",
      type: "line",
      data: curveLineData,
    },
  ];

  return (
    <div>
      <ReactApexChart
        series={[
          {
            name: "Single",
            data: seriesData.single,
          },
          {
            name: "Multiple",
            data: seriesData.multiple,
          },
          ...curveLineSeries,
        ]}
        options={options}
        type="scatter"
        height={350}
      />
    </div>
  );
};

export default ControlChartComp;
