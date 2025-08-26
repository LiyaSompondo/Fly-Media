
import React from "react";
import "../styles/Calendar.css";

const tasks = {
  1: "Brand Introduction",
  2: "Content Creation",
  3: "SEO Optimization",
  4: "Social Media Strategy",
  5: "Analytics Review",
  6: "Content Distribution",
  7: "Engagement Tactics",
};

const Calendar = () => {
  const year = 2025;
  const month = 7; // August (0 = Jan, 7 = Aug)
  const date = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = date.getDay(); // Sunday = 0

  // Generate empty slots before month starts
  const days = Array(startDay).fill(null);

  // Fill in actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="calendar-container">
      <h2 className="calendar-header">August {year}</h2>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="calendar-day-header">
            {d}
          </div>
        ))}
        {days.map((day, i) => (
          <div key={i} className="calendar-day">
            {day && (
              <>
                <span className="date-number">{day}</span>
                {tasks[day] && (
                  <div className="task">{tasks[day]}</div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

