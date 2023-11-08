import React, { useContext, useEffect, useState } from 'react';
import { get_communes_by_region, get_regions } from '../../requests/Address';
import { get_neighborhood_by_commune_id } from '../../requests/Neighborhood';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

const JvListAdmin = () => {
    
    const [regionsList, setRegionsList] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(0);
    const [communesList, setCommunesList] = useState([]);
    const [selectedCommune, setSelectedCommune] = useState('');
    const [neighborhoodsList, setNeighborhoodsList] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [neighborhoodInfo, setNeighborhoodInfo] = useState({});

    useEffect(() => {
        const getRegions = async () => {
            const responseData = await get_regions();
            setRegionsList(responseData);
        };
        getRegions();
    },[]);

    useEffect(() => {
        if (selectedRegion) {
            const getCommues = async () => {
                const responseData = await get_communes_by_region(selectedRegion);
                setCommunesList(responseData);
            };
            getCommues();
        }
        setCommunesList([]);
        setNeighborhoodsList([]);
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedCommune) {
            const getNeighborhoods = async () => {
                const responseData = await get_neighborhood_by_commune_id(selectedCommune);
                setNeighborhoodsList(responseData);
                console.log(responseData);
            };
            getNeighborhoods();
        } else {
            setNeighborhoodsList([]);
        }
    }, [selectedCommune]);

    // useEffect(() => {
    //     const updatedNeighborhoodList = JSON.stringify(neighborhoodsList);
    //     setNeighborhoodsList(updatedNeighborhoodList);
    // }, [neighborhoodsList]);

    const handleSelectedNeighborhood = (e) => {
        const selectedNeighborhood = JSON.parse(e.target.value);
        setNeighborhoodInfo(selectedNeighborhood);
    };

    const handleSelectionChange = (e) => {
        if (e.target.name === 'neighborhood') {
            const neighborhoodSelection = JSON.parse(e.target.value);
            setNeighborhoodInfo(neighborhoodSelection);
        } else if (e.target.name === 'regionId') {
            setSelectedRegion(e.target.value);
        } else if (e.target.name === 'communeId') {
            setSelectedCommune(e.target.value);
        } 
    };

    const handleJvSelection = (e) => {
        console.log("hole", e.target.value);
    };

    return (
        <div className='admin-jv-selection-container'>
            <h1>Buscar Junta de Vecino</h1>
            <div className='jv-search-combobox-container'>
                <label htmlFor="region">Seleccione región:</label>
                <select 
                name="regionId" 
                id="region" 
                value={selectedRegion} 
                onChange={handleSelectionChange}>
                <option value="">-- Seleccione región --</option>
                {regionsList.map((region, index) => (
                    <option key={index} value={region.id}>
                        {region.region_name}
                    </option>))
                }
                </select>
            </div>
            { selectedRegion ? 
                <div className='jv-search-combobox-container'>
                    <label htmlFor="commune">Seleccione comuna:</label>
                    <select 
                    name="communeId" 
                    id="commune" 
                    value={selectedCommune} 
                    onChange={handleSelectionChange}>
                    <option value="">-- Seleccione comuna --</option>
                    {communesList.map((commune, index) => (
                        <option key={index} value={commune.id}>
                            {commune.commune_name}
                        </option>))
                    }
                    </select>
                </div>
                : <></>
            }
            <div className='jv-list-wrapper'>
                {neighborhoodsList.length !== 0 && communesList ? neighborhoodsList.map((neighborhood) => (
                    <div className='neighborhood-list-info-card' key={neighborhood.id}>
                        <div className='neighborhood-info-card-title-wrapper'>
                            <h1>ID:{neighborhood.id} | Junta de Vecinos {neighborhood.name} </h1>
                            <div>
                                <PeopleAltRoundedIcon />
                                {neighborhood.membership}
                            </div>
                        </div>
                        
                        <div id='jv-content'>
                            <div className='registration-directive-card'>
                                <h2>Directiva</h2>
                                <p>Presidente: {neighborhood.president}</p>
                                <p>Secretari@: {neighborhood.secretary}</p>
                                <p>Tesorero: {neighborhood.treasurer}</p>
                            </div>
                            
                            <div>
                                <p>{neighborhood.description}</p>
                            </div>
                        </div>
                    </div>
                )): <p className='list-feedback'>Listado vacío</p>}
            </div>
        </div>
    )
}

export default JvListAdmin