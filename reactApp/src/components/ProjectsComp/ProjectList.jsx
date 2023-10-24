import React, { useEffect, useState } from 'react'
import { get_projects } from '../../requests/Projects';
import { projectStates, projectTypes } from '../../utils/data';

import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import Diversity2RoundedIcon from '@mui/icons-material/Diversity2Rounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import HowToVoteRoundedIcon from '@mui/icons-material/HowToVoteRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';

const ProjectList = () => {
    const [projectsList, setProjectsList] = useState([]);

    useEffect(() => {
        
        if (projectsList) {
            const getProjects = async () => {
                const responseData = await get_projects();
                setProjectsList(responseData);
            };
            getProjects();
        }
    }, []);

    return (
        <div className='projects-list-container'>
            {projectsList.map((proyecto, index) => (
                <div className='project-card'>
                    {/* <li key={index}> */}
                        <div className='project-state-indicator'>
                            <h1>{proyecto.title}</h1>
                            <div className='project-status-icon-container'>
                                <div>
                                    { proyecto.project_type === 'MI' ? <ConstructionRoundedIcon fontSize="small"/> :
                                    proyecto.project_type === 'PSC' ? <Diversity2RoundedIcon fontSize="small"/> : 
                                    proyecto.project_type === 'SP' ? <SecurityRoundedIcon fontSize="small"/> :
                                    proyecto.project_type === 'MA' ? <ForestRoundedIcon fontSize="small"/> :
                                    proyecto.project_type === 'DEL' ? <MonetizationOnRoundedIcon fontSize="small"/> :
                                    proyecto.project_type === 'PC' ? <HowToVoteRoundedIcon fontSize="small"/> :
                                    proyecto.project_type === 'PV' ? <HomeWorkRoundedIcon fontSize="small"/> :
                                    proyecto.project_type === 'PS' ? <LocalHospitalRoundedIcon fontSize="small"/> :
                                    <>na</>
                                    }
                                </div>
                                <p>{projectStates[proyecto.project_state_id]}</p>
                            </div>
                        </div>
                        <p>{proyecto.description}</p>
                        <label>Presupuesto: </label>
                        ${proyecto.budget_min} a ${proyecto.budget_max}
                        <br />
                        <label>Tipo de proyecto: </label>
                        {projectTypes[proyecto.project_type]}
                    {/* </li> */}
                </div>
            ))}
        </div>
    )
}

export default ProjectList