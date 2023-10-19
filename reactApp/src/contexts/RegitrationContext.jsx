import React from 'react';
import { createContext, useState } from "react";

export const RegistrationContext = createContext();

const defaultRegistrationForm = {
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
};

const RegistrationContextProvider = (props) => {


    const [registrationForm, setRegistrationForm] = useState(defaultRegistrationForm);
    const [registrationStep, setRegistrationStep] = useState(0);

    const handleRegistrationForm = (value) => {
        setRegistrationForm(value);
    };

    const handleRegistrationStep = (value) => {
        setRegistrationStep(value);
    };

    const resetRegistrationForm = () => {
        setRegistrationForm(defaultRegistrationForm);
    };

    return (
        <RegistrationContext.Provider
            value={{
                registrationForm,
                handleRegistrationForm,
                registrationStep,
                handleRegistrationStep,
                resetRegistrationForm,
            }}
        >
            {props.children}
        </RegistrationContext.Provider>
    )
}

export default RegistrationContextProvider