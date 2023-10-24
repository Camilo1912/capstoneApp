import React, { useEffect } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useState, useContext } from 'react';
import { InputAdornment  } from '@mui/material';
import { RegistrationContext } from '../../contexts/RegitrationContext';

const strengthLevels = ['debil','media', 'fuerte', 'muy fuerte', 'demasiado corta'];
const MIN_PASSWORD_LENGTH = 8;


const RegisterCredentialFields = () => {
    const { registrationForm, handleRegistrationForm } = useContext(RegistrationContext);
    const [strength, setStrength] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (e) => { e.preventDefault(); };

    useEffect(() => {
        if (password && email) {
            handleRegistrationForm({
                ...registrationForm,
                password: password,
                email: email
            });
        }
        
    },[password, email]);

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

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        getStrength(newPassword);
    };

    return (
        <div className='credentials-form'>
            <label htmlFor="email">Correo electrónico</label>
            <OutlinedInput
                id="filled-email-input"
                placeholder='Email'
                type="email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
            />
            <label htmlFor="pass">Contraseña</label>
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
            <div className={`bars ${ (strength == 'muy fuerte') ? 'stronger' : strength}`}>
                <div></div>
            </div>
            <div className='password-strength'>
                { (password != '') ?  <>Contraseña { strength ? strength : 'demaisado corta'} </> : 'Mínimo 8 caracteres'}  
            </div>
        </div>
    )
}

export default RegisterCredentialFields