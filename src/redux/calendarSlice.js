// src/redux/calendarSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [
    {
      id: 1,
      title: "Meeting with Client",
      start: new Date(2025, 1, 12, 10, 0),
      end: new Date(2025, 1, 12, 12, 0),
    },
    {
      id: 2,
      title: "Project Deadline",
      start: new Date(2025, 1, 15, 9, 0),
      end: new Date(2025, 1, 15, 9, 0),
    },
    {
      id: 3,
      title: "Team Discussion",
      start: new Date(2025, 1, 20, 14, 0),
      end: new Date(2025, 1, 20, 16, 0),
    },
  ],
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
  },
});

export const { addEvent } = calendarSlice.actions;
export default calendarSlice.reducer;
