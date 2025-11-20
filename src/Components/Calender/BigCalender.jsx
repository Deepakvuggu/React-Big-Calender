// src/Components/Calendar/BigCalendar.jsx
import React, { useMemo } from 'react';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calender.css';
import Modal from 'react-modal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { selectCalendarData, selectSelectedKey, selectModalOpen, selectDate, closeModal } from '../../redux/calendarSlice';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales
});

// Ensure accessibility root
Modal.setAppElement('#root');

const keyToDate = (key) => parse(key, 'dd-MM-yyyy', new Date());

const formatKey = (date) => {
    try {
        return format(date, 'dd-MM-yyyy');
    } catch (e) {
        const d = new Date(date);
        return format(d, 'dd-MM-yyyy');
    }
};

export default function BigCalendarComponent() {
    const dispatch = useDispatch();
    const data = useSelector(selectCalendarData);
    const selectedKey = useSelector(selectSelectedKey);
    const modalOpen = useSelector(selectModalOpen);

    // Build events so calendar visually indicates days that have data
    const events = useMemo(() => {
        return Object.keys(data).map((key) => {
            const parsed = keyToDate(key);
            return {
                title: 'Has Data',
                start: parsed,
                end: parsed,
                allDay: true,
                dataKey: key
            };
        });
    }, [data]);

    // highlight cells that have data; outline selected
    const dayPropGetter = (date) => {
        const key = formatKey(date);
        const has = Object.prototype.hasOwnProperty.call(data, key);
        const style = {};
        if (has) {
            style.backgroundColor = '#e6f7ff';
            style.borderRadius = '6px';
        }
        if (selectedKey && selectedKey === key) {
            style.outline = '3px solid #1890ff';
        }
        return { style };
    };

    // clicking a slot
    const handleSelectSlot = (slotInfo) => {
        const date = slotInfo.start || slotInfo;
        dispatch(selectDate(date));
    };

    // clicking a built event
    const handleSelectEvent = (event) => {
        const date = event.start;
        dispatch(selectDate(date));
    };

    const close = () => dispatch(closeModal());

    const modalBody = () => {
        if (!selectedKey) return null;

        const dayData = data[selectedKey];
        const parsedDate = keyToDate(selectedKey);

        if (!dayData || dayData.length === 0) {
            return (
                <div className="modal-body">
                    <h2>No data found for the selected date</h2>
                    <p>{format(parsedDate, 'dd MMM yyyy')}</p>
                </div>
            );
        }

        const chartData = dayData.map((item) => {
            const name = Object.keys(item)[0];
            return { name, value: item[name] };
        });

        return (
            <div className="modal-body">
                <h3>Data for {format(parsedDate, 'dd MMM yyyy')}</h3>
                <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <div className="calendar-wrap">
            <h2>React Big Calendar — Data + Bar Graph Popup</h2>

            <Calendar
                localizer={localizer}
                events={events}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                startAccessor="start"
                endAccessor="end"
                selectable
                style={{ height: 650 }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                dayPropGetter={dayPropGetter}
            />

            <Modal
                isOpen={modalOpen}
                onRequestClose={close}
                contentLabel="Date Data Modal"
                style={{
                    content: {
                        maxWidth: '720px',
                        margin: 'auto',
                        inset: '40px',
                        padding: '20px',
                        borderRadius: '8px'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.35)'
                    }
                }}
            >
                <button onClick={close} className="modal-close">Close</button>
                {modalBody()}
            </Modal>
        </div>
    );
}
