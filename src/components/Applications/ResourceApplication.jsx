import React, { useContext, useEffect, useState } from 'react'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { get_resource_applications_by_neighborhood, resolve_rsource_application } from '../../requests/Applications';
import { UserContext } from '../../contexts/UserContext';
import { formatearFecha, initCap } from '../../utils/utils';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { get_resources_by_neighborhood_id } from '../../requests/Resources';
import { userRolsTypes } from '../../utils/data';
import * as XLSX from 'xlsx/xlsx.mjs';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { toast } from 'react-toastify';

const ResourceApplication = () => {
    const { userInfo } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const currentDate = new Date();
    const neighborhoodId = userInfo.neighborhood.neighborhood_id;
    const [refresh, setRefresh] = useState(false);
    const [resourcesApplicationList, setResourcesApplicationList] = useState([]);
    const [resourcesList, setResourcesList] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const [showRejectMessage, setShowRejectMessage] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        getNeighborhoodResources(neighborhoodId);
    }, [refresh])

    useEffect(() => {
        getNeighborhoodResourcesApplications(neighborhoodId);
    }, [resourcesList])

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
                const updatedResourcesApplications = filteredResources.map(application => {
                    const correspondingResource = resourcesList.find(resource => resource.id === parseInt(application.resource_id));
                    const resourceName = correspondingResource ? correspondingResource.name : 'Recurso no encontrado';
                    const resourceDesc = correspondingResource ? correspondingResource.description : 'Recurso no encontrado';
                    return {
                        ...application,
                        resourceName,
                        resourceDesc
                    };
                });
                setResourcesApplicationList(updatedResourcesApplications.reverse());
            }
        }
    };


    const handleResolution = (event) => {
        const resolution = event.target.value;
        if (selectedApplication) {
            if (resolution === 'aceptada' || resolution === 'rechazada') {

                const updateApplicationState = async () => {
                    const payload = {
                        application: {
                            state: resolution,
                            message: rejectionReason
                        }
                    }
                    const response = await resolve_rsource_application(selectedApplication.id, payload);
                    if (response.status === 200) {
                        toast.success('Solicitud Resuelta', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                        setOpen(false);
                        setShowRejectMessage(false);
                        setRefresh(!refresh);
                        setShowRejectMessage(false);
                    }
                    setRefresh(!refresh);
                }
                updateApplicationState();
                setRejectionReason('');
                setRefresh(!refresh);
            } else {
                setShowRejectMessage(true);
            }
        }

    }


    const handleOpenDialog = (application) => {
        setOpen(true);
        setSelectedApplication(application)
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedApplication(null);
        setShowRejectMessage(false);
    }

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
                                        <p>Creada el {formatearFecha(application.created_at)}</p>
                                        <p style={{ backgroundColor: "#85abf4", width: 'fit-content', padding: '5px 15px', fontSize: '1rem', color: 'white', borderRadius: '100px'}}><strong>Día {new Date(application.start_use).toLocaleDateString('es-CL')}</strong> de <strong>{new Date(application.start_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong> a <strong>{new Date(application.end_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong></p>
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
                                        <p>Recurso: <strong>{application.resourceName}</strong></p>
                                        <p>Resolución: <strong>{initCap(application.state)}</strong></p>
                                        <p>Rut: {application.rut}</p>
                                        <p>Creada el {formatearFecha(application.created_at)}</p>
                                        <p>Respondida el {formatearFecha(application.updated_at)}</p>
                                        <strong>Solicito para el día</strong>
                                        {application.state === 'rechazada' ?
                                        <p style={{ backgroundColor: "#e01b24", width: 'fit-content', padding: '5px 15px', fontSize: '1rem', color: 'white', borderRadius: '100px'}}><strong>Día {new Date(application.start_use).toLocaleDateString('es-CL')}</strong> de <strong>{new Date(application.start_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong> a <strong>{new Date(application.end_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong></p>
                                        : <>
                                            <p  style={{ backgroundColor: "#32ce79", width: 'fit-content', padding: '5px 15px', fontSize: '1rem', color: 'white', borderRadius: '100px'}}><strong>Día {new Date(application.start_use).toLocaleDateString('es-CL')}</strong> de <strong>{new Date(application.start_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong> a <strong>{new Date(application.end_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong></p>
                                        </>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={open} maxWidth={'md'} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedApplication ? 
                    <>
                    Solicitud de Recurso
                    <p className='date-value'>Creada el {formatearFecha(selectedApplication.created_at)}</p>
                    </>
                    :null }
                </DialogTitle>
                <DialogContent>
                    {selectedApplication ? 
                        <>
                        <p><strong>Recurso solicitado</strong></p>
                        <p>{selectedApplication.resourceName}</p>
                        <br />
                        <p><strong>Descripción de recurso</strong></p>
                        <p>{selectedApplication.resourceDesc}</p>
                        <br />
                        <div><strong>Solicitante</strong></div>
                        <p>{initCap(selectedApplication.first_name)} {initCap(selectedApplication.last_name)} {initCap(selectedApplication.last_name_2)}</p>
                        <br />
                        <p><strong>Rut</strong></p>
                        <p>{selectedApplication.rut}</p>
                        <br />
                        <p><strong>Solicita para el día</strong></p>
                        <p style={{ backgroundColor: "#85abf4", width: 'fit-content', padding: '5px 15px', fontSize: '1rem', color: 'white', borderRadius: '100px'}}><strong>Día {new Date(selectedApplication.start_use).toLocaleDateString('es-CL')}</strong> de <strong>{new Date(selectedApplication.start_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong> a <strong>{new Date(selectedApplication.end_use).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong></p>

                        <br />

                        {showRejectMessage ? 
                            <div className='reject-prompt-message-container'>
                                <label htmlFor="motivo-rechazo"><strong>Motivo de Rechazo</strong></label>
                                <p>Indique de forma clara el motivo del rechazo de la solicutud. Este mensaje será envíado via email al usuario que realizó la petición.</p>
                                <textarea
                                    type="text"
                                    id="motivo-rechazo"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                <div>
                                    <Button size='small' startIcon={<CloseRoundedIcon />} onClick={() => (setShowRejectMessage(false), setRejectionReason(''))}>Cancelar</Button>
                                    <Button size='small' value='rechazada' variant='contained' onClick={handleResolution} color='error' >Confirmar rechazo</Button>
                                </div>
                            </div>
                        : null}
                        </>
                    :null}
                </DialogContent>

                <DialogActions>
                    {showRejectMessage ? 
                        null
                        : 
                        <>
                            <Button variant='contained' color='error' value='rejectMessage' onClick={() => (setShowRejectMessage(true))} startIcon={<CancelRoundedIcon />}>Rechazar</Button>
                            <Button variant='contained' color='success' value='aceptada' onClick={handleResolution} startIcon={<CheckCircleRoundedIcon />}>Aceptar</Button>
                        </>
                    }
                    <Button variant='outlined' onClick={handleCloseDialog}>cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ResourceApplication