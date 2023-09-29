import IconButton from '@mui/material/IconButton';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Avatar from '@mui/material/Avatar';

import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Header = () => {

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="header-wrapper">
            <h1>Comunidad vecinal</h1>
            <div className="header-iconset">
                <Avatar alt="Remy Sharp" src="https://source.unsplash.com/random/64x64/?profile" />
                
                <div className='profile-button-set'>
                    <IconButton onClick={handleClickOpen}>
                        <SettingsOutlinedIcon fontSize='medium' color='primary' />
                    </IconButton>
                    <IconButton>
                        <LogoutOutlinedIcon fontSize='medium' color='primary' />
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