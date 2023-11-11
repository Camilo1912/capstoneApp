import React, { useEffect } from 'react';
import { useState, useContext  } from 'react';
import { RegistrationContext } from '../../contexts/RegitrationContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const RegisterPersonalFields = () => {
  const {registrationForm, handleRegistrationForm } = useContext(RegistrationContext);
  const [rutError, setRutError] = useState(false);
  const [rut, setRut] = useState('');
  const [dv, setDv] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const restrictionDate = new Date();
  restrictionDate.setFullYear(restrictionDate.getFullYear() - 14);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    handleRegistrationForm({
      ...registrationForm,
      [name]: value,
    });
  };

  const validateRut = () => {
    const rutPattern = /^\d{7,8}-[\dkK]$/;
    const completeRut = `${rut}-${dv}`;
    return rutPattern.test(completeRut);
  };

  const handleRutChange = (event) => {
    const {name, value} = event.target;
    if (name === 'rut') {
      const sanitizedValue = value.replace(/[^0-9kK]/g, '');
      setRut(sanitizedValue);
    } else {
      setDv(value);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    setRutError(validateRut(rut));
    if (validateRut()) {
      handleRegistrationForm({
        ...registrationForm,
        'rut': `${rut}-${dv}`,
      });
    } else {
      handleRegistrationForm({
        ...registrationForm,
        'rut': '',
      });
    }
  }, [rut, dv]);

  useEffect(() => {

    if (selectedDate) {
      handleRegistrationForm({
        ...registrationForm,
        birthDate: `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`
      });
    } else {
      handleRegistrationForm({
        ...registrationForm,
        birthDate: ''
      });
    }
  }, [selectedDate]);


  return (
    <div>
      <form action="" className='registration-form'>
        <strong>Necesitamos los siguientes datos personales para poder verificarte ante la junta de vecinos.</strong>
        <div className='form-name-container'>
          <div>
            <label htmlFor="fistname">Primer nombre * </label>
            <input
              id="filled-fisrtname-input"
              name="firstname"
              placeholder="Primer nombre"
              type="text"
              value={registrationForm.firstname || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="middlename">Segundo Nombre (Opcional)</label>
            <input
              id="filled-middlename-input"
              name='middlename'
              placeholder='Segundo nombre'
              type="text"
              value={registrationForm.middlename || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='form-name-container'>
          <div>
            <label htmlFor="lastname1">Primer Apellido *</label>
            <input
              id="filled-lastname1-input"
              name='lastname1'
              placeholder='Apellido Paterno'
              type="text"
              value={registrationForm.lastname1 || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="lastname2">Segundo Apellido *</label>
            <input
              id="filled-lastname2-input"
              name='lastname2'
              placeholder='Apellido Materno'
              type="text"
              value={registrationForm.lastname2 || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <label htmlFor="rut">RUT *</label>
        <div className='rut-form'>
          <input
            id="filled-rut-input"
            name='rut'
            placeholder='RUT'
            type="text"
            value={rut || ''}
            onChange={handleRutChange}
            className={rutError ? 'input-error' : ''}
            maxLength={8}
          /> -
          <select name="dv"
            id="dv"
            value={dv || ''}
            onChange={handleRutChange}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
            <option value="k">k</option>
          </select>
          {!rutError ? <p className="error-message">RUT no válido</p> : <></>}
        </div>
        <div className='rut-form'>
          <label htmlFor="birthdate">Fecha de nacimiento *</label>
          <DatePicker 
            name="birthDate"
            value={selectedDate}
            maxDate={restrictionDate}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                variant: 'outlined',
                color: 'secondary',
                size: 'small',
              },
            }}
          />
        </div>

        <div className='form-name-container'>
            <label htmlFor="genero">Genero</label>
            <select value={registrationForm.gender} name='gender' onChange={handleInputChange}>
              <option disabled value="">-- Seleccione Genero --</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
        </div>
      </form>
      
    </div>
  )
}

export default RegisterPersonalFields