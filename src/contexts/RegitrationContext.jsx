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
    gender: '',
    image_avatar: null,
    image_front: null,
    image_back: null,
    image_face: null,
    image_invoice: null
};

const RegistrationContextProvider = (props) => {
    const [registrationForm, setRegistrationForm] = useState(defaultRegistrationForm);

    const handleRegistrationForm = (value) => {
        setRegistrationForm(value);
    };

    const resetRegistrationForm = () => {
        setRegistrationForm(defaultRegistrationForm);
    };

    return (
        <RegistrationContext.Provider
            value={{
                registrationForm,
                handleRegistrationForm,
                resetRegistrationForm,
            }}
        >
            {props.children}
        </RegistrationContext.Provider>
    )
}

export default RegistrationContextProvider