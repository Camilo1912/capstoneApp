import React, { useContext, useEffect, useState } from 'react'
import { get_projects_by_neighborhood_id } from '../../requests/Projects';
import { get_user_by_id } from '../../requests/User';
import { projectStates, projectTypes } from '../../utils/data';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

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
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const steps = Object.values(projectStates);

const ProjectList = () => {
    const [open, setOpen] = useState(false);
    const [projectsList, setProjectsList] = useState([]);
    const { userInfo, handleUserInfo } = useContext(UserContext);
    const neighborhood = userInfo.neighborhood.neighborhood_id;
    const [selectedProjectInfo, setSelectedProjectInfo] = useState({});
    const [selectedProjectUserInfo, setSelectedProjectUserInfo] = useState({});
    const [showPollCreationForm, setShowPollCreationForm] = useState(false);

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
        if (selectedProjectInfo?.neighbor_id) {
            const postUserData = await get_user_by_id(selectedProjectInfo.neighbor_id);
            setSelectedProjectUserInfo(postUserData);
        }
    };

    const handleClickOpen = (project) => {
        setOpen(true);
        setSelectedProjectInfo(project);
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
                                proyecto.project_type === 'PC' ? <EmojiPeopleRoundedIcon fontSize="small"/> :
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
                                
                                    <div className='project-type-icon'>
                                        { selectedProjectInfo.project_type === 'MI' ? <ConstructionRoundedIcon fontSize='large'/> :
                                        selectedProjectInfo.project_type === 'PSC' ? <Diversity2RoundedIcon fontSize='large'/> : 
                                        selectedProjectInfo.project_type === 'SP' ? <SecurityRoundedIcon fontSize='large'/> :
                                        selectedProjectInfo.project_type === 'MA' ? <ForestRoundedIcon fontSize='large'/> :
                                        selectedProjectInfo.project_type === 'DEL' ? <MonetizationOnRoundedIcon fontSize='large'/> :
                                        selectedProjectInfo.project_type === 'PC' ? <EmojiPeopleRoundedIcon fontSize='large'/> :
                                        selectedProjectInfo.project_type === 'PV' ? <HomeWorkRoundedIcon fontSize='large'/> :
                                        selectedProjectInfo.project_type === 'PS' ? <LocalHospitalRoundedIcon fontSize='large'/> :
                                        <>na</>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <p>Propuesta de <strong>{projectTypes[selectedProjectInfo.project_type]}</strong></p>
                                    <p>Posteado por <strong>{selectedProjectUserInfo.first_name} {selectedProjectUserInfo.last_name} {selectedProjectUserInfo.last_name_2}</strong></p>
                                </div>
                                <div>
                                    <p>Costo estimado entre <strong>${selectedProjectInfo?.budget_min?.toLocaleString()} y ${selectedProjectInfo?.budget_max?.toLocaleString()}</strong></p>
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
                            <Stepper activeStep={selectedProjectInfo?.project_state_id - 1} alternativeLabel>
                                {steps.map((label, index) => (
                                    <Step key={index}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                    </div>
                    }
                </DialogContent>
                
                {!showPollCreationForm ?
                <DialogActions>
                    {([2, 3, 4, 5].includes(userInfo.role.role_id) && selectedProjectInfo.project_state_id === 1) ? 
                        <>
                            <Button 
                            variant='contained'
                            color='error'
                            disableElevation
                            startIcon={<ThumbDownIcon />}
                            >
                                Rechazar
                            </Button> 
                            <Button 
                            variant='contained' 
                            disableElevation
                            startIcon={<HowToVoteRoundedIcon />}
                            onClick={handleClickCreatePoll}
                            >
                                Crear Votación
                            </Button> 
                            <Button 
                            variant='contained' 
                            disableElevation
                            startIcon={<EditRoundedIcon />}
                            >
                                Modificar
                            </Button> 
                        </>
                    : null}
                    <Button variant='outlined' onClick={handleClose}>Cerrar</Button>
                </DialogActions> : null}
            </Dialog>
        </div>
    )
}

export default ProjectList