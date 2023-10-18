import React from 'react';
import { useState, useContext  } from 'react';
import { RegistrationContext } from '../../contexts/RegitrationContext';

const RegisterPersonalFields = () => {
  const {registrationForm, handleRegistrationForm } = useContext(RegistrationContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleRegistrationForm({
      ...registrationForm,
      [name]: value,
    });
  };

  return (
    <div>
      <form action="" className='registration-form'>
        <strong>Necesitamos los siguientes datos personales para poder verificarte ante la junta de vecinos.</strong>
        <label htmlFor="">Primer nombre * </label>
        <input
          id="filled-fisrtname-input"
          name="firstname"
          placeholder="Primer nombre"
          type="text"  // En lugar de "string"
          value={registrationForm.firstname || ''}
          onChange={handleInputChange}
        />
        <label htmlFor="">Segundo Nombre (Opcional)</label>
        <input
          id="filled-middlename-input"
          name='middlename'
          placeholder='Segundo nombre'
          type="text"
          value={registrationForm.middlename || ''}
          onChange={handleInputChange}
        />
        <label htmlFor="">Apellido Paterno *</label>
        <input
          id="filled-lastname1-input"
          name='lastname1'
          placeholder='Apellido Paterno'
          type="text"
          value={registrationForm.lastname1 || ''}
          onChange={handleInputChange}
        />
        <label htmlFor="">Apellido Materno *</label>
        <input
          id="filled-lastname2-input"
          name='lastname2'
          placeholder='Apellido Materno'
          type="text"
          value={registrationForm.lastname2 || ''}
          onChange={handleInputChange}
        />
        <label htmlFor="">RUT *</label>
        <input
          id="filled-rut-input"
          name='rut'
          placeholder='RUT'
          type="text"
          value={registrationForm.rut || ''}
          onChange={handleInputChange}
        />
      </form>
      
    </div>
  )
}

export default RegisterPersonalFields