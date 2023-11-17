import React, { useContext, useEffect, useState } from 'react'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { get_resource_applications_by_neighborhood } from '../../requests/Applications';
import { UserContext } from '../../contexts/UserContext';
import { formatearFecha, initCap } from '../../utils/utils';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { get_resources_by_neighborhood_id } from '../../requests/Resources';
import { userRolsTypes } from '../../utils/data';
import * as XLSX from 'xlsx/xlsx.mjs';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

const ResourceApplication = () => {
    const { userInfo } = useContext(UserContext);
    const currentDate = new Date();
    const neighborhoodId = userInfo.neighborhood.neighborhood_id;
    const [refresh, setRefresh] = useState(false);
    const [resourcesApplicationList, setResourcesApplicationList] = useState([]);
    const [resourcesList, setResourcesList] = useState([]);

    useEffect(() => {
        getNeighborhoodResourcesApplications(neighborhoodId);
        getNeighborhoodResources(neighborhoodId);
        console.log('refreshed')
    }, [refresh])

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
            console.log(resourcesResponse.data);
            const filteredResources = resourcesResponse.data.filter(item => item.application_type === 'recurso');
            if (filteredResources) {
                const updatedResourcesApplications = filteredResources.map(application => {
                    const correspondingResource = resourcesList.find(resource => resource.id === parseInt(application.resource_id));
                    const resourceName = correspondingResource ? correspondingResource.name : 'Recurso no encontrado';
                    return {
                        ...application,
                        resourceName, // Agregar el nombre del recurso a la solicitud de recurso
                    };
                });
                console.log(updatedResourcesApplications);
                setResourcesApplicationList(updatedResourcesApplications.reverse());
            }
        }
    };

    const handleExport = () => {
        if (resourcesApplicationList) {
            const selectedColumns = resourcesApplicationList.map(({
                resourceName,
                start_use,
                end_use,
                rut,
                first_name,
                second_name,
                last_name,
                last_name_2,
                email,
                state,
                application_type,
            }) => ({
                RECURSO_PEDIDO: resourceName,
                HORA_INICIO: formatearFecha(start_use.slice(0, -1)),
                HORA_TERMINO: formatearFecha(end_use.slice(0, -1)),
                RUT: rut,
                PRIMER_NOMBRE: first_name,
                SEGUNDO_NOMBRE: second_name,
                APELLIDO_PATERNO: last_name,
                APELLIDO_MATERNO: last_name_2,
                EMAIL: email,
                ESTADO: state,
                TIPO: application_type,
            }));
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(selectedColumns);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");
            XLSX.writeFile(workbook, `ListaMiembros_${currentDate}.xlsx`);
          } else {
            console.error('No hay datos para exportar.');
          }
    };

    return (
        <>
            <div className='refresh-button-container'>
                <IconButton onClick={() => setRefresh(!refresh)} id='refresh-button'>
                    <RefreshRoundedIcon />
                </IconButton>
                {[2, 3, 4].includes(userInfo.role.role_id) ? 
                <IconButton onClick={handleExport}>
                    <DownloadRoundedIcon />
                </IconButton>
                : null }
            </div>
            <div className='polls-wrapper'>
                <div className='polls-list'>
                    <div className='poll-state-separator'>
                        <PendingActionsIcon />
                        <h2>Pendientes</h2>
                    </div>
                    <div className='polls-list-container' style={{ height: '95%', overflow: 'auto', marginRight: '5px'}}>
                        {resourcesApplicationList.filter(application => application.state === 'creada').length === 0 ? (
                            <p>No hay solicitudes</p>
                        ) : (
                            resourcesApplicationList.filter(application => application.state === 'creada').map((application, index) => (
                                <div key={index} className='application-card' onClick={() => handleOpenDialog(application)} style={{ height: 'fit-content'}}>
                                    <div className='application-card-header'>Solicitante: <strong>{initCap(application.first_name)} {initCap(application.last_name)} {initCap(application.last_name_2)}</strong></div>
                                    <div className='application-card-content'>
                                        <p>Recurso: <strong>{application.resourceName}</strong></p>
                                        <p>Rut: <strong>{application.rut}</strong></p>
                                        <p>Email: <strong>{application.email}</strong></p>
                                        <p style={{ backgroundColor: "#85abf4", width: 'fit-content', padding: '5px 15px', fontSize: '1rem', color: 'white', borderRadius: '100px'}}><strong>Día {new Date(application.start_use).toLocaleDateString('es-CL')}</strong> de <strong>{new Date(application.start_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong> a <strong>{new Date(application.end_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong></p>
                                        <p>Creada el {formatearFecha(application.created_at)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className='polls-list'>
                    <div className='poll-state-separator'>
                        <AssignmentTurnedInIcon />
                        <h2>Resueltas</h2>
                    </div>
                    <div className='polls-list-container' style={{ height: '95%', overflow: 'auto', marginRight: '5px'}}>
                        {resourcesApplicationList.filter(application => application.state !== 'creada').length === 0 ? (
                            <p>No hay solicitudes</p>
                        ) : (
                            resourcesApplicationList.filter(application => application.state !== 'creada').map((application, index) => (
                                <div key={index} className='application-card' style={{ height: 'fit-content'}}>
                                    <div className='application-card-header'>Solicitante: <strong>{initCap(application.first_name)} {initCap(application.last_name)} {initCap(application.last_name_2)}</strong></div>
                                    <div className='application-card-content'>
                                        <p>Rut: {application.rut}</p>
                                        <p>Creada el {formatearFecha(application.created_at)}</p>
                                        <p>Respondida el {formatearFecha(application.updated_at)}</p>
                                        <p>Resolución: <strong>{initCap(application.state)}</strong></p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResourceApplication