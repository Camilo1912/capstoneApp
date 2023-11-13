import React, { useContext, useEffect, useState } from 'react'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import { activities_get_by_neighborhood_id } from '../../requests/Activities';
import { UserContext } from '../../contexts/UserContext';
import { initCap } from '../../utils/utils';

const ActivitiesList = () => {
    const { userInfo } = useContext(UserContext);
    const [refresh, setRefresh] = useState(true);
    const [activitiesList, setActivitiesList] = useState([]);

    useEffect(() => {
        if (userInfo.neighborhood.neighborhood_id) {

            const getAcitiviesList = async () => {
                const response = activities_get_by_neighborhood_id(userInfo.neighborhood.neighborhood_id);
                response.then((resolvedValue) => {
                    if (resolvedValue && resolvedValue.data) {
                        setActivitiesList(resolvedValue.data.reverse());
                    } else {
                        console.error('El valor resuelto o resolvedValue.data es undefined.');
                    }
                });
            }
            getAcitiviesList();
        }
    }, [refresh])

    

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
                        {/* <AssignmentTurnedInIcon /> */}
                        <h2>Proximas</h2>
                    </div>
                    <div className='polls-list-container'>
                                {activitiesList?.map((activity) => (
                                    <div key={activity.id} className='application-card' >
                                        <div className='application-card-header'><strong>{initCap(activity.title)}</strong></div>
                                        <div className='application-card-content'>
                                            <p className='activities-card-content-text'>{activity.description}</p>
                                            <p>Cupos: {activity.occupancy}/{activity.quota}</p>
                                        </div>
                                    </div>
                                ))}
                    </div>
                    <div className='poll-state-separator'>
                        {/* <AssignmentTurnedInIcon /> */}
                        <h2>Pasadas</h2>
                    </div>
                </div>
                    
                <div className='poll-info-card'>
                    <h1>Sobre las solicitudes de ingreso</h1>
                    <ul>
                        <li><h2>Solicitudes PENDIENTES</h2><p> ..... votado o no.</p></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default ActivitiesList