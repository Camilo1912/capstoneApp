import React from 'react'
import { useContext } from 'react';
import { RegistrationContext } from '../../contexts/RegitrationContext';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import { toast } from 'react-toastify';

const RegisterVerificationFields = () => {
    const {registrationForm, handleRegistrationForm } = useContext(RegistrationContext);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];

        if (isFileValid(file)) {
            handleRegistrationForm({
                ...registrationForm,
                [field]: file,
            });
        } else {
            toast.error('El tamaño del archivo excede el límite de 5 MB', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
            console.error('El tamaño del archivo excede el límite de 5 MB');
        }
    };

    const isFileValid = (file) => {
        return file && file.size <= 5 * 1024 * 1024;
    };
    
    return (
        <>  
            <strong>Para poder verificarte frente a tu junta de vecinos necesitamos los siguientes documentos: </strong>
            <br />
            <br />
            <div className='register-combobox-container register-upload-file-container'>
                <label htmlFor="image-front">Foto carnet fontal *</label>
                <div>
                    <Button component="label" variant="contained" disableElevation color={ registrationForm.image_front ? 'success' : 'primary' } size='small' startIcon={registrationForm.image_front ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                        {registrationForm.image_front ? 'Cargado' : 'Cargar imagen'}
                        <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_front')} />
                    </Button>
                </div>
            </div>
            <div className='register-combobox-container register-upload-file-container'>
                <label htmlFor="image-back">Foto carnet parte posterior *</label>
                <div>
                    <Button component="label" variant="contained" disableElevation color={ registrationForm.image_back ? 'success' : 'primary' } size='small' startIcon={registrationForm.image_back ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                        {registrationForm.image_back ? 'Cargado' : 'Cargar imagen'}
                        <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_back')} />
                    </Button>
                </div>
            </div>
            <div className='register-combobox-container register-upload-file-container'>
                <label htmlFor="image-invoice">Foto de una cuenta o contrato que muestre su dirección y Rut. *</label>
                <Button component="label" variant="contained" disableElevation color={ registrationForm.image_invoice ? 'success' : 'primary' } size='small' startIcon={registrationForm.image_invoice ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                    {registrationForm.image_invoice ? 'Cargado' : 'Cargar imagen'}
                    <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_invoice')} />
                </Button>
            </div>
            <div className='register-combobox-container register-upload-file-container'>
                <label htmlFor="image-face">Foto de su rostro *</label>
                <Button component="label" variant="contained" disableElevation color={ registrationForm.image_face ? 'success' : 'primary' } size='small' startIcon={registrationForm.image_face ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                    {registrationForm.image_face ? 'Cargado' : 'Cargar imagen'}
                    <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_face')} />
                </Button>
            </div>
            Formatos aceptados: JPG, JPEG o PNG - Tamaño maximo 5mb
        </>
    )
}

export default RegisterVerificationFields