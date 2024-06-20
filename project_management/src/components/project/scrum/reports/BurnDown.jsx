import Chart from "react-apexcharts";
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
import "./GraphScrum.css";
import OffdaySelector from "./OffdaySelector";
function BurnDown() {
  const { open } = useContext(SidebarContextScrum);
  const { projectId } = useParams();
  const [selectedOffDays, setSelectedOffDays] = useState([]);
  const [showOffDaysSelector, setShowOffDaysSelector] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const [dateRange1, setDateRange1] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [totalPoint, setTotalPoint] = useState(0);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [option, setOption] = useState({
    title: { text: "" },
    xaxis: {
      title: { text: "" },
      categories: dateRange,
      labels: {
        formatter: function (val) {
          const dateObject = new Date(val);
          const options = { day: "numeric", month: "short" };
          return dateObject.toLocaleDateString("en-US", options);
        },
      },
    },
    chart: {
      width: 1000, // Set an initial width for the chart

      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
      selection: {
        enabled: false,
      },
    },
    colors: ["#eabd5d", "#4be4ec", "#f2f2f2"],
  });
  const [data, setData] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [BoardData, setBoardData] = useState(null);
  const [remainingStoryPoints, setRemainingStoryPoints] = useState(0);
  const [storyPointsPerDay, setStoryPointsPerDay] = useState(0);
  const [burnDownData, setBurnDownData] = useState([]);
  const [actualData, setActualData] = useState([]);
  const [showSelectedDaysBar, setShowSelectedDaysBar] = useState(false);
  const [BarChartData, setBarChartData] = useState([]);
  const initializeData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/projects/scrum/${projectId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      // Format the data and update the state
      const formattedData = result.boards
        .filter((board) => board.started === true)
        .map((board) => ({
          id: board._id,
          name: board.name,
          card: board.cards,
          sprintStart: board.sprintStart.split("T")[0],
          totalPoints: board.totalPoints,
          sprintEnd: board.sprintEnd.split("T")[0],
          goal: board.goal,
          completed: board.completed,
          boardType: board.boardType,
        }));

      setData(formattedData);
      console.log(formattedData);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBoardChange = (event) => {
    if (event.target.value === "Select a board") {
      setSelectedBoard(null);
    } else {
      setSelectedBoard(event.target.value);
      const Board = data.find((board) => board.id === event.target.value);
      setBoardData(Board);
    }
    // Do something with the selected board if needed
  };
  const generateDateRange = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const daysArray = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      daysArray.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return daysArray;
  };

  const handleSubmit = (selectedDays) => {
    setSelectedOffDays(selectedDays);
    // Here you can store the selected off days
    console.log("Selected off days:", selectedDays);
    // Perform your storage logic here, like sending them to the server or storing in local storage
    setShowOffDaysSelector(false);
  };
  useEffect(() => {
    if (BoardData && totalDays > 0) {
      const calculatedStoryPointsPerDay = (
        BoardData.totalPoints /
        (totalWorkingDays - 1)
      ).toFixed(2);

      setStoryPointsPerDay(parseFloat(calculatedStoryPointsPerDay));
      setRemainingStoryPoints(parseFloat(BoardData.totalPoints));
      const calculatedBurnDownData = [];
      const Bar = [];
      Bar.push(0);
      let remainingPoints = parseFloat(BoardData.totalPoints);
      console.log(dateRange1[1]);
      for (let day = 1; day <= totalDays; day++) {
        console.log(dateRange1[day]);
        console.log(remainingPoints);
        if (dateRange1[day] && dateRange1[day].isWorkingDay) {
          calculatedBurnDownData.push(
            remainingPoints < 0 ? 0 : parseFloat(remainingPoints.toFixed(2))
          );
          Bar.push(0);
          remainingPoints = remainingPoints - parseFloat(storyPointsPerDay);
        } else {
          calculatedBurnDownData.push(
            remainingPoints < 0 ? 0 : parseFloat(remainingPoints.toFixed(2))
          );
          Bar.push(BoardData.totalPoints);
        }
      }
      console.log(Bar);

      setBurnDownData(calculatedBurnDownData);
    }
  }, [BoardData, totalDays, storyPointsPerDay, totalWorkingDays]);
  const calculateCumulativeSum = (date, cards) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Set time to midnight to ignore time component

    const filteredCards = cards.filter((card) => {
      console.log(card.cardName, targetDate, new Date(card.dueDate));
      return card.progres === "done" && new Date(card.dueDate) <= targetDate;
    });

    const sum = filteredCards.reduce((acc, card) => acc + card.storyPoints, 0);

    console.log("Target Date:", targetDate);
    console.log("Filtered Cards:", filteredCards);
    console.log("Sum:", sum);

    return sum;
  };

  useEffect(() => {
    if (storyPointsPerDay > 0) {
      const updatedRemainingStoryPoints = parseFloat(
        remainingStoryPoints - storyPointsPerDay
      );
      setRemainingStoryPoints(updatedRemainingStoryPoints);
    }
  }, [storyPointsPerDay]);
  useEffect(() => {
    if (BoardData) {
      // Get the date one day before sprintStart
      const sprintStartDate = new Date(BoardData.sprintStart);
      const oneDayBeforeSprintStart = new Date(sprintStartDate);
      oneDayBeforeSprintStart.setDate(sprintStartDate.getDate() - 1);

      // Generate the date range including the day before sprintStart
      let daysArray = generateDateRange(
        oneDayBeforeSprintStart.toISOString().split("T")[0],
        BoardData.sprintEnd
      );
      daysArray[0] = "";
      setDateRange(daysArray);
      setTotalDays(daysArray.length);
    }
  }, [BoardData]);

  useEffect(() => {
    setOption((prevOption) => ({
      ...prevOption,
      xaxis: {
        ...prevOption.xaxis,
        categories: dateRange,
      },
    }));
  }, [dateRange, totalPoint]);
  useEffect(() => {
    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized]);
  useEffect(() => {
    if (BoardData) {
      // Calculate cumulative sum for each date
      const cumulativeSumData = dateRange.map((date) => {
        const sum = calculateCumulativeSum(date, BoardData.card);
        return sum;
      });
      console.log(cumulativeSumData);
      const modifiedCumulativeSumData = cumulativeSumData.map(
        (sum) => BoardData.totalPoints - sum
      );

      // Assuming you have a state variable to hold this data, update it like this:
      setActualData(modifiedCumulativeSumData);
    }
  }, [BoardData, dateRange, burnDownData]);
  useEffect(() => {
    if (BoardData && dateRange.length > 0) {
      // Assuming dateRange contains strings representing dates in ISO format (e.g., "2024-02-15")
      console.log(dateRange);
      let a = 0;
      const BarChartData = [];
      const dateObjects = dateRange.map((dateString) => {
        const date = new Date(dateString);
        const dayOfWeek = date.getDay(); // Get the day of the week from the Date object
        const dayName = daysOfWeek[dayOfWeek]; // Get the name of the day from the daysOfWeek array
        const isWorkingDay = !selectedOffDays.find(
          (offDay) => offDay === dayName
        ); // Check if it's a working day
        if (isWorkingDay === true) {
          a = a + 1;
          BarChartData.push(0);
        } else {
          BarChartData.push(BoardData.totalPoints);
        }
        return { date: dateString, isWorkingDay }; // Return an object with date and isWorkingDay properties
      });
      setTotalWorkingDays(a);
      setBarChartData(BarChartData);
      setDateRange1(dateObjects);
      console.log("Date objects with working status:", dateObjects);
    }
  }, [BoardData, dateRange, selectedOffDays]);

  useEffect(() => {
    if (BoardData) {
      setTotalPoint(BoardData.totalPoint);
      console.log(BoardData.totalPoints);
      setOption((prevOption) => ({
        ...prevOption,

        yaxis: {
          max: BoardData.totalPoints,

          // Set the upper limit for the y-axis
        },
      }));
    }
  }, [BoardData]);
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        {isInitialized && (
          <div>
            <label>Select Board:</label>
            <select value={selectedBoard} onChange={handleBoardChange}>
              <option value={null}>Select a board</option>
              {data.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
            {selectedBoard ? (
              showOffDaysSelector ? (
                <OffdaySelector
                  selectedOffDays={selectedOffDays}
                  setSelectedOffDays={setSelectedOffDays}
                  handleSubmit={handleSubmit}
                />
              ) : (
                <button onClick={() => setShowOffDaysSelector(true)}>
                  Include Non-Working Days
                </button>
              )
            ) : null}
            {selectedBoard && selectedOffDays.length > 0 && BoardData && (
              <div>
                {/* Render details or perform actions related to the selected board */}
                <div
                  className="container-fluid mt-3 mb-3"
                  style={{ paddingBottom: "100px" }}
                >
                  <h2>Burn Down Chart in Scrum</h2>
                  <Chart
                    type="line"
                    width={1090}
                    height={550}
                    series={[
                      {
                        name: "Remaining Story Points",
                        type: "line",
                        data: burnDownData,
                      },
                      {
                        name: "Cumulative Sum",
                        type: "line",
                        data: actualData,
                      },
                      {
                        name: "Non-Working Days",
                        type: "bar",
                        data: BarChartData,
                      },
                    ]}
                    options={option}
                  ></Chart>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BurnDown;
