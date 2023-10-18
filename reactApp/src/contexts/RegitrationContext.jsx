import React from 'react';
import { createContext, useState } from "react";

export const RegistrationContext = createContext();

const RegistrationContextProvider = (props) => {
    const [registrationForm, setRegistrationForm] = useState({
        firstname: '',
        middlename: '',
        lastname1: '',
        lastname2: '',
        birthDate: '',
        rut: '',
        street: '',
        number: '',
        regionId: '',
        communeId: '',
        neighborhoodId: '',
        email: '',
        password: '',
        verificationDocUrl: ''
    });

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