import React, { useContext, useEffect, useState } from 'react'
import { get_projects_by_neighborhood_id, update_project_by_id } from '../../requests/Projects';
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
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { toast } from 'react-toastify';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const steps = Object.values(projectStates);

const ProjectList = () => {
    const [open, setOpen] = useState(false);
    const [projectsList, setProjectsList] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const { userInfo, handleUserInfo } = useContext(UserContext);
    const neighborhood = userInfo.neighborhood.neighborhood_id;
    const [selectedProjectInfo, setSelectedProjectInfo] = useState({});
    const [selectedProjectUserInfo, setSelectedProjectUserInfo] = useState({});
    const [showPollCreationForm, setShowPollCreationForm] = useState(false);
    const [editDescription, setEditDescription] = useState('');
    const [editType, setEditType] = useState('');
    const [editBudgetMin, setEditBudgetMin] = useState(0);
    const [editBudgetMax, setEditBudgetMax] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionPrompt, setShowRejectionPrompt] = useState(false);

    useEffect(() => {
        const getProjects = async () => {
            const responseData = await get_projects_by_neighborhood_id(neighborhood);
            setProjectsList(responseData.reverse());
        };
        getProjects();

    }, [refresh]);

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
        setIsEditing(false);
        setShowRejectionPrompt(false);
    };

    const handleClickCreatePoll = () => {
        setShowPollCreationForm(true);
    };

    const updateShowPollCreationForm = (data) => {
        setShowPollCreationForm(data);
    };

    const updateCloseParent = (data) => {
        setRefresh(!refresh);
        setOpen(data);
    };

    const handleDescriptionChange = (event) => {
        setEditDescription(event.target.value);
    };
    
    const handleTypeChange = (event) => {
        setEditType(event.target.value);
    };
    
    const handleBudgetMinChange = (event) => {
        setEditBudgetMin(event.target.value);
    };
    
    const handleBudgetMaxChange = (event) => {
        setEditBudgetMax(event.target.value);
    };

    const handleUpdateClick = (event) => {

        if (selectedProjectInfo) {
            if (!isEditing) {
                const payload = {
                    project: {
                        project_state_id: event.target.value
                    }
                }
                updateProject(payload);
            } else {
                const payload = {
                    project: {
                        description: editDescription,
                        project_type: editType,
                        budget_min: editBudgetMin,
                        budget_max: editBudgetMax,
                        project_state_id: selectedProjectInfo.project_state_id,
                    },
                }
                updateProject(payload);
            }
            
        }
    };

    const updateProject = async (payload) => {
        const updateResponse = await update_project_by_id(selectedProjectInfo.id, payload);
        if (updateResponse.status === 200) {
            toast.success('Proyecto actualizado correctamente.', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
            setRefresh(!refresh);
            setOpen(false);
            setIsEditing(false);
            setRejectionReason('');
            setShowRejectionPrompt(false);
        }
    }

    const handleRejection = () => {
        if (rejectionReason) {
            const payload = {
                project: {
                    project_state_id: 7,
                    tag: rejectionReason
                }
            }
            updateProject(payload);
        }
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
                        
                        <p>{proyecto.project_state_id === 7 ? "Rechazado" : projectStates[proyecto.project_state_id]}</p>
                        
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
                    {showPollCreationForm ? <PollCreationForm projectId={selectedProjectInfo.id} updateShowParent={updateShowPollCreationForm} isParentOpen={updateCloseParent}/> :
                    <div className='project-popup-card'>
                        {!isEditing ? 
                            <>
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
                                {selectedProjectInfo?.project_state_id !== 7 ?
                                    <Stepper activeStep={selectedProjectInfo?.project_state_id - 1} alternativeLabel>
                                        {steps.map((label, index) => (
                                            <Step key={index}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                : 
                                <div className='reject-prompt-message-container'>
                                    <h3 style={{color: 'red'}}>Proyecto Rechazado</h3>
                                    <label htmlFor="motivo-rechazo"><strong>Motivo de Rechazo</strong></label>
                                    <p>{selectedProjectInfo.tag}</p>
                                </div>
                                }
                            </div>
                            {showRejectionPrompt ? 
                                <div className='reject-prompt-message-container'>
                                    <label htmlFor="motivo-rechazo"><strong>Motivo de Rechazo</strong></label>
                                    <p>Indique de forma clara el motivo del rechazo de la propuesta. Este mensaje será envíado via email al usuario que realizó la publicación y publicado en el detalle del proyecto.</p>
                                    <textarea
                                        type="text"
                                        id="motivo-rechazo"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                    <div>
                                    <Button size='small' startIcon={<CloseRoundedIcon />} onClick={() => (setShowRejectionPrompt(false), setRejectionReason(''))}>Cancelar</Button>
                                    <Button size='small' variant='contained' color='error' startIcon={<ThumbDownIcon />} onClick={handleRejection}>Confirmar rechazo</Button>
                                    </div>
                                </div>
                            : null}
                            </>
                        : <>
                            <h2>Edición del proyecto: {selectedProjectInfo.title}</h2>
                            <label htmlFor="descripcion">Editar descripción</label>
                            <div className='project-detail-description-container'>
                                <textarea
                                    value={editDescription}
                                    onChange={handleDescriptionChange}
                                    rows="4"
                                    cols="50"
                                />
                            </div>

                            <label htmlFor="tipo">Editar tipo de proyecto</label>
                            <div>
                                <select value={editType} onChange={handleTypeChange}>
                                    <option disabled value="">-- Seleccione tipo --</option>
                                    <option value="MI">Mejora de Infraestructura</option>
                                    <option value="PSC">Proyecto Social y Cultural</option>
                                    <option value="SP">Seguridad y Prevención</option>
                                    <option value="MA">Medio Ambiente</option>
                                    <option value="DEL">Desarrollo Económico Local</option>
                                    <option value="PC">Participación Ciudadana</option>
                                    <option value="PV">Proyectos de Vivienda</option>
                                    <option value="PS">Proyectos de Salud</option>
                                </select>
                            </div>

                            <label htmlFor="presupuesto">Editar presupuesto</label>
                            <div>
                                <input
                                    type="number"
                                    value={editBudgetMin}
                                    onChange={handleBudgetMinChange}
                                />
                                a
                                <input
                                    type="number"
                                    value={editBudgetMax}
                                    onChange={handleBudgetMaxChange}
                                />
                            </div>
                        </>}
                    </div>
                    }
                </DialogContent>
                
                {!showPollCreationForm ?
                <DialogActions>
                        {[2, 3, 4, 5].includes(userInfo.role.role_id) && selectedProjectInfo.project_state_id === 1 ? 
                            !isEditing ? 
                            <>
                                {!showRejectionPrompt ? 
                                <>
                                <Button 
                                variant='contained'
                                color='error'
                                disableElevation
                                size='small'
                                onClick={() => (setShowRejectionPrompt(true))}
                                startIcon={<ThumbDownIcon />}
                                >
                                    Rechazar
                                </Button> 
                                <Button 
                                variant='contained'
                                color='success'
                                disableElevation
                                value={2}
                                size='small'
                                onClick={handleUpdateClick}
                                startIcon={<ThumbUpIcon />}
                                >
                                    Aprobar
                                </Button> 
                                <Button
                                variant='contained'
                                disableElevation
                                size='small'
                                startIcon={<EditRoundedIcon />}
                                onClick={() => {
                                    setIsEditing(true);
                                    setEditDescription(selectedProjectInfo.description);
                                    setEditType(selectedProjectInfo.project_type);
                                    setEditBudgetMin(selectedProjectInfo.budget_min);
                                    setEditBudgetMax(selectedProjectInfo.budget_max);
                                }}
                                >
                                    Modificar
                                </Button> 
                                </>
                                :null}
                            </>
                            :   
                                <Button 
                                variant='contained'
                                color='success'
                                disableElevation
                                size='small'
                                onClick={handleUpdateClick}
                                startIcon={<CheckRoundedIcon />}
                                >
                                    Publicar cambios
                                </Button>
                        : null}
                        {[2, 3, 4, 5].includes(userInfo.role.role_id) && selectedProjectInfo.project_state_id === 2 ? 
                            <>
                                <Button 
                                variant='contained' 
                                disableElevation
                                size='small'
                                startIcon={<HowToVoteRoundedIcon />}
                                onClick={handleClickCreatePoll}
                                >
                                    Crear Votación
                                </Button>
                            </>
                        : null}
                        {[2, 3, 4, 5].includes(userInfo.role.role_id) && selectedProjectInfo.project_state_id === 4 ? 
                            <>
                                <Button 
                                variant='contained'
                                disableElevation
                                value={5}
                                size='small'
                                onClick={handleUpdateClick}
                                startIcon={<ThumbUpIcon />}
                                >
                                    Pasar a ejecución
                                </Button> 
                            </>
                        :null}
                        {[2, 3, 4, 5].includes(userInfo.role.role_id) && selectedProjectInfo.project_state_id === 5 ? 
                            <>
                                <Button 
                                variant='contained'
                                disableElevation
                                value={6}
                                size='small'
                                onClick={handleUpdateClick}
                                startIcon={<ThumbUpIcon />}
                                >
                                    Finalizar
                                </Button> 
                            </>
                        :null}
                    {isEditing ? 
                        <Button startIcon={<CloseRoundedIcon />} onClick={() => (setIsEditing(false))}>Cancelar</Button>
                        :
                        <Button size='small' onClick={handleClose}>Cerrar</Button>
                    }
                </DialogActions> : null}
            </Dialog>
        </div>
    )
}

export default ProjectList