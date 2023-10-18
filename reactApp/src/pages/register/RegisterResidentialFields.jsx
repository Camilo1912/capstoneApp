import React, { useEffect, useState } from 'react'
import { get_communes_by_region, get_regions } from '../../requests/Address'
import { get_neighborhood_by_commune_id } from '../../requests/Neighborhood';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';

const RegisterResidentialFields = () => {
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedNeighborhoodInfo, setSelectedNeighborhoodInfo] = useState({});

  useEffect(() => {
    const getRegions = async () => {
      try {
        const responseData = await get_regions();
        setRegions(responseData);
      } catch (error) {
        console.error("Error al obtener las regiones: ", error);
      }
    }

    getRegions();
  },[]);

  useEffect(() => {
    if (selectedRegion) {
      const getCommunes = async () => {
        try {
          const responseData = await get_communes_by_region(selectedRegion);
          setCommunes(responseData);
        } catch (error) {
          console.error("Error al obtener las comunas: ", error);
        }
      };
      getCommunes();
      setSelectedCommune('');
      setSelectedNeighborhood('');
      setSelectedNeighborhoodInfo({});
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedCommune) {
      const getNeighborhoods = async () => {
        try {
          const responseData = await get_neighborhood_by_commune_id(selectedCommune);
          setNeighborhoods(responseData);
        } catch (error) {
          console.error("Error al obtener las juntas de vecino: ", error);
        }
      };
      getNeighborhoods();
      setSelectedNeighborhood('');
      setSelectedNeighborhoodInfo({});
    }
  }, [selectedCommune]);

  useEffect(() => {
    if (selectedNeighborhood) {
      setSelectedNeighborhoodInfo(neighborhoods[selectedNeighborhood]);
    }
  }, [selectedNeighborhood]);

  useEffect(() => {
    if (selectedNeighborhoodInfo) {
    }
  }, [selectedNeighborhoodInfo]);

  const handleSelectedRegion = (event) => {
    setSelectedRegion(event.target.value)
  }

  const handleSelectedCommune = (event) => {
    setSelectedCommune(event.target.value);
  }

  const handleSelectedNeighborhood = (event) => {
    setSelectedNeighborhood(event.target.value);
  }

  return (
    <div className='registration-address-selection-container'>
      <div className='register-combobox-container'>

        <label htmlFor="region">Seleccione su región:</label>
        <select 
          name="region" 
          id="region" 
          value={selectedRegion} 
          onChange={handleSelectedRegion}>
          <option value="">-- Seleccione región --</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.region_name}
            </option>
          ))}
        </select>
      </div>
      {selectedRegion && (
        <div className='register-combobox-container'>
          <label htmlFor="commune">Seleccione una comuna:</label>
          <select
            id="commune"
            name="commune"
            value={selectedCommune}
            onChange={handleSelectedCommune}
          >
            <option key="" value="">
              -- Seleccione --
            </option>
            {communes.map((commune) => (
              <option key={commune.id} value={commune.id}>
                {commune.commune_name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedRegion && selectedCommune && (
        <div className='register-combobox-container'>
          <label htmlFor="neighborhood">Seleccione tu Junta de Vecinos</label>
          <select 
            name="neighborhood" 
            id="neighborhood"
            value={selectedNeighborhood}
            onChange={handleSelectedNeighborhood}
          >
            <option key="" value="">
              -- Seleccione --
            </option>
            {neighborhoods.map((neighborhood, index) => (
              <option key={index} value={index}>
                {neighborhood.name}
              </option>
            ))}

          </select>
        </div>
      )}
      {Object.keys(selectedNeighborhoodInfo).length ?
        <>
          <div className='neighborhood-info-card'>
            <div className='neighborhood-info-card-title-container'>
              <h1>Junta de Vecinos {selectedNeighborhoodInfo.name} </h1>
              <div>
                <PeopleAltRoundedIcon />
                {selectedNeighborhoodInfo.membership}
              </div>
              
            </div>
            
            <div className='registration-directive-card'>
              <h2>Directiva</h2>
              <p>Presidente: {selectedNeighborhoodInfo.president}</p>
              <p>Secretari@: {selectedNeighborhoodInfo.secretary}</p>
              <p>Tesorero: {selectedNeighborhoodInfo.treasurer}</p>
              <br />
              <p>Descripción: {selectedNeighborhoodInfo.description}</p>
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