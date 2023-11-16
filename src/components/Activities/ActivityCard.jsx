import React from 'react'
import { formatearFecha, initCap } from '../../utils/utils'
import { activityTypes } from '../../utils/data'

const ActivityCard = ({activity, userInfo}) => {
    return (
        <>
            <div className='application-card-header'><strong>{initCap(activity.title)}</strong> {formatearFecha(activity.start_date.slice(0, -1))}</div>
            <div className='application-card-content'>
                <p className='activities-card-content-text'>{activity.description}</p>
                <p>Tipo de actividad: <strong>{activity.activity_type ? activityTypes[activity.activity_type] : <>No especificado</>}</strong></p>
                {activity.quota ? 
                <>{[2, 3, 4].includes(userInfo.role.role_id) ? 
                    <p>Inscritos: <strong>{activity.occupancy}/{activity.quota}</strong></p>
                    :<p>Cupos: <strong>{activity.quota - activity.occupancy }</strong></p>}</>
                    : <p>Cupos: <strong>Sin límite</strong></p>}
                <p>{activity.isRegistered ? <strong>Estas inscrito</strong>: null}</p>
            </div>
        </>
    )
}

export default ActivityCard