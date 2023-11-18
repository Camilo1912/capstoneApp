import React from 'react'
import { useEffect, useState, useContext } from 'react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Button, IconButton, Input } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GuestContext } from '../../contexts/GuestContext';
import { get_communes_by_region, get_regions } from '../../requests/Address';
import { get_neighborhood_by_commune_id } from '../../requests/Neighborhood';
import { get_announcements_by_neighborhood_id } from '../../requests/News';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { convertirDiasANumeros, formatearFecha } from '../../utils/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { activities_get_by_neighborhood_id, activity_join } from '../../requests/Activities';
import CampaignIcon from '@mui/icons-material/Campaign';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { activityTypes } from '../../utils/data';
import { validateRut } from '@fdograph/rut-utilities';
import { toast } from 'react-toastify';
import { RefreshRounded } from '@mui/icons-material';
import GuestNeighborhoodInfo from './GuestNeighborhoodInfo';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { application_invited_resource_create, applications_guest_create_cert, get_resource_applications_by_neighborhood } from '../../requests/Applications';
import { DialogTitle } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { addDays, format, startOfTomorrow } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es';
import { get_resources_by_neighborhood_id } from '../../requests/Resources';


const GuestHome = () => {
    const navigate = useNavigate();
    const currentDate = new Date();
    const defaultGuestInfo = {
        first_name: '',
        second_name: '',
        last_name: '',
        last_name_2: '',
        email: '',
        rut: ''
    } 
    const defaultAddressInfo = {
        street_address: '',
        number_address: '',
        numero_dpto: '',
        image_front: null,
        image_back: null,
        image_invoice: null,
        image_face: null
    }
    const defaultTimeSpan = {
        startTime: '',
        endTime: '',
    }
    const today = new Date();
    const tomorrow = startOfTomorrow();
    const maxEndDate = addDays(tomorrow, 14);
    const { guestForm, handleGuestForm, resetGuestForm } = useContext(GuestContext);
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [regionsList, setRegionsList] = useState([]);
    const [communesList, setCommunesList] = useState([]);
    const [neighborhoodsList, setNeighborhoodsList] = useState([]);
    const [neighborhoodInfo, setNeighborhoodInfo] = useState({});
    const [newsList, setNewsList] = useState(null);
    const [activitiesList, setActivitiesList] = useState(null);
    const [refresh, setRefresh] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activityOpen, setActivityOpen] = useState(false);
    const [guestInfo, setGuestInfo] = useState(defaultGuestInfo);
    const [showJoinActivityForm, setShowJoinActivityForm] = useState(false);
    const [newRut, setNewRut] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [refreshInformation, setRefreshInformation] = useState(false);
    const [showRefreshButton, setShowRefreshButton] = useState(false);
    const [selectedContent, setSelectedContent] = useState(1);
    const [addressForm, setAddressForm] = useState(defaultAddressInfo);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);
    const [selectedTimeSpan, setSelectedTimeSpan] = useState(defaultTimeSpan);
    const [resourcesList, setResourcesList] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const [existingApplicationsList, setExistingApplictionsList] = useState([]);
    const [eventsList, setEventsList] = useState([]);

    useEffect(() => {
        if (selectedResource) {
            const eventosFiltrados = existingApplicationsList.filter((evento) => (evento.state !== 'rechazada' && parseInt(evento.resource_id) === selectedResource.id));
            const listadoFinal = eventosFiltrados.map((evento) => ({
                id: evento.id,
                start: evento.start_use,
                end: evento.end_use,
            }));
            setEventsList(listadoFinal);
        } else {
            setEventsList([])
        }
    }, [selectedResource]);

    const getNeighborhoodResourcesApplications = async (neighborhoodId) => {
        if (neighborhoodId) {
            const resourcesResponse = await get_resource_applications_by_neighborhood(neighborhoodId);
            const filteredResources = resourcesResponse.data.filter(item => item.application_type === 'recurso');
            if (filteredResources) {
                setExistingApplictionsList(filteredResources);
            }
        }
    };


    useEffect(() => {
        const getRegions = async () => {
            const responseData = await get_regions();
            setRegionsList(responseData);
        };
        getRegions();
    },[]);

    useEffect(() => {
        if (selectedContent === 3 && neighborhoodInfo.id) {
            getNeighborhoodResources(neighborhoodInfo.id);
            getNeighborhoodResourcesApplications(neighborhoodInfo.id);
        }
    }, [selectedContent]);

    useEffect(() => {
        if (selectedTimeSpan.endTime && selectedTimeSpan.startTime) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [selectedTimeSpan])

    const getNeighborhoodResources = async (neighborhoodId) => {
        if (neighborhoodId) {
            const resourcesResponse = await get_resources_by_neighborhood_id(neighborhoodId);
            console.log(resourcesResponse.data);
            if (resourcesResponse.data) {
                setResourcesList(resourcesResponse.data);
            }
        }
    };

    const handleResourceSubmit = () => {
        setIsSubmitDisabled(true);
        if (selectedTimeSpan.endTime && selectedTimeSpan.startTime) {
            const payload = {
                application:{
                    first_name: guestInfo.first_name,
                    second_name:  guestInfo.second_name,
                    last_name: guestInfo.last_name,
                    last_name_2: guestInfo.last_name_2,
                    email: guestInfo.email,
                    start_use: selectedTimeSpan.startTime,
                    end_use: selectedTimeSpan.endTime,
                    resource_id: selectedResource.id,
                    neighborhood_id: neighborhoodInfo.id,
                    rut: guestInfo.rut,
                    state: 'creada',
                    application_type: 'recurso'
                }   
            }
            try {

                const submitResourceRequest = async () => {
                    const response = await application_invited_resource_create(payload);
                    if (response.status === 200) {
                        toast.success('Respuesta enviada correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                        setGuestInfo(defaultGuestInfo);
                        setSelectedResource(null);
                        setNewEmail('');
                        setNewRut('');
                        setSelectedTimeSpan(defaultTimeSpan);
                    }
                };
                submitResourceRequest();
            } catch (error) {
                toast.error('Error al envíar', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
            }
        }
        setIsSubmitDisabled(false);
    };

    const handleResourceSelection = (e) => {
        const resourceId = e.target.value;
        const selected = resourcesList.find((resource) => resource.id === parseInt(resourceId));
        setSelectedResource(selected || null);
    };

    useEffect(() => {
        setActivitiesList(null);
        setNewsList(null);
        setNeighborhoodInfo({})
        setSelectedActivity(null);
        setShowJoinActivityForm(false);
        setActivityOpen(false);
        setNewRut('');
        setNewEmail('');
        setGuestInfo(defaultGuestInfo);
        setShowRefreshButton(false);
        setAddressForm(defaultAddressInfo);
    }, [refresh])

    const handleSelect = (selectInfo) => {
        const { startStr, endStr } = selectInfo;
        setSelectedTimeSpan({
            startTime: startStr,
            endTime: endStr,
        });
    };

    const handleSelectAllow = (selectInfo) => {
        const { startStr, endStr } = selectInfo;
        const startTime = new Date(startStr);
        const endTime = new Date(endStr);
        const durationInHours = (endTime - startTime) / (60 * 60 * 1000);
        if (!(durationInHours <= selectedResource.max_time)) {
            setSelectedTimeSpan(defaultTimeSpan);
            setIsConfirmButtonDisabled(true);
        } else {

            setIsConfirmButtonDisabled(false);
        }
        return durationInHours <= selectedResource.max_time;
    };

    useEffect(() => {
        if (guestForm.regionId) {
            const getCommues = async () => {
                const responseData = await get_communes_by_region(guestForm.regionId);
                setCommunesList(responseData);
            };
            getCommues();
        }
        handleGuestForm({
            ...guestForm,
            communeId: '',
            neighborhoodId: '',
        });
        setNeighborhoodsList([]);
        setRefresh(!refresh);
    }, [guestForm.regionId]);

    useEffect(() => {
        if (guestForm.communeId) {
            const getNeighborhoods = async () => {
                const responseData = await get_neighborhood_by_commune_id(guestForm.communeId);
                setNeighborhoodsList(responseData);
            };
            getNeighborhoods();
        }
        handleGuestForm({
            ...guestForm,
            neighborhoodId: '',
        });
        setRefresh(!refresh);
    }, [guestForm.communeId]);

    const handleSelectionChange = (e) => {
        if (e.target.name === 'neighborhood') {
            const selectedNeighborhood = JSON.parse(e.target.value);
            handleGuestForm({
                ...guestForm,
                neighborhoodId: selectedNeighborhood.id,
            })
            setNeighborhoodInfo(selectedNeighborhood);
            setRefreshInformation(!refreshInformation);
        } else {
            const { name, value } = e.target;
            handleGuestForm({
                ...guestForm,
                [name]: value
            });
        }
    };

    useEffect(() => {
        if (neighborhoodInfo.id) {
            const getNewsFromNeighborhood = async() => {
                const response = await get_announcements_by_neighborhood_id(neighborhoodInfo.id);
                setNewsList(response.data.reverse());
            };
            getNewsFromNeighborhood();
            getActivitiesFromNeighborhood();
            setShowRefreshButton(true);
        }
    }, [refreshInformation]);


    const getActivitiesFromNeighborhood = async() => {
        const response = await activities_get_by_neighborhood_id(neighborhoodInfo.id);
        setActivitiesList(response.data.reverse());
    }


    const joinActivity = async () => {
        if (guestInfo.email && guestInfo.first_name && guestInfo.last_name && guestInfo.last_name_2 && guestInfo.rut && selectedActivity.id) {
            const payload = {
                activity_id: selectedActivity.id,
                rut: guestInfo.rut,
                email: guestInfo.email,
                full_name: `${guestInfo.first_name} ${guestInfo.second_name} ${guestInfo.last_name} ${guestInfo.last_name_2}` 
            }
            try {

                const joinResponse = await activity_join(selectedActivity.id, payload);
                if (joinResponse.status === 201) {
                    toast.success('Se ha inscrito correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                    getActivitiesFromNeighborhood();
                    handleCancelJoin();
                    handleDialogClose();
                }
            } catch (error) {
                if (error?.response?.status === 422) {
                    toast.error('¡Usted ya está inscrito en esta actividad!', { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
                }
            }
        }
    };

    const handleRutChange = (event) => {
        let rutValue = event.target.value;
        rutValue = rutValue.replace(/[^0-9kK-]/g, '');
        setNewRut(rutValue);
    };

    useEffect(() => {
        if (validateRut(newRut)) {
            setGuestInfo({
                ...guestInfo,
                rut: newRut
            });
        } else {
            setGuestInfo({
                ...guestInfo,
                rut: ''
            });
        }
    }, [newRut]);

    const handleEmailChange = (event) => {
        let emailValue = event.target.value;
        setNewEmail(emailValue);
    };

    useEffect(() => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(emailPattern.test(newEmail)) {
            setGuestInfo({
                ...guestInfo,
                email: newEmail
            });
        } else {
            setGuestInfo({
                ...guestInfo,
                email: ''
            });
        }
    }, [newEmail]);

    const handleBack = () => {
        resetGuestForm()
        navigate('/');
    };

    const handleDialogOpen = (announcementSelection) => {
        setSelectedAnnouncement(announcementSelection)
        setOpen(true);
    };

    const handleActivityOpen = (activitySelection) => {
        setActivityOpen(true);
        setSelectedActivity(activitySelection);
    };



    const handleDialogClose = () => {
        setOpen(false);
        setActivityOpen(false);
        setSelectedAnnouncement(null);
        setSelectedActivity(null);
        setShowJoinActivityForm(false);
        setGuestInfo(defaultGuestInfo);
        setNewEmail('');
        setNewRut('');
        setOpenCalendar(false);
        setSelectedTimeSpan(defaultTimeSpan);
    };

    const handleConfirmSelection = () => {
        setOpenCalendar(false);
    };

    const handleActivityForm = () => {
        setShowJoinActivityForm(true);
    };

    const handleCancelJoin = () => {
        setGuestInfo(defaultGuestInfo);
        setNewEmail('');
        setNewRut('');
        setShowJoinActivityForm(false);
    };

    const handleCancelCertificate = () => {
        setSelectedContent(1);
        setGuestInfo(defaultGuestInfo);
        setAddressForm(defaultAddressInfo);
        selectedTimeSpan(defaultTimeSpan);
        setSelectedResource(null);
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];

        if (isFileValid(file)) {
            setAddressForm({
                ...addressForm,
                [field]: file,
            });
        } else {
            toast.error('El tamaño del archivo excede el límite de 5 MB', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
            console.error('El tamaño del archivo excede el límite de 5 MB');
        }
    };

    const isFileValid = (file) => {
        return file && file.size <= 5 * 1024 * 1024;
    };

    const handleCertificateSubmit = async (e) => {
        e.preventDefault();

        if (guestInfo.first_name && guestInfo.last_name && guestInfo.last_name_2 && guestInfo.rut && guestInfo.email 
            && addressForm.image_back && addressForm.image_face && addressForm.image_front && addressForm.image_invoice
            && addressForm.number_address && addressForm.numero_dpto && addressForm.street_address && guestForm.neighborhoodId && 
            guestForm.communeId) {

            console.log(guestInfo);
            const payload = {
                'application[rut]': guestInfo['rut'],
                'application[first_name]': guestInfo.first_name,
                'application[second_name]': guestInfo.second_name,
                'application[last_name]': guestInfo.last_name,
                'application[last_name_2]': guestInfo.last_name_2,
                'application[number_address]': `${addressForm['number_address']}, dpto./casa ${addressForm['numero_dpto']}`,
                'application[street_address]': addressForm['street_address'],
                'application[state]': 'creada',
                'image_url_1': addressForm['image_front'],
                'image_url_2': addressForm['image_back'],
                'image_url_3': addressForm['image_face'],
                'image_url_4': addressForm['image_invoice'],
                'application[commune_id]': guestForm['communeId'],
                'application[neighborhood_id]': guestForm.neighborhoodId,
                'application[email]': guestInfo['email'],
            }

            try {
                const response = await applications_guest_create_cert(payload);
                if (response.status === 201) {
                    toast.success('Solicitud de certificado enviada correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                    handleCancelCertificate();
                } else {
                    console.log("Hubo un problema al crear el usuario. Código de estado: " + response.status);
                }
            
            } catch (error) {
                console.log(error);
            }
        }
    };
    

    return (
        <div className='guest-page-wrapper'>
            <div>
                <div className='guest-header-wrapper'>
                    <div>
                        <IconButton aria-label="Volver al inicio" size='small' onClick={handleBack}>
                            <ArrowBackIosNewRoundedIcon />
                        </IconButton>
                    </div>
                    <div>
                    Region
                    <select 
                        name="regionId" 
                        id="region"
                        value={guestForm.regionId}
                        onChange={handleSelectionChange}
                    >
                        <option value="">-- Seleccione Región --</option>
                        {regionsList.map((region, index) => (
                            <option key={index} value={region.id}>
                                {region.region_name}
                            </option>))
                        }
                    </select>
                    Comuna
                    <select
                        name="communeId" 
                        id="commune"
                        onChange={handleSelectionChange}
                        value={guestForm.communeId}
                        disabled={guestForm.regionId ? false : true}
                    >
                        <option value="">-- Seleccione Comuna --</option>
                        {guestForm.regionId ? 
                        <>
                        {communesList.map((commune, index) => (
                            <option key={index} value={commune.id}>
                                {commune.commune_name}
                            </option>))
                        }
                        </>
                        : null}
                    </select>
                    Junta
                    <select 
                        name="neighborhood" 
                        id="neighborhood"
                        value={JSON.stringify(guestForm.neighborhood)} 
                        onChange={handleSelectionChange}
                        disabled={guestForm.communeId ? false : true}
                    >
                        <option value="">-- Seleccione su Junta --</option>
                        {guestForm.communeId ? 
                        <>
                        {neighborhoodsList.map((neighborhood, index) => (
                            <option key={index} value={JSON.stringify(neighborhood)}>
                                {neighborhood.name}
                            </option>))
                        }
                        </> 
                        :null}
                    </select>
                    
                    </div>
                    <IconButton disabled={!showRefreshButton} onClick={() => (setRefreshInformation(!refreshInformation))}>
                        <RefreshRounded />
                    </IconButton>
                </div>
            </div>
            <div className='guest-content-wrapper'>
                <Container maxWidth="xl">
                    {selectedContent === 1 ?
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <div className='guest-card'>
                                <div className='guest-card-header'>
                                    <h1>Anuncios</h1>
                                    <CampaignIcon />
                                </div>
                                
                                <div className='guest-card-content'>

                                
                                {newsList ? 
                                    <> 
                                    {newsList.length !== 0 && guestForm.neighborhoodId ? <>
                                        {newsList.map((announcement) => (
                                            <div key={announcement.id} className='news-card-guest' onClick={() => handleDialogOpen(announcement)}>
                                                {announcement.image_url ? 
                                                    <img
                                                        src={announcement.image_url}
                                                        alt={`Image for ${announcement.title}`}
                                                    />
                                                    :
                                                    null
                                                }
                                                {announcement.title ? 
                                                    <div className='card-content'>
                            
                                                        <h2>{announcement.title}</h2>
                                                        <div>
                                                            <p className="news-card-guest-content-text">{announcement.description}</p>
                                                            <p className='date-value-guest date-news-position'>Publicado el {formatearFecha(announcement.created_at)}</p>
                                                        
                                                        </div>
                                                    </div>
                                                    : null
                                                }
                                            </div>
                                        ))}</>
                                    : <p className='guest-helper-text'>No hay anuncios.</p>}
                                    </>
                                    : <p className='guest-helper-text'>Los anuncios de la junta de vecinos que selecciones apareceran aquí.</p>
                                }
                                </div>
                            </div>
                            <Dialog open={open} onClose={handleDialogClose}>
                                <DialogContent >
                                    <h1>{selectedAnnouncement?.title}</h1>
                                    <p className='date-value-guest'>Publicado el {formatearFecha(selectedAnnouncement?.created_at)}</p>
                                    {selectedAnnouncement?.created_at !== selectedAnnouncement?.updated_at ? 
                                    <p className='date-value-guest'>Editado el {formatearFecha(selectedAnnouncement?.updated_at)}</p>
                                    : null}
                                    <p style={{ marginBottom: '15px', marginTop: '15px' }}>{selectedAnnouncement?.description}</p>
                                    {selectedAnnouncement?.image_url ? <img src={selectedAnnouncement?.image_url} style={{ width: '100%'}} alt="imagen-de-anuncio" /> : null}   
                                </DialogContent>

                                <DialogActions>
                                    <Button size='small' onClick={handleDialogClose}>Cerrar</Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                        <Grid item xs={4}>
                            <div className='guest-card'>
                                <div className='guest-card-header'>
                                    <h1>Actividades</h1>
                                    <LocalActivityIcon />
                                </div>
                                <div className='guest-card-content'>
                                    {activitiesList ? 
                                        <> 
                                        {activitiesList.length !== 0 && guestForm.neighborhoodId ? <>
                                            {activitiesList.filter(activity => new Date(activity.start_date.slice(0, -1)) > currentDate).map((activity) => (
                                                <div key={activity.id} className='activities-card-guest' onClick={() => handleActivityOpen(activity)}>
                                                    <h2>{activity.title}</h2>
                                                    <div>
                                                        <p className="news-card-guest-content-text ">{activity.description}</p>
                                                        <p className='date-value-guest date-news-position'>Publicado el {formatearFecha(activity.created_at)}</p>
                                                        <p>Tipo: {activityTypes[activity.activity_type]}</p>
                                                        {activity.quota ?
                                                            <p><strong>Cupos disponibles: {activity.quota - activity.occupancy }</strong></p>
                                                        : <p><strong>Sin límite de cupos</strong></p>}
                                                    </div>
                                                </div>
                                            ))}</>
                                        : <p className='guest-helper-text'>No hay anuncios.</p>}
                                        </>
                                        : <p className='guest-helper-text'>Las actividades de la junta de vecinos que selecciones apareceran aquí.</p>
                                    }
                                </div>   
                            </div>
                            <Dialog open={activityOpen} onClose={handleDialogClose} >
                                {selectedActivity ? 
                                <DialogContent>
                                    <h1>{selectedActivity.title}</h1>
                                    <h2>Tipo: {activityTypes[selectedActivity.activity_type]}</h2>
                                    <p className='date-value'>Publicada el {formatearFecha(selectedActivity.created_at)}</p>
                                    <strong>Descripción</strong>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <p>{selectedActivity.description}</p>
                                        <p>Inicio: <strong>{formatearFecha(selectedActivity.start_date.slice(0, -1))}</strong></p>
                                        {selectedActivity.end_date ? 
                                        <p>Termino: <strong>{formatearFecha(selectedActivity.end_date.slice(0, -1))}</strong></p>
                                        : null}
                                        {selectedActivity.quota ? 
                                            <>
                                                <p>Cupos disponibles: <strong>{selectedActivity.quota - selectedActivity.occupancy}</strong></p>
                                            </>
                                        : null}
                                    </div>
                                    {showJoinActivityForm ? 
                                        <>
                                            <div className='reject-prompt-message-container'>
                                                <h3>Formulario de inscripción</h3>
                                                <p>Por favor ingrese los datos que se le indican a continuación:</p>
                                                <strong>Primer Nombre *</strong>
                                                <input type="text" maxLength={100} value={guestInfo.first_name} onChange={(e) => (setGuestInfo({...guestInfo, first_name: e.target.value}))} />
                                                <strong>Segundo Nombre (opcional)</strong>
                                                <input type="text" maxLength={100} value={guestInfo.second_name} onChange={(e) => (setGuestInfo({...guestInfo, second_name: e.target.value}))} />
                                                <strong>Primer Apellido *</strong>
                                                <input type="text" maxLength={100} value={guestInfo.last_name} onChange={(e) => (setGuestInfo({...guestInfo, last_name: e.target.value}))} />
                                                <strong>Segundo Apellido *</strong>
                                                <input type="text" maxLength={100} value={guestInfo.last_name_2} onChange={(e) => (setGuestInfo({...guestInfo, last_name_2: e.target.value}))} />
                                                <p><strong>Rut * </strong>(Sin puntos y con guión, ej: 12345678-9)</p>
                                                <input type="text" value={newRut} onChange={handleRutChange} />
                                                <strong>Email *</strong>
                                                <input type="email" value={newEmail} onChange={handleEmailChange}/>
                                                <p>Se te pedirá mostrar tu cedula de identidad al momento de acceder a la actividad</p>
                                            </div>
                                        </>
                                    :null}
                                </DialogContent>
                                :null}
                                <DialogActions>
                                    {showJoinActivityForm ? 
                                        <>
                                        <Button size='small' variant='outlined' onClick={handleCancelJoin}>Cancelar</Button>
                                        <Button 
                                            size='small' 
                                            variant='contained' 
                                            color='success'
                                            onClick={joinActivity}
                                            disabled={guestInfo.email && guestInfo.first_name && guestInfo.last_name && guestInfo.last_name_2 && guestInfo.rut ? false : true}
                                        >Enviar inscripción</Button>
                                        </>
                                    : <>
                                    {selectedActivity?.quota ? 
                                        <>
                                        {selectedActivity?.quota - selectedActivity?.occupancy > 0 ? <Button size='small' variant='contained' onClick={handleActivityForm} color='success'>Formulario de inscripción</Button>
                                        :null}
                                        </>
                                    :<Button size='small' variant='contained' onClick={handleActivityForm} color='success'>Formulario de inscripción</Button>}
                                    <Button size='small' onClick={handleDialogClose}>Cerrar</Button>
                                    </>}
                                </DialogActions>
                            </Dialog>
                        </Grid>
                        <Grid item xs={4}>
                            <div className='guest-card' style={{ marginBottom: '15px'}}>
                                <div className='guest-card-header'>
                                    <h1>Solicitudes</h1>
                                    <AssignmentIcon />
                                </div>
                                <div className='guest-card-content'>
                                    {guestForm.neighborhoodId ? 
                                        <>
                                            <Button variant='outlined' onClick={() => (setSelectedContent(2))}>Certificado de residencia</Button>
                                            <Button variant='outlined' onClick={() => (setSelectedContent(3))}>Implemento publico</Button>
                                        </>
                                    :<p className='guest-helper-text'>Las solicitudes disponibles de la junta que selecciones aparecerán aquí.</p>}
                                </div>
                            </div>
                            <GuestNeighborhoodInfo neighborhoodInfo={neighborhoodInfo} />
                        </Grid>
                    </Grid>
                    : 
                    <>
                    {selectedContent === 2 ?
                        <Grid container spacing={2} columns={{ xs: 3, sm: 5, md: 12 }}>

                            <Grid item xs={2} sm={3} md={8}>

                                <div className='guest-card'>
                                    <div className='guest-card-header'>
                                        <h1>Formulario de Solicitud de Certificado de Residencia</h1>
                                        <AssignmentIcon />
                                    </div>
                                    <div className='guest-card-content'>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                            <p>Por favor rellene el siguiente formulario con sus datos correspondientes, luego de envíar su solicitud, esta será resuelta por la directiva de su Junta de Vecinos y recibirá un correo con la respuesta pertinente al caso.</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                <strong>Primer Nombre *</strong>
                                                {/* <input type="text" /> */}
                                                <Input placeholder='Escriba aquí' type="text" maxLength={100} value={guestInfo.first_name} onChange={(e) => (setGuestInfo({...guestInfo, first_name: e.target.value}))}></Input>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                <strong>Segundo Nombre (opcional)</strong>
                                                <Input placeholder='Escriba aquí' type="text" maxLength={100} value={guestInfo.second_name} onChange={(e) => (setGuestInfo({...guestInfo, second_name: e.target.value}))}></Input>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                <strong>Primer Apellido *</strong>
                                                {/* <input type="text" /> */}
                                                <Input placeholder='Escriba aquí' type="text" maxLength={100} value={guestInfo.last_name} onChange={(e) => (setGuestInfo({...guestInfo, last_name: e.target.value}))}></Input>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                <strong>Segundo Apellido *</strong>
                                                <Input placeholder='Escriba aquí' type="text" maxLength={100} value={guestInfo.last_name_2} onChange={(e) => (setGuestInfo({...guestInfo, last_name_2: e.target.value}))}></Input>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>

                                                <strong>Rut *</strong>
                                                <div style={{ display: 'flex', gap: '15px'}}>
                                                    <Input placeholder='Ej: 12345678-9' value={newRut} onChange={handleRutChange}></Input>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>

                                                <strong>Dirección *</strong>
                                                <div style={{ display: 'flex', gap: '15px'}}>
                                                    <Input placeholder='Calle' type="text" maxLength={200} value={addressForm.street_address} onChange={(e) => (setAddressForm({...addressForm, street_address: e.target.value}))}></Input>
                                                    <Input placeholder='Número' type="text" maxLength={100} value={addressForm.number_address} onChange={(e) => (setAddressForm({...addressForm, number_address: e.target.value}))}></Input>
                                                    <Input placeholder='Nro. Dpto./Casa' type="text" maxLength={100} value={addressForm.numero_dpto} onChange={(e) => (setAddressForm({...addressForm, numero_dpto: e.target.value}))}></Input>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>

                                                <strong>Email *</strong>
                                                <div style={{ display: 'flex', gap: '15px'}}>
                                                    <Input type="email" value={newEmail} onChange={handleEmailChange} placeholder='ejemplo@mail.com'></Input>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                            
                                            <strong>Para poder verificarte frente a tu junta de vecinos necesitamos los siguientes documentos: </strong>
                                            <div className='register-combobox-container register-upload-file-container'>
                                                <label htmlFor="image-front">Foto carnet fontal *</label>
                                                <div>
                                                    <Button component="label" variant="contained" disableElevation color={ addressForm.image_front ? 'success' : 'primary' } size='small' startIcon={addressForm.image_front ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                                                        {addressForm.image_front ? 'Cargado' : 'Cargar imagen'}
                                                        <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_front')} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='register-combobox-container register-upload-file-container'>
                                                <label htmlFor="image-back">Foto carnet parte posterior *</label>
                                                <div>
                                                    <Button component="label" variant="contained" disableElevation color={ addressForm.image_back ? 'success' : 'primary' } size='small' startIcon={addressForm.image_back ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                                                        {addressForm.image_back ? 'Cargado' : 'Cargar imagen'}
                                                        <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_back')} />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='register-combobox-container register-upload-file-container'>
                                                <label htmlFor="image-invoice">Foto de una cuenta o contrato que muestre su dirección y Rut. *</label>
                                                <Button component="label" variant="contained" disableElevation color={ addressForm.image_invoice ? 'success' : 'primary' } size='small' startIcon={addressForm.image_invoice ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                                                    {addressForm.image_invoice ? 'Cargado' : 'Cargar imagen'}
                                                    <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_invoice')} />
                                                </Button>
                                            </div>
                                            <div className='register-combobox-container register-upload-file-container'>
                                                <label htmlFor="image-face">Foto de su rostro *</label>
                                                <Button component="label" variant="contained" disableElevation color={ addressForm.image_face ? 'success' : 'primary' } size='small' startIcon={addressForm.image_face ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                                                    {addressForm.image_face ? 'Cargado' : 'Cargar imagen'}
                                                    <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_face')} />
                                                </Button>
                                            </div>
                                            Formatos aceptados: JPG, JPEG o PNG - Tamaño maximo 5mb
                                        </div> 
                                        <div style={{ display: 'flex', justifyContent: 'end', gap: '10px'}}>
                                            <Button variant='contained' onClick={handleCancelCertificate} color='error'>Cancelar</Button>  
                                            <Button variant='contained' onClick={handleCertificateSubmit} endIcon={<SendRoundedIcon />}>Envíar Solicitud</Button>                           
                                        </div>
                                    </div>
                                
                                </div>
                            </Grid>
                            <Grid item xs={1} sm={2} md={4} >
                                <GuestNeighborhoodInfo neighborhoodInfo={neighborhoodInfo} />
                            </Grid>

                        </Grid>
                    : 
                        <>
                            {selectedContent === 3 ? 
                            <Grid container spacing={2} columns={{ xs: 3, sm: 5, md: 12 }}>
                                <Grid item xs={2} sm={3} md={8}>
                                    <div className='guest-card'>
                                        <div className='guest-card-header'>
                                            <h1>Formulario de Solicitud de Recursos e Implementos</h1>
                                            <AssignmentIcon />
                                        </div>
                                        <div className='guest-card-content'>

                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                    <strong>Primer Nombre *</strong>
                                                    {/* <input type="text" /> */}
                                                    <Input placeholder='Escriba aquí' type="text" maxLength={100} value={guestInfo.first_name} onChange={(e) => (setGuestInfo({...guestInfo, first_name: e.target.value}))}></Input>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                    <strong>Segundo Nombre (opcional)</strong>
                                                    <Input placeholder='Escriba aquí' type="text" maxLength={100} value={guestInfo.second_name} onChange={(e) => (setGuestInfo({...guestInfo, second_name: e.target.value}))}></Input>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                    <strong>Primer Apellido *</strong>
                                                    {/* <input type="text" /> */}
                                                    <Input placeholder='Escriba aquí' type="text" maxLength={100} value={guestInfo.last_name} onChange={(e) => (setGuestInfo({...guestInfo, last_name: e.target.value}))}></Input>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                    <strong>Segundo Apellido *</strong>
                                                    <Input placeholder='Escriba aquí' type="text" maxLength={100} value={guestInfo.last_name_2} onChange={(e) => (setGuestInfo({...guestInfo, last_name_2: e.target.value}))}></Input>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>

                                                    <strong>Rut *</strong>
                                                    <div style={{ display: 'flex', gap: '15px'}}>
                                                        <Input placeholder='Ej: 12345678-9' value={newRut} onChange={handleRutChange}></Input>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>

                                                    <strong>Email *</strong>
                                                    <div style={{ display: 'flex', gap: '15px'}}>
                                                        <Input type="email" value={newEmail} onChange={handleEmailChange} placeholder='ejemplo@mail.com'></Input>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>

                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                    <label><strong>Seleccione Recurso o Implemento</strong></label>
                                                    <select name="resource" id="resource" onClick={handleResourceSelection}>
                                                        <option value={selectedResource ? selectedResource.id : ''}>-- Seleccione --</option>
                                                        {resourcesList?.map((resource) => (
                                                            <option value={resource.id} key={resource.id}>{resource.name} - {resource.address}</option>
                                                        ))}

                                                    </select>
                                                
                                                    {selectedResource?.id ? 
                                                        <div style={{ border:"1px solid rgb(200, 200, 200)", padding: '10px', marginTop: '15px', borderRadius: '15px'}}>
                                                            <div style={{ marginBottom: '10px' }}>
                                                                <label><strong>Descripción</strong></label>
                                                                <p>{selectedResource?.description}</p>
                                                            </div>
                                                            <div style={{ marginBottom: '10px' }}>
                                                                <label><strong>Reglamento</strong></label>
                                                                <p>{selectedResource?.comment}</p>
                                                            </div>
                                                            <div style={{ marginBottom: '10px' }}>
                                                                <label><strong>Cuota Solidaria</strong></label>
                                                                {selectedResource.cuota ? 
                                                                <p>{parseFloat(selectedResource.cuota).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} pesos</p>
                                                                : <p>No tiene</p>}
                                                            </div>
                                                            <div style={{ fontSize: '.8rem'}}>
                                                                <p>Cualquier pago por la solicitud del recurso debe ser coordinado con el tesorero a cargo. Cuando un integrante de la directiva de tu junta de vecinos resuelva tu solicitud, recibiarás
                                                                un <strong>correo electronico</strong> con la respuesta a corde.</p>
                                                            </div>
                                                        </div>
                                                    :null}
                                                </div>
                                            </div>
                                        
                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                                    <label><strong>Seleccione Horario</strong></label>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                        <div className='project-creation-button-container' style={{ alignItems: 'start'}}>
                                                            <Button onClick={() => (setOpenCalendar(true))} variant='contained'>Ver horarios</Button>
                                                        </div>
                                                        {selectedTimeSpan.endTime && selectedTimeSpan.startTime ? 
                                                        <p style={{ backgroundColor: "#85abf4", width: 'fit-content', padding: '5px 15px', fontSize: '1.2rem', color: 'white', borderRadius: '100px'}}><strong>Día {new Date(selectedTimeSpan.startTime).toLocaleDateString('es-CL')}</strong> de <strong>{new Date(selectedTimeSpan.startTime).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong> a <strong>{new Date(selectedTimeSpan.endTime).toLocaleTimeString('es-CL', { hour: 'numeric', minute: 'numeric' })}</strong></p>
                                                        :null}
                                                    </div>
                                                </div>
                                            
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10%', margin: '5px 15px'}}>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'end', marginBottom: '10px'}}>
                                                    <div style={{ display: 'flex', justifyContent: 'end', gap: '10px'}}>
                                                        <Button variant='contained' onClick={handleCancelCertificate} color='error'>Cancelar</Button> 
                                                        <Button variant='contained' color='success' disabled={isSubmitDisabled} onClick={handleResourceSubmit} endIcon={<SendRoundedIcon />}>Solicitar</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={1} sm={2} md={4} >
                                    <GuestNeighborhoodInfo neighborhoodInfo={neighborhoodInfo} />
                                </Grid>
                            </Grid>
                            :null}
                        </>
                    }
                    </>}
                </Container>
            </div>
            <Dialog open={openCalendar} maxWidth={'md'} onClose={handleDialogClose}>
                <DialogTitle>
                    Horarios Disponibles
                    <p style={{ fontSize:"1rem"}}><strong>Tiempo maximo: {selectedResource?.max_time}h</strong></p>
                    <p style={{ fontSize:"1rem"}}><strong>Tiempo mínimo: {selectedResource?.min_time}h</strong></p>
                </DialogTitle>
                <DialogContent>
                {selectedResource ? 
                <>
                    <FullCalendar 
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView={'timeGridFourDay'}
                        headerToolbar={{start: 'title', center: 'timeGridFourDay,timeGridDay', end: 'today prev,next'}}
                        height={'auto'}
                        locale={esLocale}
                        nowIndicator
                        eventDisplay={'block'}
                        events={eventsList}
                        eventContent={renderEventContent}
                        // dateClick={handleDateClick}
                        businessHours= {{
                            daysOfWeek: convertirDiasANumeros(selectedResource.available_day), 
                            startTime: selectedResource.start_time,
                            endTime: selectedResource.end_time,
                        }}
                        views={ {
                            timeGridFourDay: {
                                type: 'timeGrid',
                                duration: { days: 5 },
                                buttonText: '5 Días',
                            }
                        }}
                        selectable= {true}
                        selectMirror= {true}
                        selectOverlap={false}
                        selectConstraint={
                            {
                                daysOfWeek: convertirDiasANumeros(selectedResource.available_day),
                                startTime: selectedResource.start_time,
                                endTime: selectedResource.end_time,
                                // duration: { hours: selectedResource.max_time }
                            }
                        }
                        validRange ={{
                            start: format(tomorrow, 'yyyy-MM-dd'),
                            end: format(maxEndDate, 'yyyy-MM-dd')
                          }}
                        select={handleSelect}
                        selectAllow={handleSelectAllow}
                    />
                </>
                :null}
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleDialogClose}>Cancelar</Button>
                    <Button variant='contained' onClick={handleConfirmSelection} disabled={isConfirmButtonDisabled} startIcon={<CheckCircleRoundedIcon />}>Confirmar Selección</Button>
                </DialogActions>
            </Dialog>

            
        </div>
    )
}

const renderEventContent = (eventInfo) => {

    const eventStyle = {
        backgroundColor: eventInfo.event.id ? '#FF0000' : '#00FF00',
        color: '#FFFFFF', // Color del texto
        borderRadius: '3px',
        padding: '5px',
        cursor: 'pointer',
    };
    
    if (eventInfo.event.id) {
        return (
            <div >
                <strong>{eventInfo.timeText}</strong>
                <p>No disponible</p>
            </div>
        );
    } else {
        return (
            <div>
                <strong>{eventInfo.timeText}</strong>
            </div>
        );
    }
};

export default GuestHome