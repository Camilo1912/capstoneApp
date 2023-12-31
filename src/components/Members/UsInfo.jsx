import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { get_neighborhood_by_id } from '../../requests/Neighborhood';
import { formatearFecha } from '../../utils/utils';

const UsInfo = () => {
    const { userInfo, handleUserInfo } = useContext(UserContext);
    const neighborhoodId = userInfo.neighborhood.neighborhood_id;
    const [neighborhoodData, setNeighborhoodData] = useState(null);

    useEffect(() => {
        if (!neighborhoodData) {
            const getNeighborhood = async () => {
                const neighborhoodResponse = await get_neighborhood_by_id(neighborhoodId);
                setNeighborhoodData(neighborhoodResponse.data);
            }
            getNeighborhood();
        }
    }, [neighborhoodId]);

    return (
        <div className='neighborhood-info-detail-container'>
            { neighborhoodData? 
                <>
                    <div className='neighborhood-info-header-container'>
                        {neighborhoodData.logo_url ? 
                        <img src={neighborhoodData.logo_url} width='120px' height='120px' alt="jv-logo" /> : null
                        }
                        <div>
                            <h1>Junta de vecinos {neighborhoodData.name}</h1>
                            <p>Código legal: {neighborhoodData.jv_code}</p>
                            <p>Creada el {formatearFecha(neighborhoodData.created_at)}</p>
                        </div>
                    </div>
                    <div>
                        <h2>Descripción</h2>
                        <p>{neighborhoodData.description}</p>
                    </div>
                    <div>
                        <h2>Directiva</h2>
                        <p>Presidente: <strong>{neighborhoodData.president}</strong></p>
                        <p>Secretario: <strong>{neighborhoodData.secretary}</strong></p>
                        <p>Tesorero: <strong>{neighborhoodData.treasurer}</strong></p>
                    </div>
                    <div>
                        <h2>Contacto</h2>
                        <p>Correo electrónico: <strong>{neighborhoodData.bank_acc_email}</strong></p>
                    </div>
                    <div>
                        <h2>Dirección</h2>
                        <p>{neighborhoodData.address} /Comuna {userInfo.commune.commune_name} / Región {userInfo.region.region_name}</p>
                    </div>
                    <div>
                        <h2>Datos Bancarios</h2>
                        <strong>{neighborhoodData.quota}</strong>
                        <p>Nombre: {neighborhoodData.bank_acc_name}</p>
                        <p>Rut: {neighborhoodData.bank_acc_rut}</p>
                        <p>Banco: {neighborhoodData.bank_name}</p>
                        <p>Tipo de cuenta: {neighborhoodData.bank_acc_type}</p>
                        <p>Numero de cuenta: {neighborhoodData.bank_acc_number}</p>
                        <p>Email: {neighborhoodData.bank_acc_email}</p>
                    </div>
                </>
                :
                <>No se pudo cargar la información</>
            }
        </div>
    )
}

export default UsInfo
