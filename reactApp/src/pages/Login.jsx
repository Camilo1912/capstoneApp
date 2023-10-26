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
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const { handleUserInfo } = useContext(UserContext);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setFeedbackMessage('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setFeedbackMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username == '' || password == '') {
            setFeedbackMessage('Faltan datos por ingresar');
        } else {
            setFeedbackMessage('');
            try {
                const response = await login(username, password);

                handleUserInfo(response);
                console.log("va a redireccionar : ", response["role"]["role_id"]);
                navigate(UserRols(response["role"]["role_id"]));
            } catch (error) {
                console.log(error);
                setFeedbackMessage(error.response.data.error);
            }
            setUsername('');
            setPassword('');
        }
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
                    size='small'
                    value={username}
                    onChange={handleUsernameChange}
                />
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Contraseña'
                    size='small'
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
                <p style={{ color: 'red' }}>{feedbackMessage}</p>
                

                <Button 
                    type='submit'
                    variant="contained"
                    disableElevation
                    onClick={handleSubmit}
                    endIcon={<LoginIcon />}
                >
                    Iniciar Sesión
                </Button>

                <Button 
                    type='submit'
                    variant="outlined"
                    endIcon={<LoginIcon />}
                >
                    Invitado
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