import React, { useState, useContext } from 'react';
import { login } from '../requests/Auth';
import { Link , useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { InputAdornment  } from '@mui/material';
import { UserContext } from '../contexts/UserContext';
import { UserRols } from '../utils/UserRols';


import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

const Login = () => {
    const navigate = useNavigate(); //remover 

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { handleUserInfo } = useContext(UserContext); //quitar luego

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setUsername('');
        setPassword('');

        const response = ({
            'username': username,
            'rol': 'NEIGHBOR',
            'profilePhoto': 'https://source.unsplash.com/random/64x64/?profile',
            'comuna': 'Pedro Aguirre Cerda',
            'address': 'Av. Club Hípico 3565',
            'firstname': 'camilo',
            'secondname': 'hernán',
            'lastname1': 'marilaf',
            'lastname2': 'miranda',
            'birthDate': '13-12-1995',
            'community_id': 123,
            'community_name': 'magallanes',
            'community_code' : 'F02',
            'rut': '19.112.234-8'
        });

        handleUserInfo(response);
        navigate(UserRols(response.rol));

        // const response = await login(username, password);

        
    };

    return (
        <>
            <div className='login-card'>
                <h1>Inicio de sesión</h1>
                <form action="" className='login-form'>
    
                <OutlinedInput
                    id="filled-username-input"
                    placeholder='Email'
                    type="email"
                    autoComplete="current-email"
                    variant="outlined"
                    value={username}
                    onChange={handleUsernameChange}
                />
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Contraseña'
                    onChange={handlePasswordChange}
                    value={password}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                />

                <Button 
                    type='submit'
                    variant="contained"
                    disableElevation
                    onClick={handleSubmit}
                    endIcon={<LoginIcon />}
                >
                    Iniciar Sesión
                </Button>
                
                <div className='no-account-container'>
                    ¿No tienes cuenta de usuario?
                    <Link to='/register'> Registrarse</Link>
                </div>
                </form>
            </div>
        </>
    )
}

export default Login;