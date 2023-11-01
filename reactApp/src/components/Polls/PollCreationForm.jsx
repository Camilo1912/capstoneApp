import React, { useState } from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { poll_create } from '../../requests/Polls';
import { toast } from 'react-toastify';


const PollCreationForm = ({projectId, updateShowParent}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const currentDate = new Date();

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (date) {
            const endDate = new Date(date);
            endDate.setHours(date.getHours() + 1);
            setEndDate(endDate);
        } else {
            setEndDate(null);
        }
        console.log(startDate, endDate);
    };

    const handleCreatePollClick = async () => {
        const newPollPayload = {
            poll: {
                state: 'creada',
                start_date: `${startDate.$y}-${startDate.$M}-${startDate.$D}`,
                end_date: `${endDate.$y}-${endDate.$M}-${endDate.$D}`,
                project_id: projectId
            }
        }
        
        try {
            const poll_response = await poll_create(newPollPayload);
            if (poll_response.status === 200) {
                toast.success('La votación se creó correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                console.log('Votación creada correctamente ... ');
            } else {
                toast.error('Error al crear votación', { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
            }
        } catch (error) {
            toast.error('Error al crear votación', { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
            console.log(error);
        }
        
        updateShowParent(false);
    };

    return (
        <div>
            <h1>Iniciar votación</h1>
            <p>Para iniciar una votación se requieren fechas de inicio y de termino. Una vez creada, esta será visible y permitirá realizar votaciones a los integrantes de su junta de vecinos durante el horario indicado.</p>
            <br></br>
            <label htmlFor="poll-start-datetime">Fecha y hora de inicio</label>
            <DateTimePicker
            label="Basic date time picker"
            value={startDate}
            onChange={handleStartDateChange}
            inputFormat="dd/MM/yyyy HH:mm"
            />
            <br></br>
            <br></br>
            <label htmlFor="poll-end-datetime">Fecha y hora de termino</label>
            <DateTimePicker
            label="Basic date time picker"
            value={endDate}
            minDate={startDate} 
            onChange={(date) => setEndDate(date)}
            disabled={!startDate}
            inputFormat="dd/MM/yyyy HH:mm"
            />

            <Button
            onClick={handleCreatePollClick}
            color='success'
            variant='contained'
            disableElevation
            startIcon={<CheckRoundedIcon />}>
                Crear
            </Button>
        </div>
    )
}

export default PollCreationForm