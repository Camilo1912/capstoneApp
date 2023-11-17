import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { get_resources_by_neighborhood_id } from '../../requests/Resources';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import { convertirDiasANumeros } from '../../utils/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { DialogTitle } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { addDays, startOfTomorrow, format } from 'date-fns';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { application_resource_create, applications_get_by_neighborhood_id, get_resource_applications_by_neighborhood } from '../../requests/Applications';


const CreateResourceApplication = () => {
    const defaultTimeSpan = {
        startTime: '',
        endTime: '',
    }
    const today = new Date();
    const tomorrow = startOfTomorrow();
    const maxEndDate = addDays(tomorrow, 14); 
    const [open, setOpen] = useState(false);
    const { userInfo } = useContext(UserContext);
    const [refeshResources, setRefreshResources] = useState(true);
    const [resourcesList, setResourcesList] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedTimeSpan, setSelectedTimeSpan] = useState(defaultTimeSpan);
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [existingApplicationsList, setExistingApplictionsList] = useState([]);
    const [eventsList, setEventsList] = useState([]);
 
    useEffect(() => {
        getNeighborhoodResources(userInfo.neighborhood.neighborhood_id);
        getNeighborhoodResourcesApplications(userInfo.neighborhood.neighborhood_id)
    }, [refeshResources]);

    useEffect(() => {
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

    useEffect(() => {
        if (selectedTimeSpan.endTime && selectedTimeSpan.startTime) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [selectedTimeSpan])


    const getNeighborhoodResources = async (neighborhoodId) => {
        if (neighborhoodId) {
            const resourcesResponse = await get_resources_by_neighborhood_id(neighborhoodId);
            if (resourcesResponse.data) {
                setResourcesList(resourcesResponse.data);
            }
        }
    };

    const getNeighborhoodResourcesApplications = async (neighborhoodId) => {
        if (neighborhoodId) {
            const resourcesResponse = await get_resource_applications_by_neighborhood(neighborhoodId);
            const filteredResources = resourcesResponse.data.filter(item => item.application_type === 'recurso');
            if (filteredResources) {
                setExistingApplictionsList(filteredResources);
            }
        }
    };

    const handleResourceSelection = (e) => {
        const resourceId = e.target.value;
        const selected = resourcesList.find((resource) => resource.id === parseInt(resourceId));
        setSelectedResource(selected || null);
    };


    const handleSelect = (selectInfo) => {
        const { startStr, endStr } = selectInfo;
        setSelectedTimeSpan({
            startTime: startStr,
            endTime: endStr,
        });
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedTimeSpan(defaultTimeSpan);
        setEventsList([]);
    };
    
    const handleOpenDialog = () => {
        setSelectedTimeSpan(defaultTimeSpan);
        setOpen(true);
    };

    const handleConfirmSelection = () => {
        setOpen(false);
    };

    const handleSelectAllow = (selectInfo) => {
        const { startStr, endStr } = selectInfo;
        const startTime = new Date(startStr);
        const endTime = new Date(endStr);
        const durationInHours = (endTime - startTime) / (60 * 60 * 1000);
        if (!(durationInHours <= selectedResource.max_time)) {
            setSelectedTimeSpan(defaultTimeSpan);
            setIsConfirmButtonDisabled(true);
        } else {

            setIsConfirmButtonDisabled(false);
        }
        return durationInHours <= selectedResource.max_time;
    };

    const handleSubmit = async () => {
        if (selectedTimeSpan.endTime && selectedTimeSpan.startTime) {
            const payload = {
                application: {
                    start_use: selectedTimeSpan.startTime,
                    end_use: selectedTimeSpan.endTime,
                    resource_id: selectedResource.id,
                    neighborhood_id: userInfo.neighborhood.neighborhood_id
                }
            }

            console.log(payload);

            const response = await application_resource_create(userInfo.id, payload);
            if (response.status === 200 || response.status === 201) {
                toast.success('Solicitud enviada correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                setSelectedResource(null);
                setRefreshResources(!refeshResources);
                setSelectedTimeSpan(defaultTimeSpan);
            }
        }
    };

    return (
        <div className='project-creation-layout'>
            <div className='create-project-card'>

                <h1>Solicitud de Recursos e Implementos</h1>
                {/* <div>
                    <p>La solicitud de certificado de residencia se generará con los siguientes datos. En caso de haber 
                    cambiado de dirección, por favor, realice primero la <strong>solicitud de cambio de dirección</strong> o <strong>solicitud
                     de cambio de junta</strong> según corresponda.</p>
                </div> */}
                <div>
                    <label><strong>Seleccione Recurso o Implemento</strong></label>
                    <select name="resource" id="resource" onClick={handleResourceSelection} value={selectedResource ? selectedResource.id : ''}
                    >
                        <option value="*">-- Seleccione --</option>
                        {resourcesList?.map((resource) => (
                            <option value={resource.id} key={resource.id}>{resource.name} - {resource.address}</option>
                        ))}

                    </select>

                    {/* <p>{initCap(userInfo.first_name)} {initCap(userInfo.last_name)} {initCap(userInfo.last_name_2)}</p> */}
                </div>

                {selectedResource ? 
                    <>
                        <div>
                            <label><strong>Descripción</strong></label>
                            <p>{selectedResource?.description}</p>
                        </div>
                        <div>
                            <label><strong>Reglamento</strong></label>
                            <p>{selectedResource?.comment}</p>
                        </div>
                        <div>
                            <label><strong>Cuota Solidaria</strong></label>
                            <p>{parseFloat(selectedResource?.cost).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} pesos</p>
                        </div>
                        <div style={{ color: '#555555', fontSize: '.8rem'}}>
                            <p>Cualquier pago por la solicitud del recurso debe ser coordinado con el tesorero a cargo. Cuando un integrante de la directiva de tu junta de vecinos resuelva tu solicitud, recibiarás
                            un <strong>correo electronico</strong> con la respuesta a corde.</p>
                        </div>
                        <div>   
                            <label><strong>Seleccione Horario</strong></label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                                <div className='project-creation-button-container' style={{ alignItems: 'start'}}>
                                    <Button onClick={handleOpenDialog} variant='outlined'>Ver horarios</Button>
                                </div>
                                {selectedTimeSpan.endTime && selectedTimeSpan.startTime ? 
                                <p style={{ backgroundColor: "#85abf4", width: 'fit-content', padding: '5px 15px', fontSize: '1.2rem', color: 'white', borderRadius: '100px'}}><strong>Día {new Date(selectedTimeSpan.startTime).toLocaleDateString('es-CL')}</strong> de <strong>{new Date(selectedTimeSpan.startTime).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong> a <strong>{new Date(selectedTimeSpan.endTime).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong></p>
                                :null}
                            </div>
                        </div>
                        
                        
                    </>
                : null}
                
                <div className='project-creation-button-container'>
                    <Button variant='contained' color='success' disabled={isSubmitDisabled} onClick={handleSubmit} endIcon={<SendRoundedIcon />}>Solicitar</Button>
                </div>
                
                
            </div>
            <div className='project-creation-info-card'>
                <h1>Sobre la creacón de actividades</h1>
                <ul>
                    <li><h2>Tipo de Actividad</h2><p>El tipo de anuncio indica si se mostrará solo una imágen (tipo afiche) o </p></li>
                </ul>
            </div>

            <Dialog open={open} maxWidth={'md'} onClose={handleCloseDialog}>
                <DialogTitle>
                    Horarios Disponibles
                    <p style={{ fontSize:"1rem"}}><strong>Tiempo maximo: {selectedResource?.max_time}h</strong></p>
                    <p style={{ fontSize:"1rem"}}><strong>Tiempo mínimo: {selectedResource?.min_time}h</strong></p>
                </DialogTitle>
                <DialogContent>
                {selectedResource ? 
                <>
                    <FullCalendar 
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView={'timeGridFourDay'}
                        headerToolbar={{start: 'title', center: 'timeGridFourDay,timeGridDay', end: 'today prev,next'}}
                        height={'auto'}
                        locale={esLocale}
                        nowIndicator
                        eventDisplay={'block'}
                        events={eventsList}
                        eventContent={renderEventContent}
                        // dateClick={handleDateClick}
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
                        selectable= {true}
                        selectMirror= {true}
                        selectOverlap={false}
                        selectConstraint={
                            {
                                daysOfWeek: convertirDiasANumeros(selectedResource.available_day),
                                startTime: selectedResource.start_time,
                                endTime: selectedResource.end_time,
                                // duration: { hours: selectedResource.max_time }
                            }
                        }
                        validRange ={{
                            start: format(tomorrow, 'yyyy-MM-dd'),
                            end: format(maxEndDate, 'yyyy-MM-dd')
                          }}
                        select={handleSelect}
                        selectAllow={handleSelectAllow}
                    />
                </>
                :null}
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleCloseDialog}>Cancelar</Button>
                    <Button variant='contained' onClick={handleConfirmSelection} disabled={isConfirmButtonDisabled} startIcon={<CheckCircleRoundedIcon />}>Confirmar Selección</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const renderEventContent = (eventInfo) => {

    const eventStyle = {
        backgroundColor: eventInfo.event.id ? '#FF0000' : '#00FF00', // Rojo para existentes, verde para en creación
        color: '#FFFFFF', // Color del texto
        borderRadius: '3px',
        padding: '5px',
        cursor: 'pointer',
    };
    
    if (eventInfo.event.id) {
        return (
            <div >
                <strong>{eventInfo.timeText}</strong>
                <p>No disponible</p>
            </div>
        );
    } else {
        // Evento en modo de creación, no mostrar mensaje "No disponible"
        return (
            <div>
                <strong>{eventInfo.timeText}</strong>
            </div>
        );
    }
};

export default CreateResourceApplication