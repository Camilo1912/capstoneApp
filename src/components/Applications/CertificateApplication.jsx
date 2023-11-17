import React,{ useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { applications_get_by_neighborhood_id, submit_certificate_application } from '../../requests/Applications';
import { formatearFecha, initCap, convertirFormatoFecha } from '../../utils/utils';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


const CertificateApplication = () => {
    const { userInfo } = useContext(UserContext);
    const neighborhoodId = userInfo.neighborhood.neighborhood_id;
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [expanded, setExpanded] = React.useState(false);
    const [certApplicationList, setCertApplicationList] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showRejectMessage, setShowRejectMessage] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        getApplications();
    }, [refresh])

    const getApplications = async () => {
        try {
            const applicationsResponse = await applications_get_by_neighborhood_id(neighborhoodId);
            const certificateApplications = applicationsResponse.data.filter(application => {
                return application.application_type === 'certificado';
            });
            setCertApplicationList(certificateApplications.reverse());
        } catch (error) {
            console.error('Error al obtener las solicitudes:', error);
        }
    }

    const handleResolution = (event) => {
        const resolution = event.target.value;
        if (selectedApplication) {
            if (resolution === 'aceptada' || resolution === 'rechazada') {

                const updateApplicationState = async () => {
                    const response = await submit_certificate_application(selectedApplication.id, userInfo.id);
                    if (response.status === 200) {
                        toast.success('Solicitud Resuelta', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                        setOpen(false);
                    }
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
        setSelectedApplication(application);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setRefresh(!refresh);
        setSelectedApplication(null);
        setOpen(false);
        setShowRejectMessage(false);
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
                    <div className='polls-list-container' style={{ height: '95%', overflow: 'auto'}}>
                        {certApplicationList.filter(application => application.state === 'creada').length === 0 ? (
                            <p>No hay solicitudes</p>
                        ) : (
                            certApplicationList.filter(application => application.state === 'creada').map((application, index) => (
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
                    
                </div>
                <div className='polls-list'>
                    <div className='poll-state-separator'>
                        <AssignmentTurnedInIcon />
                        <h2>Resueltas</h2>
                    </div>
                    <div className='polls-list-container' style={{ height: '95%', overflow: 'auto'}}>
                        {certApplicationList.filter(application => application.state !== 'creada').length === 0 ? (
                            <p>No hay solicitudes</p>
                        ) : (
                            certApplicationList.filter(application => application.state !== 'creada').map((application, index) => (
                                <div key={index} className='application-card'>
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
                {/* <div className='poll-info-card'>
                    <h1>Sobre las solicitudes de ingreso</h1>
                    <ul>
                        <li><h2>Solicitudes PENDIENTES</h2><p> ..... votado o no.</p></li>
                        
                    </ul>
                </div> */}

                <Dialog open={open} onClose={handleCloseDialog}>
                    <DialogContent>
                        {selectedApplication ? 
                        <div className='application-info-container'>
                            <h1>Solicitud de Certificado de Residencia</h1>
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
                                        <Button size='small' value='rechazada' variant='contained' color='error' onClick={handleResolution}>Confirmar rechazo</Button>
                                    </div>
                                </div>
                            : null}

                        </div> 
                        : null}
                        {/* {selectedApplication ? 
                        <PDFViewer style={{ width: '100%', height: '100%'}}><DocuPdf information={information} /></PDFViewer>
                        :null} */}
                    </DialogContent>
                    <DialogActions>
                        {showRejectMessage ? 
                            null
                        : 
                            <>
                                <Button variant='contained' color='error' value='rejectMessage' onClick={handleResolution} startIcon={<CancelRoundedIcon />}>Rechazar</Button>
                                <Button variant='contained' color='success' value='aceptada' onClick={handleResolution} startIcon={<CheckCircleRoundedIcon />}>Aceptar</Button>
                            </>
                        }
                        {/* <Button variant='contained' color='error' value='rechazada' onClick={handleResolution} startIcon={<CancelRoundedIcon />}>Rechazar</Button>
                        <Button variant='contained' color='success' value='aceptada' onClick={handleResolution} startIcon={<CheckCircleRoundedIcon />}>Aceptar</Button> */}
                        <Button onClick={handleCloseDialog}>Cerrar</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}

export default CertificateApplication