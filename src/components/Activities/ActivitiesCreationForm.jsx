import React, { useContext, useEffect, useState } from 'react'
import { activityTypes } from '../../utils/data'
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { DateTimePicker } from '@mui/x-date-pickers';
import { UserContext } from '../../contexts/UserContext';
import { activity_create } from '../../requests/Activities';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ActivitiesCreationForm = () => {
    const { userInfo, } = useContext(UserContext);
    const currentDateTime = new Date();
    const maxLengthDescription = 5000;
    const defaultActivity = {
        title: '',
        description: '',
        state: 'creada',
        activity_type: '',
        quota: 0,
        occupancy: 0,
        neighborhood_id: userInfo.neighborhood.neighborhood_id,
        start_date: null,
        end_date: null,
        address: '',
    }
    const [limitCupos, setLimitCupos] = useState(false);
    const [newActivity, setNewActivity] = useState(defaultActivity);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [characterCount, setCharacterCount] = useState(0);
    const [refresh, setRefresh] = useState(true);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
 
    useEffect(() => {
        setNewActivity(defaultActivity);
        setSelectedEndDate(null);
        setSelectedStartDate(null); //no resetéa la fecha
        setCharacterCount(0);
        setLimitCupos(false);
    }, [refresh])

    useEffect(() => {
        if (newActivity.title && newActivity.description && newActivity.neighborhood_id && newActivity.address && selectedStartDate) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [newActivity][selectedStartDate]);

    const handleCheckboxChange = () => {
        setLimitCupos(!limitCupos);
    };

    const handleTitleChange = (event) => {
        setNewActivity({
            ...newActivity,
            title: event.target.value,
        });
    };

    const handleAddressName = (event) => {
        setNewActivity({
            ...newActivity,
            address: event.target.value,
        });
    };

    const handleDescriptionChange = (event) => {
        setCharacterCount(maxLengthDescription - (maxLengthDescription - event.target.value.length));
        setNewActivity({
            ...newActivity,
            description: event.target.value,
        });
    };

    const handleStartDateChange = (selectedDate) => {
        setSelectedStartDate(selectedDate);
        setSelectedEndDate(null);
    };

    const handleEndDateChange = (selectedDate) => {
        setSelectedEndDate(selectedDate);
    };

    const handleActivityTypeChange = (event) => {
        const selectedType = event.target.value;
        setNewActivity({
            ...newActivity,
            activity_type: selectedType,
        });
    };

    const handleQuotaChange = (event) => {
        const newQuota = parseInt(event.target.value);

        if (newQuota) {
            setNewActivity({
                ...newActivity,
                quota: newQuota,
            });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitDisabled(true);
        const newStartDate = `${selectedStartDate.getFullYear()}-${(selectedStartDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedStartDate.getDate().toString().padStart(2, '0')}T${selectedStartDate.getHours().toString().padStart(2, '0')}:${selectedStartDate.getMinutes().toString().padStart(2, '0')}`;
        const newEndDate = `${selectedEndDate.getFullYear()}-${(selectedEndDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedEndDate.getDate().toString().padStart(2, '0')}T${selectedEndDate.getHours().toString().padStart(2, '0')}:${selectedEndDate.getMinutes().toString().padStart(2, '0')}`;

        const payload = {
            activity: {
                ...newActivity,
                start_date: newStartDate,
                end_date: newEndDate
            }
        };
        const activityResponse = await activity_create(payload);
        if (activityResponse.status === 200) {
            toast.success('Actividad publicada correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
            setRefresh(!refresh);
        }
    }

    return (
        <div className='project-creation-layout'>
            <div className='create-project-card'>

                <h1>Formulario de creación de actividad</h1>
                <div>
                    <label><strong>Titulo *</strong></label>
                    <input type="text" name="title" value={newActivity.title} maxLength={100} onChange={handleTitleChange}/>
                </div>
                <div>
                    <label><strong>Tipo de actividad</strong></label>
                    <select 
                        name="tipo-actividad" 
                        id="activity-type"
                        value={newActivity.activity_type}
                        onChange={handleActivityTypeChange}
                    >
                        <option value="">-- Seleccione --</option>
                        {Object.entries(activityTypes).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label><strong>Descripción *</strong></label>
                    <textarea 
                        className='custom-text-area' 
                        name="activity-description" 
                        id="act-desc" 
                        placeholder='Escriba descripción ...'
                        maxLength={maxLengthDescription}
                        value={newActivity.description}
                        onChange={handleDescriptionChange}
                    ></textarea>
                    <p>{characterCount}/{maxLengthDescription}</p>
                </div>
                <div>
                    <label><strong>Lugar *</strong></label>
                    <input type="text" name="address" value={newActivity.address} maxLength={100} onChange={handleAddressName}/>
                </div>
                <div>
                    <label><strong>Limite de cupos</strong></label>
                    <div>
                        <FormControlLabel control={<Checkbox checked={limitCupos} onChange={handleCheckboxChange} />} label='Limitar Cupos' />
                        <input
                            type="number"
                            onKeyDown={(e) => {
                                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={handleQuotaChange}
                            value={newActivity.quota || ''}
                            disabled={limitCupos ? false : true}
                            style={{ width: 100 }}
                            inputMode="numeric"
                            // pattern="[0-9]*"
                            // min="1"
                        />
                    </div>
                </div>
                <div>
                    <label><strong>Fecha y Hora *</strong></label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', marginBottom: '15px', marginTop: '15px'}}>
                        <DateTimePicker
                            label="Seleccione inicio"
                            ampm={false}
                            value={selectedStartDate || null}
                            minDateTime={currentDateTime}
                            onChange={handleStartDateChange}
                            format="dd/MM/yyyy HH:mm"
                            slotProps={{
                                textField: {
                                variant: 'outlined',
                                color: 'secondary',
                                size: 'small',
                                },
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center'}}>
                        <DateTimePicker
                            label="Seleccione termino"
                            ampm={false}
                            value={selectedEndDate || null}
                            disabled={selectedStartDate ? false : true}
                            minDateTime={selectedStartDate ? selectedStartDate : currentDateTime}
                            onChange={handleEndDateChange}
                            format="dd/MM/yyyy HH:mm"
                            slotProps={{
                                textField: {
                                variant: 'outlined',
                                color: 'secondary',
                                size: 'small',
                                },
                            }}
                        />
                    </div>
                </div>
                <div className='project-creation-button-container'>
                    <Button variant='contained' color='success' onClick={handleSubmit} disabled={isSubmitDisabled} endIcon={<SendRoundedIcon />}>Publicar</Button>
                </div>
            </div>
            <div className='project-creation-info-card'>
                <h1>Sobre la creacón de actividades</h1>
                <ul>
                    <li><h2>Tipo de Actividad</h2><p>Indica la naturaleza de la actividad</p></li>
                    <li><h2>Lugar de la Actividad</h2><p>El lugar donde se desarrollará la actividad, asegurate de ser lo mas preciso posible</p></li>
                    <li><h2>Limitar Cupos</h2><p>Cuando está seleccionada esta opción se te permitirá agregar un limite de personas que se podrán inscribir en la actividad. El mínimo es de 1 persona.</p></li>
                    <li><h2>Fecha y Hora de Inicio y Termino</h2><p>Tu actividad puede partir un día y terminar en otro, para esto seleccione la fecha y hora de inicio y luego la fecha y hora de termino. La fecha y hora de termino no podrá ser menor a la fecha de inicio.</p></li>
                    <li><h2>Visibilidad</h2><p>Cuando hayas creado la actividad, esta aparecerá en el calendarios y será visible para todos, incluyendo los usuarios invitados</p></li>

                </ul>
            </div>
        </div>
    )
}

export default ActivitiesCreationForm