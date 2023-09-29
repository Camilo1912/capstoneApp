import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import { InputAdornment  } from '@mui/material';

import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

const strengthLevels = ['debil','media', 'fuerte', 'muy fuerte', 'demasiado corta'];
const MIN_PASSWORD_LENGTH = 8;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(null);

    const getStrength = (password) => {
        if (password.trim() === '') {
            setStrength(null);
        } else if (password.length < MIN_PASSWORD_LENGTH) {
            setStrength(null);
        } else {

            let strengthIndicator = -1,
            upper = false,
            lower = false,
            numbers = false,
            symbols = false;

            const symbolRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
            
            for (let index = 0; index < password.length; index++) {
                const char = password.charCodeAt(index);
                if (!upper && char >= 65 && char <= 90) {
                    upper = true; 
                    strengthIndicator++;
                }
                if (!numbers && char >= 48 && char <= 57) {
                    numbers = true;
                strengthIndicator++;
                } 
                if (!lower && char >= 97 && char <= 122) {
                    lower = true;
                    strengthIndicator++;
                }
                if (!symbols && symbolRegex.test(password.charAt(index))) {
                    symbols = true;
                    strengthIndicator++;
                }
            }
            setStrength(strengthLevels[strengthIndicator]);
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        getStrength(newPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setUsername('');
        setPassword('');

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
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />

                <div className={`bars ${ (strength == 'muy fuerte') ? 'stronger' : strength}`}>
                    <div></div>
                </div>
                <div className='password-strength'>
                    { (password != '') ?  <>Contraseña { strength ? strength : 'demaisado corta'} </> : 'Mínimo 8 caracteres'}
                    
                </div>


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
                    {/* <Link to='Register'> Create an Account</Link> */}
                </div>
                </form>
            </div>
        </>
    )
}

export default Login;