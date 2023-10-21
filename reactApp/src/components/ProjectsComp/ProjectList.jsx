import React from 'react'
import { projectTypes } from '../../utils/data'

const ProjectList = () => {

    const proyectosEjemplos = [
        {
            'title': 'Propuesta de reciclaje',
            'description': 'Sería buena idéa crear un punto de reciclaje donde los vecinos puedan llevar sus residuos como vidrio, plasticos o cartones.',
            'state': 'PROPUESTO',
            'type': 'MA',
            'presupuesto_min': '500000',
            'presupuesto_max': '1000000',
            'created_at': '15-10-2023',
            'updated_at': '15-10-2023'
        },
        {
            'title': 'Propuesta de reciclaje 1',
            'description': 'Sería buena idéa crear un punto de reciclaje donde los vecinos puedan llevar sus residuos como vidrio, plásticos o cartones.',
            'state': 'PROPUESTO',
            'type': 'MA',
            'presupuesto_min': '500000',
            'presupuesto_max': '1000000',
            'created_at': '15-10-2023',
            'updated_at': '15-10-2023'
        },
        {
            'title': 'Propuesta de reciclaje 2',
            'description': 'Sería buena idéa crear un punto de reciclaje donde los vecinos puedan llevar sus residuos como vidrio, plásticos o cartones.',
            'state': 'PROPUESTO',
            'type': 'MA',
            'presupuesto_min': '500000',
            'presupuesto_max': '1000000',
            'created_at': '15-10-2023',
            'updated_at': '15-10-2023'
        },
        {
            'title': 'Propuesta de reciclaje 3',
            'description': 'Sería buena idéa crear un punto de reciclaje donde los vecinos puedan llevar sus residuos como vidrio, plásticos o cartones.',
            'state': 'PROPUESTO',
            'type': 'MA',
            'presupuesto_min': '500000',
            'presupuesto_max': '1000000',
            'created_at': '15-10-2023',
            'updated_at': '15-10-2023'
        },
        {
            'title': 'Propuesta de reciclaje 4',
            'description': 'Sería buena idéa crear un punto de reciclaje donde los vecinos puedan llevar sus residuos como vidrio, plásticos o cartones.',
            'state': 'PROPUESTO',
            'type': 'MA',
            'presupuesto_min': '500000',
            'presupuesto_max': '1000000',
            'created_at': '15-10-2023',
            'updated_at': '15-10-2023'
        }
    ]


  return (
    <>
        <div>ProjectList</div>
        {proyectosEjemplos.map((proyecto, index) => (
            <li key={index}>
                <h1>{proyecto.title}</h1>
                <p>{proyecto.description}</p>
                <label>Presupuesto: </label>
                ${proyecto.presupuesto_min} a ${proyecto.presupuesto_max}
                <br />
                <label>Estado: </label>
                {proyecto.state}
                <br />
                <label>Tipo de proyecto: </label>
                {projectTypes[proyecto.type]}
            </li>
        ))}
    </>
  )
}

export default ProjectList