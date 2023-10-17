import React from 'react';
import { useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';

const RegisterPersonalFields = () => {
  const [registerFormData, setRegisterFormData] = useState({
    firstname: '',
    middlename: '',
    lastname1: '',
    lastname2: '',
    rut: ''
  });

  const handleRegisterFormChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      <form action="" className='registration-form'>
      <OutlinedInput
        id="filled-fisrtname-input"
        name='firstname'
        placeholder='Primer nombre'
        type="string"
        variant="outlined"
        value={registerFormData.firstname}
        onChange={handleRegisterFormChange}
      />
      <OutlinedInput
        id="filled-middlename-input"
        name='middlename'
        placeholder='Segundo nombre'
        type="string"
        variant="outlined"
        value={registerFormData.middlename}
        onChange={handleRegisterFormChange}
      />
      <OutlinedInput
        id="filled-lastname1-input"
        name='lastname1'
        placeholder='Apellido Paterno'
        type="string"
        variant="outlined"
        value={registerFormData.lastname1}
        onChange={handleRegisterFormChange}
      />
      <OutlinedInput
        id="filled-lastname2-input"
        name='lastname2'
        placeholder='Apellido Materno'
        type="string"
        variant="outlined"
        value={registerFormData.lastname2}
        onChange={handleRegisterFormChange}
      />
      <OutlinedInput
        id="filled-rut-input"
        name='rut'
        placeholder='RUT'
        type="string"
        variant="outlined"
        value={registerFormData.rut}
        onChange={handleRegisterFormChange}
      />
      </form>
      
    </div>
  )
}

export default RegisterPersonalFields