import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

import { useContext, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';
import { FormLabel } from '@mui/material';
import { useSelectedComponent } from '../contexts/SelectedComponentContext';
import { getUserId } from '../utils/LocalStorage';
import { logout } from '../requests/Auth';

const Header = () => {
    const navigate = useNavigate();
    const { userInfo, handleUserInfo } = useContext(UserContext);
    const { setSelectedComponent } = useSelectedComponent()

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newEmail, setNewEmail] = useState(userInfo.email);
    const [newPhoneNumber, setNewPhoneNumber] = useState(userInfo.phone_number);
    const [labelColor, setLabelColor] = useState('blue');

    useEffect(() => {
        if ([2,3,4].includes(userInfo.role?.role_id)) {
            setLabelColor('#FFC300');
        } else if (userInfo.role?.role_id === 5) {
            setLabelColor('#ff770085');
        } else {
            setLabelColor('#3584e4b4');
        }
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setEditMode(false);
        setOpen(false);
    };

    const handleClickLogout = async () => {
        handleUserInfo({});
        const response = await logout(getUserId());
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
            <div className='header-title-wrapper' style={{ textTransform: 'capitalize' }}>
                {userInfo.role.role_id !== 5 ? <h1>Comunidad vecinal {userInfo.neighborhood.neighborhood_name}</h1> : <h1>SISTEMA DE ADMINISTRACIÓN</h1>}
                
                <div>
                    <h2>{userInfo.first_name} {userInfo.last_name}</h2>
                    <p  style={{backgroundColor: labelColor}}> {userInfo.role.role_name}</p>
                </div>
                
            </div>
            <div className="header-iconset">
                <Avatar className='profile-avatar' alt="Vecino" src={"https://ffc774414c6c8893229aeb994d5dcdf1cb1a237add4b4b4d76b7f20-apidata.googleusercontent.com/download/storage/v1/b/api_photos/o/uploads%2F20feac6a-d3b2-41f1-8388-fd42fd26a984%2Fcfb875ac3b1c8575b051af65e3f00488.png?jk=AQHBpxwAlZDtA9rsjAEQSW2Kv9G2PRokCUsJzHC24oMG9m5ccH0CQcXPkQgP_2X9s33aTLD82dnHbRE8vpOA2tV9l9mNprRW4dZ-V7gUKNUE3Ys-uhml5AvG2MJNHCtf6GwVAN6OVBr0q-tqKzoG_2lUYnpv6V0xVYC0wZFmZOTlWLGEodLR-4sFwqkUr0aGdCZZBg2thZXaXlDxsIOHLUMTQvOtkWSFFPyQG4X68fdqtbZRv1KNuo8afTd1xYBV3qH-nOc4WurlOpYEBGxri8LdaXHVCBRxgZ59U1BXOm_bos0ZlzbeaxQ3q-eboe2sEQM_DM9eULAaSHD93wEvtHWEEb8K4WNMqoykNEMENrX70qsOSyckpsGU1LriOKehbH1D22f8tCVBa-XEW1evitRFPKryumjC92KdfzpH8Um-aXakik1MW6OIkZctKPJ753irobU7p2EuZDjReNHzs_jivzLvilfZ5sjaby1uT_wszn8gRTyvCb1Y0oLdn0Ptp2JS7W_u7zIHDeBbvqdUr0P70PEkoV-dbWC5vKNWSXecaUNVnVUg0Kcp8LhG18sg_VYx-BDVb_E8QJY1kP_TjctOHLpPERvgWe5PD-a3ZatznonYvZQ3Q8WOYw3fXep6LX9Xm7JU40BvWHrOr-ESwItedNpledSJmNp97qnye5oHnNmoAh5auWMP4YeoHQzDXPbE5-g0PuLtlN7Om09_9CsSGGiBug56iT8o3nqzShQ8CBWC6zoG2Cw0L6V4BpiBLCDFGSzYHMtFeI1EAWxTAUp6SCRXgzygvvGxsdraK8AhFd3BmQwNtbdab6MAQQ8CmSbTNQBYNV4SiRPQE4f-yE08Y3bM0Te_rOk8RPaKGBj6FdstI8_ODgrJB3ZUeupcR3qgJcjed_8bXFbPFo8z7tOIIPPRhrdjdh9YWPX8clfEHYbhGsGjyZjsbxJDs4YbzYAq2E_UsuyWz3hZF9nRuFPLogEwhL-LYpgJrTpaHFiq1thzOWA6a5uszE0rgS8LnMGdouTJ7N_VHX8f3QMBlTMDE26VnJQLJgI-ZxbqgnSO5yXexkMsxflaahxMBXTUcBducgS40U97ClmfrjS5QEgpc7HOYYi1i0mb10Knk-Cu4mDOFpR8iP45pD--Q3mQtTKqKPj16k4HGEvm04Ej7Kilqww-ttHN8QK4CWmGdpvSX2HYP6LW2OhapCfOD4MEhwITBsZmRy0SNPKQeQqVlmpktuzceqdYYkv1cjg4rCenVVM6iz3x&isca=1"} />
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
                <DialogTitle>Datos y ajustes de usuario</DialogTitle>
                <DialogContent>
    
                    <div className='user-edit-form'>
                        <div>
                            <FormLabel>Nombre completo</FormLabel>
                            <p style={{ textTransform: 'capitalize' }}>{userInfo.first_name} {userInfo.second_name} {userInfo.last_name} {userInfo.last_name_2}</p>
                        </div>
                        <div>
                            <FormLabel>RUT</FormLabel>
                            <p>{userInfo.rut}</p>
                        </div>
                        <div>
                            <FormLabel>Fecha de nacimiento</FormLabel>
                            <p>{userInfo.birth_date}</p>
                        </div>
                        <div>
                            <FormLabel>Correo electrónico</FormLabel>
                            {editMode ? (
                                <input
                                label="Nuevo correo electrónico"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                />
                                ) : (
                                    <p>{userInfo.email}</p>
                                    )}
                        </div>
                        <div>
                            <FormLabel>Dirección de residencia</FormLabel>
                            <p>{userInfo.street_address} {userInfo.number_address}, {userInfo.commune.commune_name}, Región {userInfo.region.region_name}</p>
                        </div>
                        <div>
                            <FormLabel>Telefono</FormLabel>
                            {editMode ? (
                                <input
                                label="Nuevo telefono de contacto"
                                value={newPhoneNumber}
                                onChange={(e) => setNewPhoneNumber(e.target.value)}
                                />
                                ) : (
                                    <p>{userInfo.phone_number}</p>
                                    )}
                            </div>

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