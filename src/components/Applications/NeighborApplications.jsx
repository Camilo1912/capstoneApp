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
import { applications_get_by_neighbor_id } from '../../requests/Applications';
import { formatearFecha, initCap, convertirFormatoFecha } from '../../utils/utils';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';


const CertificateApplication = () => {
    const { userInfo } = useContext(UserContext);
    const neighborhoodId = userInfo.neighborhood.neighborhood_id;
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [expanded, setExpanded] = React.useState(false);
    const [certApplicationList, setCertApplicationList] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        getApplications();
    }, [refresh])

    const getApplications = async () => {
        try {
            const applicationsResponse = await applications_get_by_neighbor_id(userInfo.id);
            const certificateApplications = applicationsResponse.data.filter(application => {
                return application.application_type === 'certificado';
            });
            setCertApplicationList(certificateApplications.reverse());
        } catch (error) {
            console.error('Error al obtener las solicitudes:', error);
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
                    <div className='poll-state-separator'>
                        <AssignmentTurnedInIcon />
                        <h2>Resueltas</h2>
                    </div>
                    <div className='polls-list-container'>
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

                        </div> 
                        : null}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cerrar</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    )
}

export default CertificateApplication