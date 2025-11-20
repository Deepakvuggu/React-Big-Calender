// src/components/Calendar/BigCalendar.jsx
import React from "react";
import { Calendar, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import { dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";
import './calender.css'

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const BigCalendar = () => {
  const events = useSelector((state) => state.calendar.events);

  return (
    <div className="calendar-container">
      <h2 className="calendar-heading">React Big Calendar</h2>

      <Calendar
        localizer={localizer}
        events={events}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, background: "#fff", padding: "20px" }}
      />
    </div>
  );
};

export default BigCalendar;
