import React, { useEffect, useState } from 'react'
import { get_projects } from '../../requests/Projects';

const ProjectList = () => {
    const [projectsList, setProjectsList] = useState([]);

    useEffect(() => {
        const getProjects = async () => {
            const responseData = await get_projects();
            setProjectsList(responseData);
        };
        getProjects();
    }, []);

    useEffect(() => {
        console.log(projectsList);
    }, [projectsList])

    return (
        <div className='projects-list-container'>
            {projectsList.map((proyecto, index) => (
                <div className='project-card'>
                    {/* <li key={index}> */}
                        <h1>{proyecto.title}</h1>
                        <p>{proyecto.description}</p>
                        <label>Presupuesto: </label>
                        ${proyecto.budget_min} a ${proyecto.budget_max}
                        <br />
                        <label>Estado: </label>
                        {proyecto.state}
                        <br />
                        <label>Tipo de proyecto: </label>
                        {proyecto.project_type}
                    {/* </li> */}
                </div>
            ))}
        </div>
    )
}

export default ProjectList