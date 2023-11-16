import React, { useContext, useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import { UserContext } from '../contexts/UserContext';
import { activities_get_by_neighborhood_id } from '../requests/Activities';

const CalendarContainer = () => {
    const { userInfo } = useContext(UserContext);
    const [refresh, setRefresh] = useState(false);
    const [activitiesList, setActivitiesList] = useState([]);

    useEffect(() => {
        if (userInfo.neighborhood.neighborhood_id) {
            getAcitiviesList();
        }

    }, [refresh])

    const getAcitiviesList = async () => {
        const response = await activities_get_by_neighborhood_id(userInfo.neighborhood.neighborhood_id);
        setActivitiesList(response.data.reverse());
    }

    const events = activitiesList.map((activity) => ({
        title: activity.title,
        start: activity.start_date.slice(0, -1),
        end: activity.end_date.slice(0, -1),
        description: activity.description,
    }));

    const handleDateClick = (arg) => {
        alert(arg.dateStr)
    }

    return (
        <div className='news-main-layout'>
            <h1>Calendario</h1>
            <div className='calendar-container'>

                <FullCalendar 
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={'dayGridMonth'}
                    headerToolbar={{start: 'title', center: 'dayGridMonth,timeGridWeek,timeGridDay', end: 'today prev,next'}}
                    height={'100%'}
                    events={events}
                    locale={esLocale}
                    nowIndicator
                    eventDisplay={'block'}
                    // eventBackgroundColor 
                    // eventTextColor={'red'}
                    // eventBorderColor
                    eventContent={renderEventContent}
                    // dateClick={handleDateClick}
                    
                    />

            </div>
        </div>
    )
}

function renderEventContent(eventInfo) {

    return (
        <div style={{ overflowX: 'hidden', overflowY: 'hidden', cursor: 'pointer' }}>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
            {/* <p>{eventInfo.event.extendedProps.description}</p> */}
        </div>
    )
  }

export default CalendarContainer


// var calendar = new Calendar(calendarEl, {
//     events: [
//       // my event data
//     ],
//     eventColor: '#378006'
//   });