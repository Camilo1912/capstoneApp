import React, { useEffect, useState } from 'react'
import { get_communes_by_region, get_regions } from '../../requests/Address'

const RegisterResidentialFields = () => {
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');

  useEffect(() => {
    const getRegions = async () => {
      try {
        const response = await get_regions();
        setRegions(response);
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
          const response = await get_communes_by_region(selectedRegion.id);
          setCommunes(response);
          console.log(response);
        } catch (error) {
          console.error("Error al obtener las comunas: ", error);
        }
      };
      getCommunes();
    }
  }, [selectedRegion])

  const handleSelectedRegion = (event) => {
    setSelectedRegion(event.target.value)
  }

  return (
    <>
      <label htmlFor="region">Seleccione su región:</label>
      <select 
        name="region" 
        id="region" 
        value={selectedRegion} 
        onChange={handleSelectedRegion}>
        <option value="">-- Seleccione región --</option>
        {regions.map((region) => (
          <option key={region.id} value={region.region_name}>
            {region.region_name}
          </option>
        ))}
      </select>
          <br />
      {selectedRegion && (
        <>
          <label htmlFor="commune">Seleccione una comuna:</label>
          <select
            id="commune"
            name="commune"
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
          >
            <option key="" value="">
              -- Seleccione --
            </option>
            {communes.map((commune) => (
              <option key={commune.id} value={commune.commune_name}>
                {commune.commune_name}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  )
}

export default RegisterResidentialFields