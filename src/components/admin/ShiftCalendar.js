import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function ShiftCalendar({ shifts, onDateSelect }) {
  const events = shifts.map(shift => ({
    title: `${shift.staffName} (${shift.startTime}-${shift.endTime})`,
    start: new Date(shift.date + 'T' + shift.startTime),
    end: new Date(shift.date + 'T' + shift.endTime),
  }));

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={({ start }) => onDateSelect(start)}
        selectable
        style={{ height: 500 }}
      />
    </div>
  );
}