import React, { useEffect, useState } from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { poll_create } from '../../requests/Polls';
import { toast } from 'react-toastify';


const PollCreationForm = ({projectId, updateShowParent}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const currentDateTime = new Date();
    
    console.log(startDate, '   ', endDate);

    const handleCreatePollClick = async () => {
        if (startDate && endDate) {
            const unaHoraEnMilisegundos = 60 * 60 * 1000;
            if (endDate.getTime() - startDate.getTime() < unaHoraEnMilisegundos) {
                toast.warn('¡La hora de termino debe ser al menos una hora después de la hora de inicio!', { autoClose: 5000, position: toast.POSITION.TOP_CENTER })
                return;
            } else {
                const newPollPayload = {
                    poll: {
                        state: 'creada',
                        start_date: `${startDate.$y}-${startDate.$M + 1}-${startDate.$D}`,
                        end_date: `${endDate.$y}-${endDate.$M + 1}-${endDate.$D}`,
                        project_id: projectId
                    }
                }
                console.log('payload: ', newPollPayload);
                try {
                    const poll_response = await poll_create(newPollPayload);
                    if (poll_response.status === 200) {
                        toast.success('La votación se creó correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                        console.log('Votación creada correctamente ... ');
                    } else {
                        toast.error('No se pudo crear la votación', { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
                    }
                } catch (error) {
                    toast.error('Error al crear votación', { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
                    console.log(error);
                }
                updateShowParent(false);
            }
            return;
        }
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
                onChange={(newValue) => {setStartDate(newValue)}}
                minDateTime={currentDateTime}
                inputFormat="dd/MM/yyyy HH:mm"
                slotProps={{
                    textField: {
                      variant: 'outlined',
                      color: 'secondary',
                      size: 'small',
                    },
                }}
            />
            <br></br>
            <br></br>
            <label htmlFor="poll-end-datetime">Fecha y hora de termino</label>
            <DateTimePicker
                label="Basic date time picker"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDateTime={startDate}
                inputFormat="dd/MM/yyyy HH:mm"
                disabled={!startDate}
                slotProps={{
                    textField: {
                      variant: 'outlined',
                      color: 'secondary',
                      size: 'small',
                    },
                }}
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