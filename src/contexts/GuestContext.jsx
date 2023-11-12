import React from 'react'
import { createContext, useState } from "react";

export const GuestContext = createContext();

const defaultGuestForm = {
    firstname: '',
    middlename: '',
    lastname1: '',
    lastname2: '',
    birthDate: '',
    rut: '',
    regionId: '',
    communeId: '',
    neighborhoodId: '',
    email: ''
};
const GuestContextProvider = (props) => {
    const [guestForm, setGuestForm] = useState(defaultGuestForm);

    const handleGuestForm = (value) => {
        setGuestForm(value);
    };

    const resetGuestForm = () => {
        setGuestForm(defaultGuestForm);
    };

  return (
    <GuestContext.Provider
        value={{
            guestForm,
            handleGuestForm,
            resetGuestForm,
        }}
    >
        {props.children}
    </GuestContext.Provider>
  )
}

export default GuestContextProvider