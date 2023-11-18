import React, { useState } from 'react';
import JvListAdmin from "./JvListAdmin";
import JvContent from './JvContent';

const AdminHome = () => {
    const [juntaSeleccionada, setJuntaSeleccionada] = useState(null);

    const handleSeleccion = (junta) => {
        setJuntaSeleccionada(junta);
    };

    return (
        <div className='admin-home-container'>
        <JvListAdmin onSelection={handleSeleccion} />
        <JvContent juntaSeleccionada={juntaSeleccionada} />
        </div>
    )
}

export default AdminHome