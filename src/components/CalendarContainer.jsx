import React from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";

const CalendarContainer = () => {


    return (
        <div className='news-main-layout'>
            <h1>Calendario</h1>
            <div className='calendar-container'>

                <FullCalendar 
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={'dayGridMonth'}
                    headerToolbar={{start: 'title', center: 'dayGridMonth,timeGridWeek,timeGridDay', end: 'today prev,next'}}
                    height={'100%'}

                    events={[
                        { title: 'event 1', date: '2023-11-14' },
                        { title: 'event 2', date: '2023-11-14' }
                      ]}

                      eventContent={renderEventContent}
                    />

            </div>
        </div>
    )
}

function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

export default CalendarContainer