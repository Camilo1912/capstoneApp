import React, { useState } from 'react';
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { InputAdornment  } from '@mui/material';

import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

const Login = () => {
    const navigate = useNavigate(); //remover 

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

        navigate('/home');
        // try {
        //     const response = await axios.post('URL_POR_DEFINIR', {username, password});
        //     console.log(response.data);
        // } catch (error) {
        //     console.error(error);
        // }
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