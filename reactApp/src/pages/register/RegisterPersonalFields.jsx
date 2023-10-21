import React from 'react';
import { useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';

const RegisterPersonalFields = () => {
  const [username, setUsername] = useState('');
  const [lastnames, setLastnames] = useState('');


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLastnamesChange = (e) => {
    setLastnames(e.target.value);
  };

  return (
    <div>
      <form action="" className='registration-form'>
      <OutlinedInput
        id="filled-username-input"
        placeholder='Nombre'
        type="string"
        variant="outlined"
        value={username}
        onChange={handleUsernameChange}
      />
      <OutlinedInput
        id="filled-lastnames-input"
        placeholder='Apellidos'
        type="string"
        variant="outlined"
        value={lastnames}
        onChange={handleLastnamesChange}
      />
      <OutlinedInput
        id="filled-rut-input"
        placeholder='RUT'
        type="string"
        variant="outlined"
        value={lastnames}
        onChange={handleLastnamesChange}
      />
      </form>
      
    </div>
  )
}

export default RegisterPersonalFields