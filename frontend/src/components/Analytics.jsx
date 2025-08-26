import React, { useEffect, useState } from "react";
import "../styles/Analytics.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Load from localStorage initially
    const storedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    setFiles(storedFiles);

    // Listen for changes from other tabs/components
    const handleStorageChange = () => {
      const updatedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
      setFiles(updatedFiles);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Calculate file stats
  const totalFiles = files.length;
  const fileTypeCount = files.reduce((acc, file) => {
    const typeCategory = file.type.split("/")[0] || "Other";
    acc[typeCategory] = (acc[typeCategory] || 0) + 1;
    return acc;
  }, {});

  // Get most popular file type
  const mostPopularType =
    Object.keys(fileTypeCount).length > 0
      ? Object.entries(fileTypeCount).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  // Convert to chart data
  const chartData = Object.entries(fileTypeCount).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#9C27B0"];

  return (
    <div className="analytics-container">
      <h2>Analytics Overview</h2>

      <div className="analytics-cards">
        <div className="analytics-card">
          <h3>Total Files Uploaded</h3>
          <p>{totalFiles}</p>
        </div>
        <div className="analytics-card">
          <h3>Most Popular File Type</h3>
          <p>{mostPopularType}</p>
        </div>
      </div>

      <div className="chart-section">
        <h3>File Type Distribution</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No files uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
