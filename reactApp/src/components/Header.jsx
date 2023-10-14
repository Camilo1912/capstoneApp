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
import { Form, useNavigate } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';
import { FormLabel } from '@mui/material';

const Header = () => {
    const navigate = useNavigate();
    const { userInfo, handleUserInfo } = useContext(UserContext);

    const [open, setOpen] = useState(false);

    const [editMode, setEditMode] = useState(false);
    const [newAddress, setNewAddress] = useState(userInfo.address);
    const [newEmail, setNewEmail] = useState(userInfo.username);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setEditMode(false);
        setOpen(false);
    };

    const handleClickLogout = () => {
        handleUserInfo({});
        navigate('/');
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
        // Aquí deberías realizar la lógica para guardar la nueva dirección
        // Puedes llamar a un endpoint de API o realizar la actualización localmente
        // handleSave(newAddress);

        // Para este ejemplo, simplemente actualizaremos el estado localmente
        handleUserInfo({
            ...userInfo,
            address: newAddress,
            username: newEmail,
        });

        // Cerramos el diálogo
        setEditMode(false);
    };

    return (
        <div className="header-wrapper">
            <div style={{ textTransform: 'capitalize' }}>
                <h1>Comunidad vecinal {userInfo.community_name}</h1>
                <h2>{userInfo.firstname} {userInfo.lastname1} ({userInfo.rol})</h2>
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
                    <DialogContentText>
                        A continuación se muestran tus datos de usuario
                    </DialogContentText>
                    <div className='user-edit-form'>

                        <FormLabel>Nombre completo</FormLabel>
                        <p style={{ textTransform: 'capitalize' }}>{userInfo.firstname} {userInfo.secondname} {userInfo.lastname1} {userInfo.lastname2}</p>
                        
                        <FormLabel>RUT</FormLabel>
                        <p>{userInfo.rut}</p>
                        
                        <FormLabel>Fecha de nacimiento</FormLabel>
                        <p>{userInfo.birthDate}</p>
                        
                        <FormLabel>Correo electrónico</FormLabel>
                        {editMode ? (
                            <TextField
                            label="Nuevo correo electrónico"
                            variant="outlined"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            />
                            ) : (
                                <p>{userInfo.username}</p>
                                )}
                        
                        <FormLabel>Dirección de residencia</FormLabel>
                        {editMode ? (
                            <TextField
                            label="Nueva dirección"
                            variant="outlined"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            />
                            ) : (
                                <p>{userInfo.address}</p>
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