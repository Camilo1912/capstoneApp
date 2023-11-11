import React, { useEffect, useState } from 'react'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { poll_create } from '../../requests/Polls';
import { toast } from 'react-toastify';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { DialogActions } from '@mui/material';

const PollCreationForm = ({projectId, updateShowParent, isParentOpen}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const currentDateTime = new Date();

    const handleCreatePollClick = async () => {
        if (startDate && endDate) {
            const unaHoraEnMilisegundos = 60 * 60 * 1000;
            if (endDate.getDate() === startDate.getDate() && endDate.getTime() - startDate.getTime() < unaHoraEnMilisegundos) {
                toast.warn('¡La hora de termino debe ser al menos una hora después de la hora de inicio!', { autoClose: 5000, position: toast.POSITION.TOP_CENTER })
                return;
            } else {
                const newPollPayload = {
                    poll: {
                        // state: 'creada',
                        start_date: `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}T${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
                        end_date: `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}T${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
                        project_id: projectId
                    }
                }
                try {
                    const poll_response = await poll_create(newPollPayload);
                    if (poll_response.status === 200) {
                        toast.success('La votación se creó correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                        isParentOpen(false);
                    }
                } catch (error) {
                    if (error.response.status === 422) {
                        toast.error('Error al crear votación. ¡Es posible que ya exista para este proyecto!', { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
                    }
                }
                updateShowParent(false);
            }
            return;
        }
    };

    const handleClosePollClick = () => {
        setEndDate(null);
        setStartDate(null);
        updateShowParent(false);
        
    };

    return (
        <div>
            <h1>Iniciar votación</h1>
            <p>Para iniciar una votación se requieren fechas de inicio y de termino. Una vez creada, esta será visible y permitirá realizar votaciones a los integrantes de su junta de vecinos durante el horario indicado.</p>
            <br></br>
            <label htmlFor="poll-start-datetime">Fecha y hora de inicio</label>
            <DateTimePicker
                label="Fecha y hora de Inicio"
                value={startDate}
                onChange={(newValue) => {setStartDate(newValue)}}
                minDateTime={currentDateTime}
                inputFormat="dd/mm/yyyy HH:mm"
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
                label="Fecha y hora de Termino"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDateTime={startDate}
                inputFormat="dd/mm/yyyy HH:mm"
                disabled={!startDate}
                slotProps={{
                    textField: {
                      variant: 'outlined',
                      color: 'secondary',
                      size: 'small',
                    },
                }}
            />
            <DialogActions>
                <Button
                    onClick={handleClosePollClick}
                    variant='outlined'
                    disableElevation
                    startIcon={<ArrowBackRoundedIcon />}>
                    volver
                </Button>
                <Button
                    onClick={handleCreatePollClick}
                    color='success'
                    variant='contained'
                    disableElevation
                    disabled={!startDate && !endDate}
                    startIcon={<CheckRoundedIcon />}>
                    Crear
                </Button>
            </DialogActions>
            
        </div>
    )
}

export default PollCreationForm