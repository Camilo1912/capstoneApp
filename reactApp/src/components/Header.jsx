import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickLogout = () => {
        navigate('/');
    };

    return (
        <div className="header-wrapper">
            <h1>Comunidad vecinal</h1>
            <div className="header-iconset">
                <Avatar className='profile-avatar' alt="Remy Sharp" src="https://source.unsplash.com/random/64x64/?profile" />
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
                    Correo de contacto
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="ejemplo@mail.com"
                    type="email"
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleClose}>Aplicar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Header;