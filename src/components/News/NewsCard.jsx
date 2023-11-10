import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { delete_announcement, get_announcements_by_neighborhood_id, update_announcement } from '../../requests/News';
import { IconButton } from '@mui/material/';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { formatearFecha } from '../../utils/utils';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { toast } from 'react-toastify';

const NewsCard = ({ cardData }) => {
    const { userInfo } = useContext(UserContext);
    const [refresh, setRefresh] = useState(true);
    const [open, setOpen] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    useEffect(() => {
        const getAnnouncements = async () => {
            const response = await get_announcements_by_neighborhood_id(userInfo.neighborhood.neighborhood_id);
            setNewsList(response.reverse());
        };
        getAnnouncements();
    }, [refresh])

    const handleDialogClose = () => {
        setOpen(false);
        setIsEditing(false);
        setEditedTitle('');
        setEditedDescription('');
        setSelectedAnnouncement(null);
        setRefresh(!refresh);
    };

    const handleDialogOpen = (announcementSelection) => {
        setSelectedAnnouncement(announcementSelection)
        setEditedTitle(announcementSelection.title);
        setEditedDescription(announcementSelection.description);
        setOpen(true);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDeleteClick = () => {
        if (selectedAnnouncement) {
            const deleteAnnouncement = async () => {
                const response = await delete_announcement(selectedAnnouncement.id);
                if (response.status === 204) {
                    toast.success('El anuncio se eliminó correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                    setOpen(false);
                    setSelectedAnnouncement(null);
                }
            }
            deleteAnnouncement();
        }
    }

    const handleSaveClick = async () => {
        
        if (editedTitle && editedDescription) {
            const payload = {
                announcement: {
                    title: editedTitle,
                    description: editedDescription
                }
            }
            const saveChanges = async () => {
                const response = await update_announcement(selectedAnnouncement.id, payload);
                if (response === 200) {
                    toast.success('Anuncio editado correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                    setIsEditing(false);
                    setEditedTitle('');
                    setEditedDescription('');
                    setSelectedAnnouncement(null);
                    setOpen(false);
                    setRefresh(!refresh);
                } else {
                    toast.error('Error al editar anuncio', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                }
            }
            saveChanges();
        }
    };

    return (
        <div className='card-grid'>
            {newsList.map((news) => (
                <div key={news.id} className='news-card' onClick={() => handleDialogOpen(news)}>
                    {news.image_url ? 
                        <img
                            src={news.image_url}
                            alt={`Image for ${news.title}`}
                        />
                        :
                        null
                    }

                    {news.title ? 
                        <div className='card-content'>

                        <h2>{news.title}</h2>
                            <div>
                            <p className="news-card-content-text">{news.description}</p>
                            <p className='date-value date-news-position'>Publicado el {formatearFecha(news.created_at)}</p>
                            </div>
                        </div>
                        : null
                    }
                </div>
            ))}

            <Dialog open={open} onClose={handleDialogClose}>
                {isEditing ? (
                    <DialogContent style={{ display: 'flex', flexDirection: 'column'}}>
                        <h1>Pantalla de edición de anuncios</h1>
                        <label>Edición de titulo</label>
                        <input
                            style={{ width: '100%', marginTop: '5px', marginBottom: '15px'}}
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                        />
                        <br />  
                        <label>Edición de descripción</label>
                        <textarea
                            style={{ width: '100%', marginTop: '5px', marginBottom: '15px', minHeight: '100px' }}
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                        />
                    </DialogContent>
                    )
                    :
                    <DialogContent >
                        <h1>{selectedAnnouncement?.title}</h1>
                        <p className='date-value'>Publicado el {formatearFecha(selectedAnnouncement?.created_at)}</p>
                        {selectedAnnouncement?.created_at !== selectedAnnouncement?.updated_at ? 
                        <p className='date-value'>Editado el {formatearFecha(selectedAnnouncement?.updated_at)}</p>
                        : null}
                        <p style={{ marginBottom: '15px', marginTop: '15px' }}>{selectedAnnouncement?.description}</p>
                        {selectedAnnouncement?.image_url ? <img src={selectedAnnouncement?.image_url} style={{ width: '100%'}} alt="imagen-de-anuncio" /> : null}   
                    </DialogContent>
                }
                <DialogActions>
                    {[2, 3, 4, 5].includes(userInfo.role.role_id) ? 
                        <>
                        {isEditing ? 
                            <>
                            <Button 
                                onClick={() => (
                                    setIsEditing(false),
                                    setEditedTitle(selectedAnnouncement?.title),
                                    setEditedDescription(selectedAnnouncement?.description))}
                                variant='outlined' size='small' startIcon={<ClearRoundedIcon />} >Cancelar</Button>
                            <Button onClick={handleSaveClick} variant='contained' color='success' size='small' startIcon={<CheckRoundedIcon />} disableElevation>Guardar cambios</Button>
                            </>
                            : 
                            <>
                            <Button onClick={handleDeleteClick} size='small' variant='contained' startIcon={<DeleteForeverRoundedIcon />} color='error'>Eliminar</Button> 
                            <Button onClick={handleEditClick} size='small' variant='contained' startIcon={<EditRoundedIcon />} >Editar</Button>
                            <Button size='small' onClick={handleDialogClose}>Cerrar</Button>
                            </>
                        }
                        </>
                    : 
                    <Button size='small' onClick={handleDialogClose}>Cerrar</Button>}
                    
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default NewsCard