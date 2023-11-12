import React from 'react'
import { useEffect, useState, useContext } from 'react';
import GuestContent from './GuestContent'
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


const GuestHome = () => {
    const navigate = useNavigate();
    const { guestForm, handleGuestForm } = useContext(GuestContext);
    const [value, setValue] = React.useState(0);
    const [regionsList, setRegionsList] = useState([]);
    const [communesList, setCommunesList] = useState([]);
    const [neighborhoodsList, setNeighborhoodsList] = useState([]);
    const [neighborhoodInfo, setNeighborhoodInfo] = useState({});
    const [newsList, setNewsList] = useState(null);

    useEffect(() => {
        const getRegions = async () => {
            const responseData = await get_regions();
            setRegionsList(responseData);
        };
        getRegions();
    },[]);

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
                setNewsList(response);
            };
            getNewsFromNeighborhood();
        }
    }, [neighborhoodInfo]);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleRegisterRedirection = () => {
        navigate('/register');
    };

    return (
        <div className='guest-page-wrapper'>
            <div className='guest-header-wrapper'>
                <div>

                    <div>
                        <IconButton aria-label="Volver al inicio" size='small' onClick={() => {navigate('/')}}>
                            <ArrowBackIosNewRoundedIcon />
                        </IconButton>
                    </div>
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
                    /
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
                    /
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
                <Button 
                    type='submit'
                    variant="outlined"
                    size='small'
                    onClick={handleRegisterRedirection}
                    endIcon={<LoginIcon />}
                >
                    Registrarse
                </Button>
            </div>
            <div className='guest-content-wrapper'>
                <Container maxWidth="xl">
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <div className='guest-card'>
                                <h1>Anuncios</h1>
                                {newsList ? 
                                    <>
                                    {newsList.map((announcement) => (
                                        <div key={announcement.id} className='news-card-guest' onClick={() => handleDialogOpen(news)}>
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
                                                    {/* <p className='date-value date-news-position'>Publicado el {formatearFecha(announcement.created_at)}</p> */}
                                                    </div>
                                                </div>
                                                : null
                                            }
                                        </div>
                                    ))}
                                    </>
                                    : <p className='guest-helper-text'>Los anuncios de la junta de vecinos que selecciones apareceran aquí.</p>
                                }   
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className='guest-card'>
                                <h1>Actividades</h1>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className='guest-card'>
                                <h1>Solicitudes</h1>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>

            
        </div>
    )
}

export default GuestHome