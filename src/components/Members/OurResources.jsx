import React, { useState } from 'react'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';


const OurResources = () => {
    const [refresh, setRefresh] = useState(true);
    const [resourcesList, setResourcesList] = useState([]);



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
                        {/* {certApplicationList.filter(application => application.state === 'creada').length === 0 ? (
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
                        )} */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default OurResources