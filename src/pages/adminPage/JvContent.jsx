import React from 'react';
import NavBar from '../../layouts/Navbar';

const JvContent = ({ juntaSeleccionada }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', }}>
        <NavBar />
        {juntaSeleccionada ? 
        <>
        {juntaSeleccionada.name}
        </>
        : <>No se ha seleccionado ninguna Junta de Vecinos</>}
    </div >
    
  )
}

export default JvContent