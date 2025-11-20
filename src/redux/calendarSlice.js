// src/redux/calendarSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { format, parse } from 'date-fns';
import dummyData from '../Components/Calender/dummyData.json'
/**
 * We store:
 *  - data: the raw dummy json (keys are dd-MM-yyyy)
 *  - selectedKey: the selected date key string in dd-MM-yyyy format (or null)
 *  - modalOpen: boolean
 *
 * Storing the date as a key string avoids Date serialization issues in Redux.
 */
const TO_KEY = (date) => {
  if (!date) return null;
  // date may be a Date object or string; try to create Date
  const d = typeof date === 'string' ? parse(date, 'dd-MM-yyyy', new Date()) : date;
  return format(d, 'dd-MM-yyyy');
};

const initialState = {
  data: dummyData,
  selectedKey: null,
  modalOpen: false
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    selectDate(state, action) {
      const payload = action.payload;
      const key = TO_KEY(payload);
      state.selectedKey = key;
      state.modalOpen = true;
    },
    closeModal(state) {
      state.modalOpen = false;
      // keep selectedKey if you want to preserve it; otherwise uncomment next line
      // state.selectedKey = null;
    },
    openModalForKey(state, action) {
      state.selectedKey = action.payload; // expects dd-MM-yyyy string
      state.modalOpen = true;
    },
    setData(state, action) {
      state.data = action.payload;
    }
  }
});

export const { selectDate, closeModal, openModalForKey, setData } = calendarSlice.actions;
export default calendarSlice.reducer;

// Selectors
export const selectCalendarData = (state) => state.calendar.data;
export const selectSelectedKey = (state) => state.calendar.selectedKey;
export const selectModalOpen = (state) => state.calendar.modalOpen;
