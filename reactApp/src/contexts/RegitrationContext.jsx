import React from 'react';
import { createContext, useState } from "react";

export const RegistrationContext = createContext();

const registrationUserData = [
    {
        username: '',
        lastnames: '',
        birthDate: '',
        rut: '',
        address: '',
        email: '',
        password: '',
        repeatPassword: '',
        verificationDocUrl: ''
    }
]


const RegistrationContextProvider = (props) => {
    const [registrationForm, setRegistrationForm] = useState([]);

    const handleRegistrationForm = (value) => {
        setRegistrationForm(value);
    };

    return (
        <RegistrationContext.Provider
            value={{
                registrationForm,
                handleRegistrationForm
            }}
        >
            {props.children}
        </RegistrationContext.Provider>
    )
}

export default RegistrationContextProvider