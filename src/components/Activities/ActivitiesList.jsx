import React, { useContext, useEffect, useState } from 'react'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import { activities_get_by_neighborhood_id, activity_delete, activity_join } from '../../requests/Activities';
import { UserContext } from '../../contexts/UserContext';
import { formatearFecha, initCap } from '../../utils/utils';
import { activityTypes } from '../../utils/data';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';

const ActivitiesList = () => {
    const { userInfo } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [activitiesList, setActivitiesList] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        if (userInfo.neighborhood.neighborhood_id) {
            getAcitiviesList();
        }
        setOpen(false);
        setSelectedActivity(null);

    }, [refresh])

    const getAcitiviesList = async () => {
        const response = await activities_get_by_neighborhood_id(userInfo.neighborhood.neighborhood_id);
        setActivitiesList(response.data.reverse());
    }

    const joinActivity = async () => {
        if (userInfo && selectedActivity) {
            const payload = {
                activity_id: selectedActivity.id,
                rut: userInfo.rut,
                email: userInfo.email,
                full_name: `${userInfo.first_name} ${userInfo.second_name} ${userInfo.last_name} ${userInfo.last_name_2}` 
            }
            const joinResponse = await activity_join(selectedActivity.id, payload);
            if (joinResponse.status === 200) {
                toast.success('Se ha inscrito correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
            }
        }
    };

    const deleteActivity = async () => {
        if (selectedActivity) {
            const deleteResponse = await activity_delete(selectedActivity.id);
            if (deleteResponse.status === 204) {
                toast.success('La actividad se eliminó correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                setRefresh(!refresh);
            }
        }
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedActivity(null);
    };
    
    const handleOpenDialog = (selection) => {
        setOpen(true);
        setSelectedActivity(selection)
    };

    const handleJoinActivity = () => {
        joinActivity();
    };

    const handleDeleteActivity = () => {
        deleteActivity();
    }

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
                                    <div key={activity.id} className='application-card' onClick={() => handleOpenDialog(activity)}>
                                        <div className='application-card-header'><strong>{initCap(activity.title)}</strong> {formatearFecha(activity.start_date)}</div>
                                        <div className='application-card-content'>
                                            <p className='activities-card-content-text'>{activity.description}</p>
                                            <p>Tipo de actividad: <strong>{activity.activity_type ? activityTypes[activity.activity_type] : <>No especificado</>}</strong></p>
                                            {activity.quota ? 
                                            <>{[2, 3, 4].includes(userInfo.role.role_id) ? 
                                                <p>Inscritos: {activity.occupancy}/{activity.quota}</p>
                                                :<p>Cupos: <strong>{activity.quota - activity.occupancy }</strong></p>}</>
                                            : <p>Cupos: <strong>Sin límite</strong></p>}
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

            <Dialog open={open} onClose={handleCloseDialog}>
                {selectedActivity ? 
                <DialogContent>
                    <h1>{selectedActivity.title}</h1>
                    <h2>Tipo: {activityTypes[selectedActivity.activity_type]}</h2>
                    <p className='date-value'>Publicada el {formatearFecha(selectedActivity.created_at)}</p>
                    <strong>Descripción</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <p>{selectedActivity.description}</p>
                        <p>Inicio: <strong>{formatearFecha(selectedActivity.start_date)}</strong></p>
                        {selectedActivity.end_date ? 
                        <p>Termino: <strong>{formatearFecha(selectedActivity.end_date)}</strong></p>
                        : null}
                        {selectedActivity.quota ? 
                            <>
                                <p>Cupos disponibles: <strong>{selectedActivity.quota - selectedActivity.occupancy}</strong></p>
                                {[2, 3, 4].includes(userInfo.role.role_id) ? 
                                    <p>Inscritos: {selectedActivity.occupancy}</p>
                                :null}
                            </>
                        : null}
                    </div>
                    
                </DialogContent>
                : null}

                <DialogActions>
                    {[2, 3, 4].includes(userInfo.role.role_id) ? 
                        <>
                        <Button size='small' variant='contained' >Editar</Button>
                        <Button size='small' variant='contained' onClick={handleDeleteActivity} color='error'>Eliminar</Button>
                        </>
                    : null}
                    <Button size='small' variant='contained' onClick={handleJoinActivity} color='success'>Inscribirse</Button>
                    <Button size='small' variant='contained' color='error'>Desinscribirse</Button>
                    <Button size='small' onClick={handleCloseDialog}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ActivitiesList