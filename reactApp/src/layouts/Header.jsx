import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

import { useContext, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { userRolsTypes } from '../utils/data';

import { UserContext } from '../contexts/UserContext';
import { FormLabel } from '@mui/material';
import { useSelectedComponent } from '../contexts/SelectedComponentContext';

const Header = () => {
    const navigate = useNavigate();
    const { userInfo, handleUserInfo } = useContext(UserContext);
    const { setSelectedComponent } = useSelectedComponent()

    const [open, setOpen] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [newEmail, setNewEmail] = useState(userInfo.email);
    const [newPhoneNumber, setNewPhoneNumber] = useState(userInfo.phone_number);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setEditMode(false);
        setOpen(false);
    };

    const handleClickLogout = () => {
        handleUserInfo({});
        setSelectedComponent({'nav': 0, 'menu': 0});

        navigate('/');
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
   
        handleUserInfo({
            ...userInfo,
            email: newEmail,
            phone_number: newPhoneNumber,
        });

        setEditMode(false);
    };


    return (
        <div className="header-wrapper">
            <div style={{ textTransform: 'capitalize' }}>
                <h1>Comunidad vecinal {userInfo.neighborhood_id}</h1>
                <h2>{userInfo.first_name} {userInfo.second_name} ({userRolsTypes[userInfo.role_id]})</h2>
            </div>
            <div className="header-iconset">
                <Avatar className='profile-avatar' alt="Vecino" src={userInfo.profilePhoto} />
                <div className='profile-button-set'>
                    <IconButton onClick={handleClickOpen} style={{ color: '#333333'}}>
                        <SettingsIcon fontSize='medium' />
                    </IconButton>
                    <IconButton onClick={handleClickLogout} style={{ color: '#333333'}}>
                        <LogoutIcon fontSize='medium' />
                    </IconButton>
                </div>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Ajustes de usuario</DialogTitle>
                <DialogContent>
                    A continuación se muestran tus datos de usuario
    
                    <div className='user-edit-form'>

                        <FormLabel>Nombre completo</FormLabel>
                        <p style={{ textTransform: 'capitalize' }}>{userInfo.first_name} {userInfo.second_name} {userInfo.last_name} {userInfo.last_name_2}</p>
                        
                        <FormLabel>RUT</FormLabel>
                        <p>{userInfo.rut}</p>
                        
                        <FormLabel>Fecha de nacimiento</FormLabel>
                        <p>{userInfo.birth_date}</p>
                        
                        <FormLabel>Correo electrónico</FormLabel>
                        {editMode ? (
                            <TextField
                            label="Nuevo correo electrónico"
                            variant="outlined"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            />
                            ) : (
                                <p>{userInfo.email}</p>
                                )}
                        
                        <FormLabel>Dirección de residencia</FormLabel>
                        <p>{userInfo.street_address} {userInfo.number_address}</p>

                        <FormLabel>Telefono</FormLabel>

                        {editMode ? (
                            <TextField
                            label="Nuevo telefono de contacto"
                            variant="outlined"
                            value={newPhoneNumber}
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                            />
                            ) : (
                                <p>{userInfo.phone_number}</p>
                                )}


                    </div>
                </DialogContent>
                <DialogActions>
                {!editMode && (
                        <Button onClick={handleEditClick}>Editar</Button>
                    )}
                    <Button onClick={handleClose}>Cerrar</Button>
                    {editMode && (
                        <Button onClick={handleSaveClick}>Guardar</Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Header;