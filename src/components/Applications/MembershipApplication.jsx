import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { application_update, applications_get_by_neighborhood_id } from '../../requests/Applications';
import { formatearFecha } from '../../utils/utils';
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

const MembershipApplication = () => {
    const { userInfo } = useContext(UserContext);
    const [open, setOpen] = useState(false);
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
            console.log(newPayload);
            const updateApplicationState = async () => {
                const response = await application_update(selectedApplication.id, newPayload);
                if (response.state === 200) {
                    console.log('correcto....');
                    setRefresh(!refresh);
                }
            }
            updateApplicationState();
        }

    }

    const handleCloseDialog = () => {
        setSelectedApplication(null);
        setOpen(false);
    };

    const handleOpenDialog = (application) => {
        setSelectedApplication(application);
        setOpen(true);
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
                        {memberApplicationList.map((application) => (
                            <>
                            {application.application_type === 'registro' && memberApplicationList.length !== 0 && application.state === 'creada' ? 
                                <div key={application.id} className='poll-card application-card' onClick={() => handleOpenDialog(application)}>
                                    <p>{application.first_name} {application.second_name} {application.last_name} {application.last_name_2}</p>
                                    <p className='date-value'>{formatearFecha(application.created_at)}</p>
                                    <br />
                                </div>
                            :null}</>
                        ))}
                        {memberApplicationList.length === 0 ? <p>No hay solicitudes</p> : null}
                    </div>

                    <div className='poll-state-separator'>
                        <AssignmentTurnedInIcon />
                        <h2>Resueltas</h2>
                    </div>
                    <div className='polls-list-container'>
                        {memberApplicationList.map((application) => (
                            <>
                            {application.application_type === 'registro' && memberApplicationList.length !== 0  && application.state !== 'creada'? 
                                <div key={application.id} className='poll-card application-card'>
                                    <p>{application.first_name} {application.second_name} {application.last_name} {application.last_name_2}</p>
                                    <p>{formatearFecha(application.created_at)}</p>
                                    <p>{application.state}</p>
                                    <br />
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
                        <p>{selectedApplication?.first_name}</p>

                    </DialogContent>
                    <DialogActions>
                        <Button variant='contained' color='success' value='aceptada' onClick={handleResolution} startIcon={<CheckCircleRoundedIcon />}>Aceptar</Button>
                        <Button variant='contained' color='error' value='rechazada' onClick={handleResolution} startIcon={<CancelRoundedIcon />}>Rechazar</Button>
                        <Button onClick={handleCloseDialog}>Cerrar</Button>
                    </DialogActions>
                </Dialog>
            </div>
            
        </>
    )
    
}

export default MembershipApplication