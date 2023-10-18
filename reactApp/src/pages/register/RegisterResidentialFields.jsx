import React, { useContext, useEffect, useState } from 'react';
import { RegistrationContext } from '../../contexts/RegitrationContext';
import { get_communes_by_region, get_regions } from '../../requests/Address';
import { get_neighborhood_by_commune_id } from '../../requests/Neighborhood';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

const RegisterResidentialFields = () => {
    const { registrationForm, handleRegistrationForm } = useContext(RegistrationContext);
    const [regionsList, setRegionsList] = useState([]);
    const [communesList, setCommunesList] = useState([]);
    const [neighborhoodsList, setNeighborhoodsList] = useState([]);
    const [neighborhoodInfo, setNeighborhoodInfo] = useState({});

    useEffect(() => {
        const getRegions = async () => {
            const responseData = await get_regions();
            setRegionsList(responseData);
        };
        getRegions();
    },[]);

    useEffect(() => {
        if (registrationForm.regionId) {
            const getCommues = async () => {
                const responseData = await get_communes_by_region(registrationForm.regionId);
                setCommunesList(responseData);
            };
            getCommues();
        }
        handleRegistrationForm({
            ...registrationForm,
            communeId: '',
            neighborhoodId: '',
        });
        setNeighborhoodsList([]);
    }, [registrationForm.regionId]);

    useEffect(() => {
        if (registrationForm.communeId) {
            const getNeighborhoods = async () => {
                const responseData = await get_neighborhood_by_commune_id(registrationForm.communeId);
                setNeighborhoodsList(responseData);
            };
            getNeighborhoods();
        }
        handleRegistrationForm({
            ...registrationForm,
            neighborhoodId: '',
        });
    }, [registrationForm.communeId]);

    // useEffect(() => {
    //     if (registrationForm.neighborhoodId) {
    //     }
    // }, [registrationForm.neighborhoodId]);


    const handleSelectedRegion = (e) => {
        handleRegistrationForm({
            ...registrationForm,
            regionId: e.target.value,
        })
    };

    const handleSelectedCommune = (e) => {
        handleRegistrationForm({
            ...registrationForm,
            communeId: e.target.value,
        })
    };

    const handleSelectedNeighborhood = (e) => {
        const selectedNeighborhood = JSON.parse(e.target.value);
        handleRegistrationForm({
            ...registrationForm,
            neighborhoodId: selectedNeighborhood.id,
        })
        setNeighborhoodInfo(selectedNeighborhood);
    };

    return (
        <div className='registration-address-selection-container'>
            <strong>Busque la junta de vecinos a la que desee pertenecer.</strong>
            <div className='register-combobox-container'>
                <label htmlFor="region">Seleccione su región:</label>
                <select 
                name="region" 
                id="region" 
                value={registrationForm.regionId} 
                onChange={handleSelectedRegion}>
                <option value="">-- Seleccione región --</option>
                {regionsList.map((region, index) => (
                    <option key={index} value={region.id}>
                        {region.region_name}
                    </option>))
                }
                </select>
            </div>
            { registrationForm.regionId ? 
                <div className='register-combobox-container'>
                    <label htmlFor="commune">Seleccione una comuna:</label>
                    <select 
                    name="commune" 
                    id="commune" 
                    value={registrationForm.communeId} 
                    onChange={handleSelectedCommune}>
                    <option value="">-- Seleccione comuna --</option>
                    {communesList.map((commune, index) => (
                        <option key={index} value={commune.id}>
                            {commune.commune_name}
                        </option>))
                    }
                    </select>
                </div>
                : 
                <></>
            }
            { registrationForm.communeId ? 
                <div className='register-combobox-container'>
                    <label htmlFor="neighborhood">Seleccione tu Junta de Vecinos</label>
                    <select 
                    name="neighborhood" 
                    id="neighborhood" 
                    value={JSON.stringify(registrationForm.neighborhood)} 
                    onChange={handleSelectedNeighborhood}>
                    <option value="">-- Seleccione Junta de Vecinos --</option>
                    {neighborhoodsList.map((neighborhood, index) => (
                        <option key={index} value={JSON.stringify(neighborhood)}>
                            {neighborhood.name}
                        </option>))
                    }
                    </select>
                </div>
                :
                <></>
            }

            {Object.keys(neighborhoodInfo).length && registrationForm.neighborhoodId ?
                <>
                <div className='neighborhood-info-card'>
                    <div className='neighborhood-info-card-title-container'>
                    <h1>Junta de Vecinos {neighborhoodInfo.name} </h1>
                    <div>
                        <PeopleAltRoundedIcon />
                        {neighborhoodInfo.membership}
                    </div>
                    
                    </div>
                    
                    <div className='registration-directive-card'>
                    <h2>Directiva</h2>
                    <p>Presidente: {neighborhoodInfo.president}</p>
                    <p>Secretari@: {neighborhoodInfo.secretary}</p>
                    <p>Tesorero: {neighborhoodInfo.treasurer}</p>
                    <br />
                    <p>Descripción: {neighborhoodInfo.description}</p>
                    </div>
                    
                </div>
                </>
                :
                <>
                </>
            }
        </div>
    )
}

export default RegisterResidentialFields