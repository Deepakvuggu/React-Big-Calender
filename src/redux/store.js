// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "./calendarSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
  },
});
