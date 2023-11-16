import React, { useContext, useEffect, useState } from 'react'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { UserContext } from '../../contexts/UserContext';
import { get_resources_by_neighborhood_id } from '../../requests/Resources';
import { convertirDiasATexto, formatearFecha, initCap } from '../../utils/utils';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';


const OurResources = () => {
    const [open, setOpen] = useState(false);
    const { userInfo } = useContext(UserContext);
    const [refresh, setRefresh] = useState(true);
    const [resourcesList, setResourcesList] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);

    useEffect(() => {
        getNeighborhoodResources();
    }, [refresh]);

    const getNeighborhoodResources = async() => {
        if (userInfo.neighborhood.neighborhood_id) {
            const response = await get_resources_by_neighborhood_id(userInfo.neighborhood.neighborhood_id);
            setResourcesList(response.data);
            console.log(response.data);
        }
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };
    
    const handleOpenDialog = (item) => {
        setOpen(true);
        setSelectedResource(item)
    };

    return (
        <>
            <div className='refresh-button-container'>
                <IconButton  id='add-button'>
                    <AddCircleRoundedIcon />
                </IconButton>
                <IconButton onClick={() => setRefresh(!refresh)} id='refresh-button'>
                    <RefreshRoundedIcon />
                </IconButton>
            </div>
            <div className='polls-wrapper'>
                <div className='polls-list'>
                    <div className='poll-state-separator'>
                        <CategoryRoundedIcon />
                        <h2>Todos</h2>
                    </div>
                    <div className='polls-list-container'>

                        {resourcesList.map((resource, index) => (
                            <div key={index} className='application-card' onClick={() => handleOpenDialog(resource)}>
                                <div className='application-card-header'><strong>{initCap(resource.name)}</strong></div>
                                <div className='application-card-content'>
                                    <p>Descripción: {resource.description}</p>
                                    <p>Horario disponible: {resource.opening_hour} - {resource.end_time}</p>
                                    <p>Días disponibles: {convertirDiasATexto(resource.available_day)}</p>
                                    <p>Creada el {formatearFecha(resource.created_at)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Dialog open={open} maxWidth={'md'} onClose={handleCloseDialog}>
                {selectedResource ? 
                    <>
                        <DialogTitle>
                            {selectedResource.name}
                        </DialogTitle>
                        <DialogContent>
                            <div>
                                <label><strong>Descripción</strong></label>
                                <p>{selectedResource?.description}</p>
                            </div>
                            <div>
                                <label><strong>Reglamento</strong></label>
                                <p>{selectedResource?.comment}</p>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='outlined' onClick={handleCloseDialog}>cerrar</Button>
                        </DialogActions>
                    </>
                :null}
            </Dialog>
        </>
    )
}

export default OurResources