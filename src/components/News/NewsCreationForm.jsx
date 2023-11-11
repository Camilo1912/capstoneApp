import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { submit_new_announcement } from '../../requests/News';
import { toast } from 'react-toastify';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import IconButton from '@mui/material/IconButton';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';


const NewsCreationForm = () => {
    const { userInfo } = useContext(UserContext);
    const defaultAnnouncement = {
        type: 'Normal',
        title: '',
        description: '',
        neighbor_id: userInfo.id,
        neighborhood_id: userInfo.neighborhood.neighborhood_id,
        sent_email: false,
        image_file: null,
    };
    const [characterCount, setCharacterCount] = useState(0);
    const [newAnnouncement, setNewAnnouncement] = useState(defaultAnnouncement);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const maxLengthDescription = 5000;

    useEffect(() => {
        if (newAnnouncement.type === 'Normal' && newAnnouncement.title && newAnnouncement.description) {
            setIsSubmitDisabled(false);
        } else if (newAnnouncement.type === 'Afiche' && newAnnouncement.image_file) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [newAnnouncement]);

    const handleAnnouncementTypeChange = (event) => {
        setNewAnnouncement({
            ...newAnnouncement,
            type: event.target.value
        })
    };

    const handleDescriptionChange = (event) => {
        setCharacterCount(maxLengthDescription - (maxLengthDescription - event.target.value.length));
        setNewAnnouncement({
            ...newAnnouncement,
            description: event.target.value,
        });
    };

    const handleTitleChange = (event) => {
        setNewAnnouncement({
            ...newAnnouncement,
            title: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewAnnouncement({
                ...newAnnouncement,
                image_file: file,
            });
        }
    };

    const handleSendEmailChange = (event) => {
        setNewAnnouncement({
            ...newAnnouncement,
            sent_email: event.target.checked,
        });
    };

    const handleSubmit = async () => {
        const payload = {
            'announcement[title]': newAnnouncement.title,
            'announcement[description]': newAnnouncement.description,
            'announcement[neighbor_id]': newAnnouncement.neighbor_id,
            'announcement[neighborhood_id]': newAnnouncement.neighborhood_id,
            'image_1': newAnnouncement.image_file
        };
        const project_response = await submit_new_announcement(payload);
        if (project_response.status === 200) {
          toast.success('El anuncio se publicó correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
          setNewAnnouncement(defaultAnnouncement);
        }
    }

    return (
        <div className='project-creation-layout'>
            <div className='create-project-card'>

                <h1>Formulario de creación de anuncio</h1>
                <div>
                    <h3>Seleccione tipo de anuncio</h3>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="Normal"
                        name="row-radio-buttons-group"
                        onChange={handleAnnouncementTypeChange}
                    >
                        <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
                        <FormControlLabel value="Afiche" control={<Radio />} label="Afiche" />
                    </RadioGroup>
                </div>

                {newAnnouncement.type === 'Normal' ? 
                <>
                    <div>
                        <label><strong>Titulo</strong> *</label>
                        <input type="text" name="title" value={newAnnouncement.title} maxLength={100} onChange={handleTitleChange}/>
                    </div>


                    <div>
                        <label><strong>Descripción</strong> *</label>
                        <textarea name="description" value={newAnnouncement.description} placeholder='Escriba descripción ...' maxLength={maxLengthDescription} onChange={handleDescriptionChange} />
                        <p>{characterCount}/{maxLengthDescription}</p>
                    </div>
                </>
                : null}
                
                <div>
                    <label><strong>Adjuntar imágen</strong> {newAnnouncement.type === 'Normal' ? "(Opcional)" : "*"}</label>
                    
                    <div>
                        <Button component="label" variant="outlined" disableElevation disabled={newAnnouncement.image_file ?  true : false} color={ newAnnouncement.image_file ? 'success' : 'primary' } size='small' startIcon={newAnnouncement.image_file ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                            {newAnnouncement.image_file ? 'Cargado' : 'Cargar imagen'}
                            <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e)} />
                        </Button>
                        <IconButton style={{ display: newAnnouncement.image_file ? "" : "none" }} onClick={() => (setNewAnnouncement({...newAnnouncement, image_file: null}))}>
                            <CachedRoundedIcon />
                        </IconButton>
                    </div>
                </div>
                
                <div>
                    <label><strong>Enviar por email</strong></label>
                    <FormControlLabel control={<Checkbox checked={newAnnouncement.send_email} onChange={handleSendEmailChange} />} label='Enviar email' />
                    <p>Al seleccionar esta opción se enviará el anuncio a todos los integrantes de su junta de vecinos via email.</p>
                </div>

                <div className='project-creation-button-container'>
                    <Button variant='contained' disabled={isSubmitDisabled} color='success' onClick={handleSubmit} endIcon={<SendRoundedIcon />}>Publicar</Button>
                </div>
                
            </div>
            <div className='project-creation-info-card'>
                <h1>Sobre la publicación de anuncios</h1>
                <ul>
                <li><h2>Tipo de Anuncio</h2><p>El tipo de anuncio indica si se mostrará solo una imágen (tipo afiche) o </p></li>
            </ul>
            </div>
        </div>
    )
}

export default NewsCreationForm