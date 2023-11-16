import React from 'react'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

const GuestNeighborhoodInfo = ({neighborhoodInfo}) => {

  return (
    <div className='guest-card'>
        <div className='guest-card-header'>
            <h1>Información de la junta</h1>
            <InfoRoundedIcon />
        </div>
        <div className='guest-card-content'>
            {neighborhoodInfo.id ? 
                <div>
                    <p>Junta de vecinos {neighborhoodInfo.name}</p>
                    <p>Integrantes: {neighborhoodInfo.membership}</p>
                    <strong>Directiva</strong>
                    <div className='guest-directive-info'>
                        <p>Presidente: {neighborhoodInfo.president}</p>
                        <p>Secretario: {neighborhoodInfo.secretary}</p>
                        <p>Tesorero: {neighborhoodInfo.treasurer}</p>
                    </div>
                    <strong>Dirección</strong>
                    <div className='guest-directive-info'>
                        <p>{neighborhoodInfo.address}</p>
                    </div>
                    <strong>Contacto</strong>
                    <div className='guest-directive-info'>
                        <p>{neighborhoodInfo.bank_acc_email}</p>
                    </div>
                    {neighborhoodInfo.quota ? 
                    <>
                        <strong>Cuota</strong>
                        <div className='guest-directive-info'>
                            <p>${neighborhoodInfo.quota}/mes</p>
                        </div>
                    </>: null}
                </div>
            :<p className='guest-helper-text'>La información de la junta que selecciones aparecerá aquí.</p>}
        </div>
    </div>
)
}

export default GuestNeighborhoodInfo