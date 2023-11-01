import React, { useContext, useEffect, useState } from 'react'
import { get_projects_by_neighborhood_id } from '../../requests/Projects';
import { get_user_by_id } from '../../requests/User';
import { projectStates, projectTypes } from '../../utils/data';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import Diversity2RoundedIcon from '@mui/icons-material/Diversity2Rounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import HowToVoteRoundedIcon from '@mui/icons-material/HowToVoteRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import ForestRoundedIcon from '@mui/icons-material/ForestRounded';
import { UserContext } from '../../contexts/UserContext';
import { formatearFecha, formatTextBr } from '../../utils/utils';
import PollCreationForm from '../Polls/PollCreationForm';

const ProjectList = () => {
    const [open, setOpen] = useState(false);
    const [projectsList, setProjectsList] = useState([]);
    const { userInfo, handleUserInfo } = useContext(UserContext);
    const neighborhood = userInfo.neighborhood.neighborhood_id;
    const [selectedProjectInfo, setSelectedProjectInfo] = useState({});
    const [selectedProjectUserInfo, setSelectedProjectUserInfo] = useState({});
    const [showPollCreationForm, setShowPollCreationForm] = useState(false);

    const completedStep = {
        color: 'white',
        backgroundColor: '#7f7fff',
    };

    useEffect(() => {
        if (projectsList) {
            const getProjects = async () => {
                const responseData = await get_projects_by_neighborhood_id(neighborhood);
                setProjectsList(responseData.reverse());
            };
            getProjects();
        }
    }, []);

    useEffect(() => {
        if (selectedProjectInfo) {
            const newDate = formatearFecha(selectedProjectInfo.updated_at);
            getPostUser();
        }
    }, [selectedProjectInfo]);

    const getPostUser = async () => {
        console.log(selectedProjectInfo);
        if (selectedProjectInfo?.neighbor_id) {
            const postUserData = await get_user_by_id(selectedProjectInfo.neighbor_id);
            setSelectedProjectUserInfo(postUserData);
        }
    };

    const handleClickOpen = (project) => {
        setOpen(true);
        setSelectedProjectInfo(project);
        console.log(project);
    };

    const handleClose = () => {
        setShowPollCreationForm(false);
        setOpen(false);
    };

    const handleClickCreatePoll = () => {
        setShowPollCreationForm(true);
    };

    const updateShowPollCreationForm = (data) => {
        setShowPollCreationForm(data);
    };


    return (
        <div className='projects-list-container'>
            {projectsList.map((proyecto) => (
                <div className='project-card' key={proyecto.id} onClick={() => handleClickOpen(proyecto)}>
                    <div className='project-state-indicator'>
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
                            <h1>{proyecto.title}</h1>
                        </div>
                        
                        <p>{projectStates[proyecto.project_state_id]}</p>
                        
                    </div>
                    <p>{proyecto.description}</p>
                    <label>Presupuesto: </label>
                    ${proyecto.budget_min.toLocaleString()} a ${proyecto.budget_max.toLocaleString()}
                    <br />
                    <label>Tipo de proyecto: </label>
                    {projectTypes[proyecto.project_type]}
                </div>
            ))}
        

            <Dialog open={open} onClose={handleClose}>
                <DialogContent >
                    {showPollCreationForm ? <PollCreationForm projectId={selectedProjectInfo.id} updateShowParent={updateShowPollCreationForm}/> :
                    <div className='project-popup-card'>
                        <div className='project-detail-wrapper'>
                            <div id='project-image-example'></div>
                            <div className='project-detail-info-wrapper'>
                                <div className='project-detail-title-container'>
                                    <h1>{selectedProjectInfo.title}</h1>
                                    <IconButton color="primary" aria-label="add to shopping cart">
                                        <EditRoundedIcon />
                                    </IconButton>
                                </div>
                                <div className='project-type-icon'>
                                    { selectedProjectInfo.project_type === 'MI' ? <ConstructionRoundedIcon /> :
                                    selectedProjectInfo.project_type === 'PSC' ? <Diversity2RoundedIcon /> : 
                                    selectedProjectInfo.project_type === 'SP' ? <SecurityRoundedIcon fontSize='large'/> :
                                    selectedProjectInfo.project_type === 'MA' ? <ForestRoundedIcon /> :
                                    selectedProjectInfo.project_type === 'DEL' ? <MonetizationOnRoundedIcon /> :
                                    selectedProjectInfo.project_type === 'PC' ? <HowToVoteRoundedIcon /> :
                                    selectedProjectInfo.project_type === 'PV' ? <HomeWorkRoundedIcon /> :
                                    selectedProjectInfo.project_type === 'PS' ? <LocalHospitalRoundedIcon /> :
                                    <>na</>
                                    }
                                </div>
                                <div>
                                    <p>Propuesta de <strong>{projectTypes[selectedProjectInfo.project_type]}</strong></p>
                                    <p>Posteado por <strong>{selectedProjectUserInfo.first_name} {selectedProjectUserInfo.last_name} {selectedProjectUserInfo.last_name_2}</strong></p>
                                </div>
                                
                                <div>
                                    <label htmlFor="fecha-creado">Fecha de creación</label>
                                    <p>{selectedProjectInfo?.neighbor_id ? formatearFecha(selectedProjectInfo.created_at) : null}</p>
                                </div>
                                <div>
                                    <label htmlFor="fecha-actualizado">Última Actualización:</label>
                                    <p>{selectedProjectInfo?.neighbor_id ? formatearFecha(selectedProjectInfo.updated_at) : null}</p>
                                </div>
                                
                            </div>
                            
                        </div>
                        <label htmlFor="descripcion">Descripción</label>
                        <div className='project-detail-description-container'>
                            <p>{selectedProjectInfo?.description ? selectedProjectInfo.description: null}</p>
                        </div>
                        <div className='project-step-indicator-container'>
                            <p style={selectedProjectInfo.project_state_id >= 1 ? completedStep : null}>Propuesto</p>
                            <p style={selectedProjectInfo.project_state_id >= 2 ? completedStep : null}>Votado</p>
                            <p style={selectedProjectInfo.project_state_id >= 3 ? completedStep : null}>Aprobado</p>
                            <p style={selectedProjectInfo.project_state_id >= 4 ? completedStep : null}>En ejecución</p>
                            <p style={selectedProjectInfo.project_state_id == 5 ? completedStep : null}>Finalizado</p>
                        </div>
                    </div>
                    }
                </DialogContent>
                
                <DialogActions>
                    {(userInfo.role.role_id !== 1 && selectedProjectInfo.project_state_id === 1 && !showPollCreationForm) ? 
                        <Button 
                        variant='contained' 
                        disableElevation
                        startIcon={<HowToVoteRoundedIcon />}
                        onClick={handleClickCreatePoll}
                        >
                            Crear Votación
                        </Button> 
                    : null}
                    <Button variant='outlined' onClick={handleClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ProjectList