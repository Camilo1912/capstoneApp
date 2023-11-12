import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { applications_get_by_neighborhood_id } from '../../requests/Applications';
import { formatearFecha } from '../../utils/utils';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const MembershipApplication = () => {
    const { userInfo } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const neighborhoodId = userInfo.neighborhood.neighborhood_id;
    const [memberApplicationList, setMemberAplicationList] = useState([]);

    useEffect(() => {
        getApplications();
    }, [refresh])

    const getApplications = async () => {
        const applicationsResponse = await applications_get_by_neighborhood_id(neighborhoodId);
        setMemberAplicationList(applicationsResponse.data);
    }

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleOpenDialog = (application) => {
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
                                <div key={application.id} className='poll-card' onClick={() => handleOpenDialog(application)}>
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
                                <div key={application.id}>
                                    <p>{application.first_name} {application.second_name} {application.last_name} {application.last_name_2}</p>
                                    <p>{formatearFecha(application.created_at)}</p>
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

                </Dialog>
            </div>
            
        </>
    )
    
}

export default MembershipApplication