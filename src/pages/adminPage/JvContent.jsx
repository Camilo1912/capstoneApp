import React, { useState } from 'react';
import NavBar from '../../layouts/Navbar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { formatearFecha } from '../../utils/utils';
import MembersList from './MembersList';

const JvContent = ({ juntaSeleccionada }) => {
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const handleMemberSeleccion = (usuario) => {
        setUsuarioSeleccionado(usuario);
    };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', }}>
            {/* <NavBar /> */}
            {juntaSeleccionada ? 
            <div style={{ display: 'flex', height: '100%' }}>
            
                <div className='admin-neigh-info-detail' >
                    <h1>Junta de Vecinos {juntaSeleccionada.name}</h1>
                    <br />
                    <div className='admin-neigh-info'>
                        <h3>Código Oficial</h3>
                        <p>{juntaSeleccionada.jv_code}</p>
                        <Divider></Divider>
                        <h3>Descripción</h3>
                        <p>{juntaSeleccionada.description}</p>
                        <Divider></Divider>
                        <h3>Directiva</h3>
                        {juntaSeleccionada.president ? <p>Presidente: {juntaSeleccionada.president}</p> : <Button>Crear Presidente</Button>}
                        {juntaSeleccionada.secretary ? <p>Secretario: {juntaSeleccionada.secretary}</p> : <Button>Crear Secretario</Button>}
                        {juntaSeleccionada.treasurer ? <p>Tesorero: {juntaSeleccionada.treasurer}</p> : <Button>Crear tesorero</Button>}
                        <Divider></Divider>
                        <h3>Dirección de Sede</h3>
                        <p>{juntaSeleccionada.address}</p>
                        <Divider></Divider>
                        <h3>Datos de Finanzas</h3>
                        <p>Nombre Cuenta: {juntaSeleccionada.bank_acc_name}</p>
                        <p>Rut: {juntaSeleccionada.bank_acc_rut}</p>
                        <p>Banco: {juntaSeleccionada.bank_name}</p>
                        <p>Número de cuenta: {juntaSeleccionada.bank_acc_type}</p>
                        <p>Tipo de cuenta: {juntaSeleccionada.bank_acc_number}</p>
                        <Divider></Divider>
                        <h3>Contacto</h3>
                        <p>Email: {juntaSeleccionada.bank_acc_email}</p>
                        <Divider></Divider>
                        <h3>Creación y Actualización</h3>
                        <p>Creación: {formatearFecha(juntaSeleccionada.created_at)}</p>
                        <p>Última Actualización: {formatearFecha(juntaSeleccionada.updated_at)}</p>
                    </div>
                </div>

                <MembersList onSeleccion={handleMemberSeleccion} junta={juntaSeleccionada} />
            </div>
            : 
            <div style={{ height: '100%', padding: '15px', textAlign: 'center', marginTop: '50px', fontSize: '2rem', color: '#555555'}}>No se ha seleccionado ninguna Junta de Vecinos</div>}
        </div > 
    )
}

export default JvContent