import React, { useEffect, useState } from 'react';
import NavBar from '../../layouts/Navbar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { formatearFecha } from '../../utils/utils';
import MembersList from './MembersList';
import Button from '@mui/material/Button';
import { neighborhood_delete } from '../../requests/Neighborhood';
import { toast } from 'react-toastify';
import { application_update, applications_get_by_neighbor_id, applications_get_by_neighborhood_id } from '../../requests/Applications';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { DialogContent } from '@mui/material';

const JvContent = ({ juntaSeleccionada, onSeleccion }) => {
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [applicationsList, setApplicationList] = useState([]);
    const [open, setOpen] = useState(false);

    const handleMemberSeleccion = (usuario) => {
        setUsuarioSeleccionado(usuario);
    };

    const handleNeighborhoodDelete = async () => {
        try {

            if (juntaSeleccionada.id) {
                const deleteResponse = await neighborhood_delete(juntaSeleccionada.id);
                if (deleteResponse.status === 204) {
                    toast.success('Junta de Vecinos eliminada correctamente.', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                    onSeleccion(null);
                }
            }
        } catch (error) {
            toast.error('No se pudo eliminar la junta de vecinos.', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
        }
    };


    useEffect(() => {
        if (juntaSeleccionada?.id) {
            const getApplications = async () => {
                const response = await applications_get_by_neighborhood_id(juntaSeleccionada.id);
                if (response.data) {
                    setApplicationList(response.data);
                    console.log(response.data);
                } 
            }
            getApplications();
        }
    },[juntaSeleccionada])

    const handleOpenDialog = () => {
        
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    
    const handleResolution = (event) => {

                const newPayload = {
                    application: {
                        state: 'aceptada',
                        message: ''
                    }
                }
                const updateApplicationState = async () => {
                    const response = await application_update(event.target.value, newPayload);
                    if (response.status === 200) {
                        toast.success('Respuesta enviada correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                        setOpen(false);
                    }

                }
                updateApplicationState();

    }
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', }}>
            {/* <NavBar /> */}
            {juntaSeleccionada ? 
            <div style={{ display: 'flex', height: '100%' }}>
            
                <div className='admin-neigh-info-detail' >
                    <h1>Junta de Vecinos {juntaSeleccionada.name}</h1>
                    <br />
                    <div className='admin-neigh-info'>
                        <div className='neighborhood-info-header-container'>
                            <img src={juntaSeleccionada.logo_url} alt="logo-jv" height={150} width={150} style={{ borderRadius: '10px'}}/>
                            <div>
                                <h3>Código Oficial</h3>
                                <p>{juntaSeleccionada.jv_code}</p>
                                <Divider></Divider>
                                <h3>Creación y Actualización</h3>
                                <p>Creación: {formatearFecha(juntaSeleccionada.created_at)}</p>
                                <p>Última Actualización: {formatearFecha(juntaSeleccionada.updated_at)}</p>
                            </div>
                        </div>
                        <h3>Descripción</h3>
                        <p>{juntaSeleccionada.description}</p>
                        <Divider></Divider>
                        <h3>Directiva</h3>
                        <p>Presidente: {juntaSeleccionada.president}</p> 
                        <p>Secretario: {juntaSeleccionada.secretary}</p>
                        <p>Tesorero: {juntaSeleccionada.treasurer}</p>
                        {/* {juntaSeleccionada?.president ? <p>Presidente: {juntaSeleccionada.president}</p> : <Button>Crear Presidente</Button>}
                        {juntaSeleccionada?.secretary ? <p>Secretario: {juntaSeleccionada.secretary}</p> : <Button>Crear Secretario</Button>}
                        {juntaSeleccionada?.treasurer ? <p>Tesorero: {juntaSeleccionada.treasurer}</p> : <Button>Crear tesorero</Button>} */}
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
                    
                    <Button variant='contained' onClick={handleNeighborhoodDelete} color='error' style={{ marginTop: '30px'}}>Eliminar Junta de Vecinos</Button>
                        
                    <Button variant='contained' onClick={handleOpenDialog}  style={{ marginTop: '30px'}}>Ver Solicitudes</Button>
                    </div>
                </div>

                <MembersList onSeleccion={handleMemberSeleccion} junta={juntaSeleccionada} />
            </div>
            : 
            <div style={{ height: '100%', padding: '15px', textAlign: 'center', marginTop: '50px', fontSize: '2rem', color: '#555555'}}>No se ha seleccionado ninguna Junta de Vecinos</div>}
        
            <Dialog open={open} maxWidth={'lg'} onClose={handleCloseDialog}>
                <DialogContent>

                {applicationsList?.map((application) => (
                    <div key={application.id} value={application.id}>
                    {application.id}
                        <Button value={application.id} onClick={handleResolution}>Aceptar solicitud</Button>
                    </div>
                ))}
                </DialogContent>
            </Dialog>
        </div > 
    )
}

export default JvContent