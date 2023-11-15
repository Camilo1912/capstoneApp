import React, { useState, useContext, useEffect } from 'react'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { UserContext } from '../../contexts/UserContext';
import { initCap } from '../../utils/utils';
import { application_verified_create } from '../../requests/Applications';

const CreateCertificateApplication = () => {
    const { userInfo, } = useContext(UserContext);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const handleSubmit = async () => {
        
        if (userInfo) {
            setIsSubmitDisabled(true);
            const response = await application_verified_create(userInfo.id);
            if (response.status === 200) {
                toast.success('Solicitud enviada correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
            }
            setIsSubmitDisabled(false);
        }
    }

    return (
        <div className='project-creation-layout'>
            <div className='create-project-card'>

                <h1>Solicitud de Certificado de residencia</h1>
                <div>
                    <p>La solicitud de certificado de residencia se generará con los siguientes datos. En caso de haber 
                    cambiado de dirección, por favor, realice primero la <strong>solicitud de cambio de dirección</strong> o <strong>solicitud
                     de cambio de junta</strong> según corresponda.</p>
                </div>
                <div>
                    <label><strong>Nombre Completo</strong></label>
                    <p>{initCap(userInfo.first_name)} {initCap(userInfo.last_name)} {initCap(userInfo.last_name_2)}</p>
                </div>

                <div>
                    <label><strong>Rut</strong></label>
                    <p>{userInfo.rut}</p>
                </div>

                <div>
                    <label><strong>Dirección</strong></label>
                    <p>{initCap(userInfo.street_address)} {userInfo.number_address} - Ciudad de {initCap(userInfo.commune.commune_name)} - Región {initCap(userInfo.region.region_name)}</p>
                </div>
                <div style={{ color: '#555555', fontSize: '.8rem'}}>
                    <p>Cualquier pago por la solicitud del documento debe ser coordinada con el tesorero a cargo. Cuando el Presidente de tu junta de vecinos resuelva tu solicitud, recibiarás
                         un <strong>correo electronico</strong> con tu certificado o respuesta a corde.</p>
                </div>
                <div className='project-creation-button-container'>
                    <Button variant='contained' color='success' disabled={isSubmitDisabled} onClick={handleSubmit} endIcon={<SendRoundedIcon />}>Solicitar</Button>
                </div>

                
            </div>
            {/* <div className='project-creation-info-card'>
                <h1>Sobre la creacón de actividades</h1>
                <ul>
                    <li><h2>Tipo de Actividad</h2><p>El tipo de anuncio indica si se mostrará solo una imágen (tipo afiche) o </p></li>
                </ul>
            </div> */}
        </div>
    )
}

export default CreateCertificateApplication