import React, { useContext, useEffect, useState } from 'react'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { UserContext } from '../../contexts/UserContext';
import { get_resources_by_neighborhood_id, submit_resource } from '../../requests/Resources';
import { convertirDiasATexto, formatearFecha, initCap } from '../../utils/utils';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel } from '@mui/material';
import Divider from '@mui/material/Divider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import { convertirDiasANumeros } from '../../utils/utils';
import { addDays, startOfTomorrow, format } from 'date-fns';
import { get_resource_applications_by_neighborhood } from '../../requests/Applications';


const OurResources = () => {
    const defaultResource = {
        name: '',
        available_day: '',
        description: '',
        comment: '',
        cost: null,
        max_time: null,
        address: ''
    }
    const currentDay = new Date();
    const tomorrow = startOfTomorrow();
    const maxEndDate = addDays(tomorrow, 14); 
    const [open, setOpen] = useState(false);
    const { userInfo } = useContext(UserContext);
    const [refresh, setRefresh] = useState(true);
    const [resourcesList, setResourcesList] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
    const [newResource, setNewResource] = useState(defaultResource);
    const [diasSeleccionados, setDiasSeleccionados] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [hasCuota, setHasCuota] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [eventsList, setEventsList] = useState([]);
    const [existingApplicationsList, setExistingApplictionsList] = useState([]);
 

    useEffect(() => {
        getNeighborhoodResources();
        setSelectedResource(null);
        setNewResource(defaultResource);
        setStartTime(null);
        setEndTime(null);
        setDiasSeleccionados([]);
        setHasCuota(false);

    }, [refresh]);

    useEffect(() => {
        getNeighborhoodResourcesApplications(userInfo.neighborhood.neighborhood_id);
        if (selectedResource) {
            const eventosFiltrados = existingApplicationsList.filter((evento) => (evento.state !== 'rechazada' && parseInt(evento.resource_id) === selectedResource.id));
            const listadoFinal = eventosFiltrados.map((evento) => ({
                id: evento.id,
                start: evento.start_use,
                end: evento.end_use,
            }));
            setEventsList(listadoFinal);
        } else {
            setEventsList([])
        }
    }, [selectedResource]);

    const getNeighborhoodResourcesApplications = async (neighborhoodId) => {
        if (neighborhoodId) {
            const resourcesResponse = await get_resource_applications_by_neighborhood(neighborhoodId);
            const filteredResources = resourcesResponse.data.filter(item => item.application_type === 'recurso');
            if (filteredResources) {
                setExistingApplictionsList(filteredResources);
            }
        }
    };

    useEffect(() => {
        if (newResource.name  && newResource.description && newResource.comment && newResource.max_time && startTime && endTime && diasSeleccionados.length > 0 && newResource.address && startTime < endTime) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [newResource][diasSeleccionados]);
    

    const getNeighborhoodResources = async() => {
        if (userInfo.neighborhood.neighborhood_id) {
            const response = await get_resources_by_neighborhood_id(userInfo.neighborhood.neighborhood_id);
            setResourcesList(response.data);
            console.log(response.data);
        }
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setNewResource(defaultResource);
        setDiasSeleccionados([]);
        setHasCuota(false);
    };
    
    const handleOpenDialog = (item) => {
        setOpen(true);
        setSelectedResource(item)
    };

    const handleInputChange = (event) => {
        setNewResource({
            ...newResource,
            [event.target.name]: event.target.value,
        });
    };

    const handleCheckboxChange = (dia) => {
        if (diasSeleccionados.includes(dia)) {
            setDiasSeleccionados(diasSeleccionados.filter(d => d !== dia));
        } else {
            setDiasSeleccionados([...diasSeleccionados, dia]);
        }
    }

    const handleStartTimeChange = (timeSelection) => {
        setStartTime(timeSelection);
        setEndTime(null);
    };

    const handleEndTimeChange = (timeSelection) => {
        setEndTime(timeSelection);
    };

    const handleSubmit = async () => {
        setIsSubmitDisabled(true);
        if (newResource.name  && newResource.description && newResource.comment && newResource.max_time && startTime && endTime && diasSeleccionados.length > 0 && newResource.address) {
            const formattedStartTime = startTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
            const formattedEndTime = endTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
            const intMaxTime = parseInt(newResource.max_time);
            const intCost = parseInt(newResource.cost);
            const stringDays = diasSeleccionados.join(',');
            if (startTime < endTime) {
                setNewResource({
                    ...newResource,
                    available_day: stringDays,
                    start_time: formattedStartTime,
                    end_time: formattedEndTime,
                    max_time: intMaxTime,
                    cost: intCost,
                    min_time: 0,
                    neighborhood_id: userInfo.neighborhood.neighborhood_id,
                })
                const payload = {
                    'resource': {
                        ...newResource,
                    }
                }

                console.log(payload);
                try {

                    const submitResponse = await submit_resource(payload);
                    if (submitResponse.status === 200) {
                        console.log(submitResponse.data);
                        toast.success('El recurso se creó correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                        setRefresh(!refresh)
                    }
                } catch (error) {
                    toast.success('No se pudo crear el recurso', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                }
            }
        }
    };

    

    return (
        <>
            <div className='refresh-button-container'>
                <IconButton  id='add-button'>
                    <AddCircleRoundedIcon onClick={handleOpenDialog} />
                </IconButton>
                <IconButton onClick={() => setRefresh(!refresh)} id='refresh-button'>
                    <RefreshRoundedIcon />
                </IconButton>
            </div>
            <div className='polls-wrapper'>
                <div className='polls-list'>
                    <div className='poll-state-separator'>
                        <CategoryRoundedIcon />
                        <h2>Todos</h2>
                    </div>
                    <div className='polls-list-container'>

                        {resourcesList.map((resource, index) => (
                            <div key={index} className='application-card' onClick={() => handleOpenDialog(resource)}>
                                <div className='application-card-header'><strong>{initCap(resource.name)}</strong></div>
                                <div className='application-card-content'>
                                    <p>Horario de <strong>{resource.start_time}</strong> a <strong>{resource.end_time}</strong></p>
                                    <p>Días disponibles: <strong>{convertirDiasATexto(resource.available_day)}</strong></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Dialog open={open} maxWidth={'md'} onClose={handleCloseDialog}>
                {selectedResource?.id ? 
                    <>
                        <DialogTitle>
                            {selectedResource.name}
                            <p className='date-value'>Creado el {formatearFecha(selectedResource.created_at)}</p>
                        </DialogTitle>
                        <DialogContent>
                            <div>
                                <label><strong>Descripción</strong></label>
                                <p>{selectedResource?.description}</p>
                            </div>
                            <br />
                            <div>
                                <label><strong>Reglamento</strong></label>
                                <p>{selectedResource?.comment}</p>
                            </div>
                            <br />
                            <div>
                                <label><strong>Horarios de disponibilidad</strong></label>
                                <p>{selectedResource.start_time} a {selectedResource.end_time}</p>
                            </div>
                            <br />
                            <div>
                                <label><strong>Días disponible</strong></label>
                                <p>{convertirDiasATexto(selectedResource?.available_day)}</p>
                            </div>
                            <br />
                            <div>
                                <label><strong>Cuota Solidaria</strong></label>
                                <p>{parseFloat(selectedResource?.cost).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} pesos</p>
                            </div>

                            <FullCalendar 
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView={'timeGridFourDay'}
                                headerToolbar={{start: 'title', center: 'timeGridFourDay,timeGridDay', end: 'today prev,next'}}
                                height={'auto'}
                                locale={esLocale}
                                nowIndicator
                                eventDisplay={'block'}
                                events={eventsList}
                                // eventContent={renderEventContent}
                                businessHours= {{
                                    daysOfWeek: convertirDiasANumeros(selectedResource.available_day), 
                                    startTime: selectedResource.start_time,
                                    endTime: selectedResource.end_time,
                                }}
                                views={ {
                                    timeGridFourDay: {
                                        type: 'timeGrid',
                                        duration: { days: 5 },
                                        buttonText: '5 Días',
                                    }
                                }}
                                // selectable= {true}
                                selectMirror= {true}
                                selectOverlap={false}
                                selectConstraint={
                                    {
                                        daysOfWeek: convertirDiasANumeros(selectedResource.available_day),
                                        startTime: selectedResource.start_time,
                                        endTime: selectedResource.end_time,
                                    }
                                }
                                validRange ={{
                                    start: format(currentDay, 'yyyy-MM-dd'),
                                    end: format(maxEndDate, 'yyyy-MM-dd')
                                }}
                                // select={handleSelect}
                                // selectAllow={handleSelectAllow}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button variant='outlined' onClick={handleCloseDialog}>cerrar</Button>
                        </DialogActions>
                    </>
                : <>
                    <DialogTitle>
                        Formulario de creación de Implemento
                    </DialogTitle>
                    <DialogContent>
                        <label><strong>Nombre de Recurso *</strong></label>
                        <div>
                            <input type="text" name="name" value={newResource.name} maxLength={200} onChange={handleInputChange} style={{width: '100%'}}/>
                        </div>
                        <br />
                        <label><strong>Descripción</strong></label>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
                            <textarea 
                                className='custom-text-area'
                                name='description'
                                placeholder='Escriba aquí ...'
                                style={{ width: '100%', height: '100px'}}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <br />
                        <label><strong>Dirección *</strong></label>
                        <div>
                            <input type="text" name="address" value={newResource.address} maxLength={500} onChange={handleInputChange} style={{width: '100%'}} />
                        </div>
                        <br />
                        <label><strong>Días disponible</strong></label>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
                            <FormControlLabel control={<Checkbox checked={diasSeleccionados.includes('l')} onChange={() => handleCheckboxChange('l')}/>} label='Lu' />
                            <Divider orientation='vertical' variant="middle" flexItem></Divider>
                            <FormControlLabel control={<Checkbox checked={diasSeleccionados.includes('m')} onChange={() => handleCheckboxChange('m')}/>} label='Ma' />
                            <Divider orientation='vertical' variant="middle" flexItem></Divider>
                            <FormControlLabel control={<Checkbox checked={diasSeleccionados.includes('x')} onChange={() => handleCheckboxChange('x')}/>} label='Mi' />
                            <Divider orientation='vertical' variant="middle" flexItem></Divider>
                            <FormControlLabel control={<Checkbox checked={diasSeleccionados.includes('j')} onChange={() => handleCheckboxChange('j')}/>} label='Ju' />
                            <Divider orientation='vertical' variant="middle" flexItem></Divider>
                            <FormControlLabel control={<Checkbox checked={diasSeleccionados.includes('v')} onChange={() => handleCheckboxChange('v')}/>} label='Vi' />
                            <Divider orientation='vertical' variant="middle" flexItem></Divider>
                            <FormControlLabel control={<Checkbox checked={diasSeleccionados.includes('s')} onChange={() => handleCheckboxChange('s')}/>} label='Sa' />
                            <Divider orientation='vertical' variant="middle" flexItem></Divider>
                            <FormControlLabel control={<Checkbox checked={diasSeleccionados.includes('d')} onChange={() => handleCheckboxChange('d')}/>} label='Do' />
                        </div>
                        <br />
                        <label><strong>Hora de Inicio y Fin *</strong></label>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>

                            
                            <TimePicker 
                                ampm={false}
                                onChange={handleStartTimeChange}
                                slotProps={{
                                    textField: {
                                        variant: 'outlined',
                                        color: 'secondary',
                                        size: 'small',
                                    },
                                }}
                            />
                            hasta
                            <TimePicker 
                                ampm={false}
                                onChange={handleEndTimeChange}
                                minTime={startTime}
                                disabled={startTime ? false : true}
                                slotProps={{
                                    textField: {
                                        variant: 'outlined',
                                        color: 'secondary',
                                        size: 'small',
                                    },
                                }}
                            />
                        </div>
                        <br />
                        <label><strong>Maximo de horas *</strong></label>
                        <br />
                        <select
                            name='max_time'
                            style={{ width: '100px' }}
                            value={newResource.max_time} // Asegúrate de asociar el valor con el estado de tu componente
                            onChange={handleInputChange}
                        >
                            {[...Array(25).keys()].map((hour) => (
                                <option key={hour} value={hour}>
                                    {hour}
                                </option>
                            ))}
                        </select>h
                        <br />
                        <br />
                        <label><strong>Reglas, procedimientos y sanciones</strong></label>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
                            <textarea 
                                className='custom-text-area'
                                name='comment'
                                placeholder='Escriba aquí ...'
                                style={{ width: '100%' , height: '100px'}}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <br />
                        <FormControlLabel control={<Checkbox checked={hasCuota}/>} onChange={() => (setHasCuota(!hasCuota))} label='Agregar Valor' />
                        <input 
                            type="number" 
                            disabled={!hasCuota}
                            name='cost'
                            style={{ width: '150px' }}
                            onKeyDown={(e) => {
                                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={handleInputChange}
                        /> Pesos Chilenos
                        <br />

                        
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={handleCloseDialog}>cerrar</Button>
                        <Button variant='contained' disabled={isSubmitDisabled} startIcon={<CheckCircleIcon />}color='success' onClick={handleSubmit}>Crear Recurso</Button>
                    </DialogActions>
                </>}


            </Dialog>
        </>
    )
}

export default OurResources