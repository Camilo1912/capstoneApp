import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { get_resources_by_neighborhood_id } from '../../requests/Resources';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import { convertirDiasANumeros } from '../../utils/utils';

const CreateResourceApplication = () => {
    // const currentDate = new Date();
    const { userInfo } = useContext(UserContext);
    const [refeshResources, setRefreshResources] = useState(true);
    const [resourcesList, setResourcesList] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
 
    useEffect(() => {
        getNeighborhoodResources(1);
    }, [refeshResources]);

    useEffect(() => {
        if (selectedResource) {

            console.log(convertirDiasANumeros(selectedResource.available_day));
        }
    }, [selectedResource]);


    const getNeighborhoodResources = async (neighborhoodId) => {
        if (neighborhoodId) {
            const resourcesResponse = await get_resources_by_neighborhood_id(neighborhoodId);
            console.log(resourcesResponse.data);
            if (resourcesResponse.data) {
                setResourcesList(resourcesResponse.data);
            }
        }
    };

    const handleResourceSelection = (e) => {
        const resourceId = e.target.value;
        const selected = resourcesList.find((resource) => resource.id === parseInt(resourceId));
        setSelectedResource(selected || null);
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
                    <select name="resource" id="resource" onClick={handleResourceSelection}>
                        <option value="*">-- Seleccione --</option>
                        {resourcesList?.map((resource) => (
                            <option value={resource.id} key={resource.id}>{resource.name} - {resource.address}</option>
                        ))}

                    </select>

                    {/* <p>{initCap(userInfo.first_name)} {initCap(userInfo.last_name)} {initCap(userInfo.last_name_2)}</p> */}
                </div>

                <div>
                    <label><strong>Descripción</strong></label>
                    <p>{selectedResource?.description}</p>
                </div>
                
                {selectedResource ? 
                
                <div>
                    <label><strong>Horarios Disponibles</strong></label>
                    <FullCalendar 
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView={'timeGridFourDay'}
                        headerToolbar={{start: 'title', center: 'timeGridFourDay,timeGridDay', end: 'today prev,next'}}
                        height={'auto'}
                        locale={esLocale}
                        nowIndicator
                        eventDisplay={'block'}
                        // events={events}
                        // eventContent={renderEventContent}
                        // dateClick={handleDateClick}
                        businessHours= {{
                            daysOfWeek: convertirDiasANumeros(selectedResource.available_day), 
                            startTime: '8:00',
                            endTime: '18:00',
                        }}
                        views={ {
                            timeGridFourDay: {
                                type: 'timeGrid',
                                duration: { days: 3 },
                                buttonText: '3 Días',
                            }
                        }}
                        selectable= {true}
                        selectMirror= {true}
                        selectOverlap={false}
                        selectConstraint={
                            {
                                daysOfWeek: convertirDiasANumeros(selectedResource.available_day),
                                startTime: '8:00',
                                endTime: '18:00',
                            }
                        }
                        validRange ={{
                            start: '2023-11-16',
                            end: '2023-11-22'
                          }}
                        />
                </div>
                :null}

                <div style={{ color: '#555555', fontSize: '.8rem'}}>
                    <p>Cualquier pago por la solicitud del recurso debe ser coordinado con el tesorero a cargo. Cuando un integrante de la directiva de tu junta de vecinos resuelva tu solicitud, recibiarás
                         un <strong>correo electronico</strong> con la respuesta a corde.</p>
                </div>
                <div className='project-creation-button-container'>
                    {/* <Button variant='contained' color='success' disabled={isSubmitDisabled} onClick={handleSubmit} endIcon={<SendRoundedIcon />}>Solicitar</Button> */}
                </div>

                
            </div>
            <div className='project-creation-info-card'>
                <h1>Sobre la creacón de actividades</h1>
                <ul>
                    <li><h2>Tipo de Actividad</h2><p>El tipo de anuncio indica si se mostrará solo una imágen (tipo afiche) o </p></li>
                </ul>
            </div>
        </div>
    )
}

export default CreateResourceApplication