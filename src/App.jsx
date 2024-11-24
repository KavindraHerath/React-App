import React, { useState, useEffect } from "react";
import './App.css';
import background from './assets/background.jpg';
import axios from "axios";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
    // State variables
    const [chartData, setChartData] = useState([]); // To store the API data
    const [selectedCoin, setSelectedCoin] = useState("BTCUSDT"); // Default selected coin
    const [startDate, setStartDate] = useState(new Date("2024-11-04")); // Default start date
    const [endDate, setEndDate] = useState(new Date("2024-11-16")); // Default end date

    // Fetch data from Binance API
    const fetchKlineData = async () => {
        try {
            // API call with selected coin, interval, and limit
            const response = await axios.get(
                `https://api.binance.com/api/v3/klines?symbol=${selectedCoin}&interval=1d&limit=100`
            );

            // Process the response to extract dates and closing prices
            const processedData = response.data.map((item) => ({
                date: new Date(item[0]).toISOString().split("T")[0], // Format timestamp to 'YYYY-MM-DD'
                close: parseFloat(item[4]), // Closing price
            }));

            // Filter the data based on the selected date range
            const filteredData = processedData.filter((data) => {
                const dataDate = new Date(data.date);
                return dataDate >= startDate && dataDate <= endDate;
            });

            setChartData(filteredData); // Set the filtered data for the chart
        } catch (error) {
            console.error("Error fetching kline data:", error); // Handle errors
        }
    };

    // Fetch data whenever the coin, start date, or end date changes
    useEffect(() => {
        fetchKlineData();
    }, [selectedCoin, startDate, endDate, fetchKlineData]);

    // Chart.js data configuration
    const lineChartData = {
        labels: chartData.map((data) => data.date), // X-axis: Dates
        datasets: [
            {
                label: "Closing Price", // Label for the dataset
                data: chartData.map((data) => data.close), // Y-axis: Closing prices
                borderColor: "#4ADE80", // Line color
                backgroundColor: "rgba(74, 222, 128, 0.2)", // Fill color
                tension: 0.3, // Curve tension
                fill: true, // Fill area under the line
            },
        ],
    };

    // Chart.js options configuration
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true, // Show the legend
                position: "top", // Position legend at the top
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date", // X-axis label
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Closing Price", // Y-axis label
                },
                beginAtZero: false, // Do not force Y-axis to start at zero
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-center mb-8">Cryptocurrency Price Chart</h1>

            {/* Dropdown and Date Selection */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                {/* Dropdown to select coin */}
                <div>
                    <label className="block mb-2 font-semibold">Select Coin</label>
                    <select
                        className="p-2 border border-gray-300 rounded-md"
                        value={selectedCoin}
                        onChange={(e) => setSelectedCoin(e.target.value)}
                    >
                        <option value="BTCUSDT">BTCUSDT</option>
                        <option value="ETHUSDT">ETHUSDT</option>
                        <option value="BNBUSDT">BNBUSDT</option>
                    </select>
                </div>

                {/* Datepicker to select start date */}
                <div>
                    <label className="block mb-2 font-semibold">Select Start Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Datepicker to select end date */}
                <div>
                    <label className="block mb-2 font-semibold">Select End Date</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Line data={lineChartData} options={lineChartOptions} />
            </div>
        </div>
    );
}

export default App;
