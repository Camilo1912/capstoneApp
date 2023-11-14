import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { application_update, applications_get_by_neighborhood_id } from '../../requests/Applications';
import { formatearFecha, convertirFormatoFecha } from '../../utils/utils';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { initCap } from '../../utils/utils';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';

const MembershipApplication = () => {
    const { userInfo } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [refresh, setRefresh] = useState(true);
    const neighborhoodId = userInfo.neighborhood.neighborhood_id;
    const [memberApplicationList, setMemberAplicationList] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        getApplications();
    }, [refresh])

    const getApplications = async () => {
        const applicationsResponse = await applications_get_by_neighborhood_id(neighborhoodId);
        setMemberAplicationList(applicationsResponse.data);
    }

    const handleResolution = (event) => {

        if (selectedApplication) {

            const newPayload = {
                application: {
                    state: event.target.value
                }
            }
            const updateApplicationState = async () => {
                const response = await application_update(selectedApplication.id, newPayload);
                if (response.status === 200) {
                    toast.success('Actividad publicada correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                    setOpen(false);
                }
            }
            updateApplicationState();
            setRefresh(!refresh);
        }

    }

    const handleCloseDialog = () => {
        setRefresh(!refresh);
        setSelectedApplication(null);
        setOpen(false);
    };

    const handleOpenDialog = (application) => {
        setSelectedApplication(application);
        setOpen(true);
    };

    const handleAccordioChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    

    return (
        <>
            <div className='refresh-button-container'>
                <IconButton onClick={() => setRefresh(!refresh)} id='refresh-button'>
                    <RefreshRoundedIcon />
                </IconButton>
            </div>
            <div className='polls-wrapper'>
                <div className='polls-list'>
                    <div className='poll-state-separator'>
                        <PendingActionsIcon />
                        <h2>Pendientes</h2>
                    </div>
                    <div className='polls-list-container'>
                        {memberApplicationList.filter(application => application.application_type === 'registro' && application.state === 'creada').length === 0 ? (
                            <p>No hay solicitudes</p>
                        ) : (
                            memberApplicationList.filter(application => application.application_type === 'registro' && application.state === 'creada').map((application, index) => (
                                    <div key={index} className='application-card' onClick={() => handleOpenDialog(application)}>
                                        <div className='application-card-header'>Solicitante: <strong>{initCap(application.first_name)} {initCap(application.last_name)} {initCap(application.last_name_2)}</strong></div>
                                        <div className='application-card-content'>
                                            <p>Rut: {application.rut}</p>
                                            <p>Creada el {formatearFecha(application.created_at)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                    </div>

                    <div className='poll-state-separator'>
                        <AssignmentTurnedInIcon />
                        <h2>Resueltas</h2>
                    </div>
                    <div className='polls-list-container'>
                        {memberApplicationList.map((application, index) => (
                            <>
                            {application.application_type === 'registro' && memberApplicationList.length !== 0  && application.state !== 'creada'? 
                                <div key={index} className='application-card'>
                                    <div className='application-card-header'>Solicitante: <strong>{initCap(application.first_name)} {initCap(application.last_name)} {initCap(application.last_name_2)}</strong></div>
                                    <div className='application-card-content'>
                                        <p>Rut: {application.rut}</p>
                                        <p>Creada el {formatearFecha(application.created_at)}</p>
                                        <p>Respondida el {formatearFecha(application.updated_at)}</p>
                                        <p>Resolución: <strong>{initCap(application.state)}</strong></p>
                                    </div>
                                </div>
                            :null}</>
                        ))}
                        {memberApplicationList.length === 0 ? <p>No hay solicitudes</p> : null}
                    </div>
                </div>
                <div className='poll-info-card'>
                <h1>Sobre las solicitudes de ingreso</h1>
                    <ul>
                        <li><h2>Solicitudes PENDIENTES</h2><p> ..... votado o no.</p></li>
                        
                    </ul>
                </div>
                <Dialog open={open} onClose={handleCloseDialog}>
                    <DialogContent>
                        {selectedApplication ? 
                        <div className='application-info-container'>
                            <h1>Solicitud de incripción</h1>
                            <p className='date-value'>Creada el {formatearFecha(selectedApplication.created_at)}</p>
                            <p>Solicitante: <strong>{initCap(selectedApplication.first_name)} {initCap(selectedApplication.last_name)} {initCap(selectedApplication.last_name_2)}</strong></p>
                            <p>Rut: <strong>{selectedApplication.rut}</strong></p>
                            <p>Fecha de nacimiento: <strong>{convertirFormatoFecha(selectedApplication.birth_date)}</strong></p>
                            <p>Genero: <strong>{selectedApplication.gender}</strong></p>
                            <p>Email: <strong>{selectedApplication.email}</strong></p>
                            <p>Dirección:  <strong>{selectedApplication.street_address} {selectedApplication.number_address}</strong></p>
                            
                            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordioChange('panel1')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >Foto de carnet parte frontal</AccordionSummary>
                                <AccordionDetails>
                                    <img width={'100%'} src={selectedApplication.image_url_1} alt="" />
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={expanded === 'panel2'} onChange={handleAccordioChange('panel2')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >Foto de carnet parte posterior</AccordionSummary>
                                <AccordionDetails>
                                    <img width={'100%'} src={selectedApplication.image_url_2} alt="" />
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={expanded === 'panel3'} onChange={handleAccordioChange('panel3')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >Foto de Rostro</AccordionSummary>
                                <AccordionDetails>
                                    <img width={'100%'} src={selectedApplication.image_url_3} alt="" />
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={expanded === 'panel4'} onChange={handleAccordioChange('panel4')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >Foto de cuenta o contrato de arriendo</AccordionSummary>
                                <AccordionDetails>
                                    <img width={'100%'} src={selectedApplication.image_url_4} alt="" />
                                </AccordionDetails>
                            </Accordion>

                        </div> 
                        : null}
                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' color='error' value='rechazada' onClick={handleResolution} startIcon={<CancelRoundedIcon />}>Rechazar</Button>
                        <Button variant='contained' color='success' value='aceptada' onClick={handleResolution} startIcon={<CheckCircleRoundedIcon />}>Aceptar</Button>
                        <Button onClick={handleCloseDialog}>Cerrar</Button>
                    </DialogActions>
                </Dialog>
            </div>
            
        </>
    )
    
}

export default MembershipApplication