import React from 'react'
import { useEffect, useState, useContext } from 'react';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import { GuestContext } from '../../contexts/GuestContext';
import { get_communes_by_region, get_regions } from '../../requests/Address';
import { get_neighborhood_by_commune_id } from '../../requests/Neighborhood';
import { get_announcements_by_neighborhood_id } from '../../requests/News';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { formatearFecha } from '../../utils/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { activities_get_by_neighborhood_id } from '../../requests/Activities';
import CampaignIcon from '@mui/icons-material/Campaign';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import AssignmentIcon from '@mui/icons-material/Assignment';

const GuestHome = () => {
    const navigate = useNavigate();
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

    useEffect(() => {
        const getRegions = async () => {
            const responseData = await get_regions();
            setRegionsList(responseData);
        };
        getRegions();
    },[]);

    useEffect(() => {
        setActivitiesList(null);
        setNewsList(null);
        setNeighborhoodInfo({})
    }, [refresh])

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

            const getActivitiesFromNeighborhood = async() => {
                const response = await activities_get_by_neighborhood_id(neighborhoodInfo.id);
                setActivitiesList(response.data.reverse());
            }
            getNewsFromNeighborhood();
            getActivitiesFromNeighborhood();
        }
    }, [neighborhoodInfo]);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleRegisterRedirection = () => {
        navigate('/register');
    };

    const handleBack = () => {
        resetGuestForm()
        navigate('/');
    };

    const handleDialogOpen = (announcementSelection) => {
        setSelectedAnnouncement(announcementSelection)
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setSelectedAnnouncement(null);
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
                    <div></div>
                </div>
            </div>
            <div className='guest-content-wrapper'>
                <Container maxWidth="xl">
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
                                    <p className='date-value'>Publicado el {formatearFecha(selectedAnnouncement?.created_at)}</p>
                                    {selectedAnnouncement?.created_at !== selectedAnnouncement?.updated_at ? 
                                    <p className='date-value'>Editado el {formatearFecha(selectedAnnouncement?.updated_at)}</p>
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
                                            {activitiesList.map((activity) => (
                                                <div key={activity.id} className='activities-card-guest' onClick={() => handleDialogOpen(activity)}>
                                                    <h2>{activity.title}</h2>
                                                    <div>
                                                        <p className="news-card-guest-content-text">{activity.description}</p>
                                                        <p className='date-value date-news-position'>Publicado el {formatearFecha(activity.created_at)}</p>
                                                        <p>Actividad de {activity.activity_type}</p>
                                                        <p>Cupos: {activity.occupancy}/{activity.quota}</p>
                                                    </div>
                                                </div>
                                            ))}</>
                                        : <p className='guest-helper-text'>No hay anuncios.</p>}
                                        </>
                                        : <p className='guest-helper-text'>Las actividades de la junta de vecinos que selecciones apareceran aquí.</p>
                                    }
                                </div>   
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className='guest-card'>
                                <div className='guest-card-header'>
                                    <h1>Solicitudes</h1>
                                    <AssignmentIcon />
                                </div>
                                <div className='guest-card-content'>
                                    {guestForm.neighborhoodId ? 
                                        <>
                                            <Button variant='outlined'>Certificado de residencia</Button>
                                            <Button variant='outlined'>Implemento publico</Button>
                                        </>
                                    :<p className='guest-helper-text'>Las solicitudes disponibles de la junta que selecciones aparecerán aquí.</p>}
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>

            
        </div>
    )
}

export default GuestHome