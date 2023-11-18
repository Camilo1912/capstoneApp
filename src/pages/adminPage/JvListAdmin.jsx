import React, { useContext, useEffect, useState } from 'react';
import { get_communes_by_region, get_regions } from '../../requests/Address';
import { get_neighborhood_by_commune_id, neighborhood_create } from '../../requests/Neighborhood';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { Button, DialogTitle } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Divider from '@mui/material/Divider';
import { validateRut } from '@fdograph/rut-utilities';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';


const JvListAdmin = ({ onSeleccion }) => {
    const defaultJv = {
        name: '',
        description: '',
        president: '',
        secretary: '',
        treasurer: '',
        address: '',
        state: 'activado',
        logo_url: null,
        membership: 0,
        quota: 0,
        bank_name: '',
        bank_acc_number: '',
        bank_acc_type: '',
        bank_acc_name: '',
        bank_acc_rut: '',
        bank_acc_email: '',
        neighborhood_state_id: 1,
        commune_id: null,
        jv_code: '',
    }
    const [regionsList, setRegionsList] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(0);
    const [communesList, setCommunesList] = useState([]);
    const [selectedCommune, setSelectedCommune] = useState('');
    const [neighborhoodsList, setNeighborhoodsList] = useState([]);
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [neighborhoodInfo, setNeighborhoodInfo] = useState({});
    const [newRut, setNewRut] = useState('');
    const [creationOpen, setCreationOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [refresh, setRefresh] = useState(false);

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [newJv, setNewJv] = useState(defaultJv);

    useEffect(() => {
        const getRegions = async () => {
            const responseData = await get_regions();
            setRegionsList(responseData);
        };
        getRegions();
    },[]);

    useEffect(() => {
        setSelectedCommune('');
        setSelectedRegion('');
        setSelectedNeighborhood('');
        setNewJv(defaultJv);
        setNewEmail('');
        setNewRut('');
        onSeleccion(null);
    }, [refresh]);

    useEffect(() => {
        if (selectedRegion) {
            const getCommues = async () => {
                const responseData = await get_communes_by_region(selectedRegion);
                setCommunesList(responseData);
            };
            getCommues();
        }
        setCommunesList([]);
        setNeighborhoodsList([]);
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedCommune) {
            const getNeighborhoods = async () => {
                const responseData = await get_neighborhood_by_commune_id(selectedCommune);
                setNeighborhoodsList(responseData);
            };
            getNeighborhoods();
        } else {
            setNeighborhoodsList([]);
        }
        if (creationOpen) {
            setNewJv({
                ...newJv,
                commune_id: selectedCommune
            })
        }
    }, [selectedCommune]);

    const handleSelectedNeighborhood = (e) => {
        const selectedNeighborhood = JSON.parse(e.target.value);
        setNeighborhoodInfo(selectedNeighborhood);
    };

    const handleSelectionChange = (e) => {
        if (e.target.name === 'neighborhood') {
            const neighborhoodSelection = JSON.parse(e.target.value);
            setNeighborhoodInfo(neighborhoodSelection);
        } else if (e.target.name === 'regionId') {
            setSelectedRegion(e.target.value);
        } else if (e.target.name === 'communeId') {
            setSelectedCommune(e.target.value);
        } 
    };

    const handleJvSelection = (junta) => {
        onSeleccion(junta);
    };

    const handleOpenCreate = () => {
        setCreationOpen(true);
    };

    const handleCloseCreate = () => {
        setRefresh(!refresh);
        setCreationOpen(false);
    };

    const handleInputChange = (event) => {
        setNewJv({
            ...newJv,
            [event.target.name]: event.target.value,
        });
    };

    const handleBankAccSelection = (e) => {
        e.preventDefault();
        setNewJv({
            ...newJv,
            bank_acc_type: e.target.value,
        });
    };

    const handleRutChange = (event) => {
        let rutValue = event.target.value;
        rutValue = rutValue.replace(/[^0-9kK-]/g, '');
        setNewRut(rutValue);
    };

    useEffect(() => {
        if (validateRut(newRut)) {
            setNewJv({
                ...newJv,
                bank_acc_rut: newRut
            });
        } else {
            setNewJv({
                ...newJv,
                bank_acc_rut: ''
            });
        }
    }, [newRut]);

    const handleEmailChange = (event) => {
        let emailValue = event.target.value;
        setNewEmail(emailValue);
    };

    useEffect(() => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(emailPattern.test(newEmail)) {
            setNewJv({
                ...newJv,
                bank_acc_email: newEmail
            });
        } else {
            setNewJv({
                ...newJv,
                bank_acc_email: ''
            });
        }
    }, [newEmail]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (isFileValid(file)) {
            setNewJv({
                ...newJv,
                logo_url: file,
            });
        } else {
            toast.error('El tamaño del archivo excede el límite de 5 MB', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
            console.error('El tamaño del archivo excede el límite de 5 MB');
        }
    };

    const isFileValid = (file) => {
        return file && file.size <= 5 * 1024 * 1024;
    };

    const handleJvCreation = async () => {
        setIsSubmitDisabled(true);
        if (
            newJv.name &&
            newJv.description &&
            newJv.address &&
            newJv.state &&
            newJv.logo_url &&
            newJv.bank_acc_name &&
            newJv.bank_name &&
            newJv.bank_acc_number &&
            newJv.bank_acc_type &&
            newJv.bank_acc_rut &&
            newJv.bank_acc_email &&
            newJv.commune_id &&
            newJv.jv_code &&
            newJv.address) {
                console.log('Creando payload')
                const payload = {
                    'neighborhood[name]': newJv.name,
                    'neighborhood[description]': newJv.description,
                    'neighborhood[address]': newJv.address,
                    'neighborhood[state]': newJv.state,
                    'image_1': newJv.logo_url,
                    'neighborhood[bank_acc_name]': newJv.bank_acc_name,
                    'neighborhood[bank_name]': newJv.bank_name,
                    'neighborhood[bank_acc_number]': newJv.bank_acc_number,
                    'neighborhood[bank_acc_type]': newJv.bank_acc_type,
                    'neighborhood[bank_acc_rut]': newJv.bank_acc_rut,
                    'neighborhood[bank_acc_email]': newJv.bank_acc_email,
                    'neighborhood[commune_id]': newJv.commune_id,
                    'neighborhood[jv_code]': newJv.jv_code,
                    'neighborhood[quota]': newJv.quota,
                    'neighborhood[neighborhood_state_id]': newJv.neighborhood_state_id,
                }

                try {
                    const response = await neighborhood_create(payload);
                    if (response.status === 200) {
                        toast.success('Junta creada correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                        console.log(response.data);
                        setIsSubmitDisabled(false);
                    }
                } catch (error) {
                    console.log(error);
                    toast.error('No se pudo crear la junta', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                    setIsSubmitDisabled(false);
                }
            }
            setIsSubmitDisabled(false);
    }

    return (
        <div className='admin-jv-selection-container'>
            <div>
                <div style={{ display: 'felx', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Button onClick={handleOpenCreate} startIcon={<AddCircleRoundedIcon />}>Crear Junta</Button>
                    <IconButton onClick={() => setRefresh(!refresh)} id='refresh-button'>
                        <RefreshRoundedIcon />
                    </IconButton>
                </div>
                <h1>Buscar Junta de Vecino</h1>
                
            </div>
            <div className='jv-search-combobox-container'>
                <label htmlFor="region">Seleccione región:</label>
                <select 
                name="regionId" 
                id="region" 
                value={selectedRegion} 
                onChange={handleSelectionChange}>
                <option value="">-- Seleccione región --</option>
                {regionsList.map((region, index) => (
                    <option key={index} value={region.id}>
                        {region.region_name}
                    </option>))
                }
                </select>
            </div>
            { selectedRegion && !creationOpen ? 
                <div className='jv-search-combobox-container'>
                    <label htmlFor="commune">Seleccione comuna:</label>
                    <select 
                    name="communeId" 
                    id="commune" 
                    value={selectedCommune} 
                    onChange={handleSelectionChange}>
                    <option value="">-- Seleccione comuna --</option>
                    {communesList.map((commune, index) => (
                        <option key={index} value={commune.id}>
                            {commune.commune_name}
                        </option>))
                    }
                    </select>
                </div>
                : <></>
            }
            { !creationOpen ?
            <div className='jv-list-wrapper'>
                {neighborhoodsList.length !== 0 && communesList ? neighborhoodsList.map((neighborhood) => (
                    <div className='neighborhood-list-info-card' key={neighborhood.id} onClick={() => handleJvSelection(neighborhood)} style={{ cursor: 'pointer'}}>
                        <div className='neighborhood-info-card-title-wrapper'>
                            <h1>ID:{neighborhood.id} | Junta de Vecinos {neighborhood.name} </h1>
                            <div>
                                <PeopleAltRoundedIcon />
                                {neighborhood.membership}
                            </div>
                        </div>
                        
                        <div id='jv-content'>
                            <div className='registration-directive-card'>
                                <h2>Directiva</h2>
                                <p>Presidente: {neighborhood.president}</p>
                                <p>Secretari@: {neighborhood.secretary}</p>
                                <p>Tesorero: {neighborhood.treasurer}</p>
                            </div>
                            
                            <div>
                                <p>{neighborhood.description}</p>
                            </div>
                        </div>
                    </div>
                )): <p className='list-feedback'>Listado vacío</p>}
            </div>
            :null }

            <Dialog open={creationOpen} maxWidth={'md'} onClose={handleCloseCreate}>
                <DialogTitle>
                    Fromulario de creación de Junta de Vecinos
                </DialogTitle>

                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <strong>Nombre:</strong>
                        <input type="text" name='name' value={newJv.name} onChange={handleInputChange}/>
                        <strong>Código:</strong>
                        <input type="text" name='jv_code' value={newJv.jv_code} onChange={handleInputChange}/>
                        <strong>Descripción:</strong>
                        <input type="text" name='description' value={newJv.description} onChange={handleInputChange}/>
                        <strong>Dirección:</strong>
                        <input type="text" name='address' value={newJv.address} onChange={handleInputChange}/>
                        <strong>Cuota:</strong>
                        <p>
                        $<input type="number" name='quota' value={newJv.quota} onChange={handleInputChange} onKeyDown={(e) => {if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                        e.preventDefault();}}}/>Pesos Chilenos</p>
                        <Divider></Divider>
                        <strong>DATOS BANCARIOS</strong>
                        <strong>Nombre de la cuenta:</strong>
                        <input type="text" name='bank_acc_name' value={newJv.bank_acc_name} onChange={handleInputChange}/>
                        <strong>Banco:</strong>
                        <input type="text" name='bank_name' value={newJv.bank_name} onChange={handleInputChange}/>
                        <strong>Número:</strong>
                        <input type="text" name='bank_acc_number' value={newJv.bank_acc_number} onChange={handleInputChange} onKeyDown={(e) => {if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                        e.preventDefault();}}}/>
                        <strong>Tipo de cuenta</strong>
                        <select name="bank_acc_type" onChange={handleBankAccSelection} id="acctype">
                            <option value="">-- seleccione --</option>
                            <option value="corriente">Corriente</option>
                            <option value="vista">Vista</option>
                            <option value="ahorro">Ahorro</option>
                        </select>
                        <p><strong>Rut * </strong>(Sin puntos y con guión, ej: 12345678-9)</p>
                        <input type="text" value={newRut} onChange={handleRutChange} />
                        <Divider></Divider>
                        <strong>CONTACTO</strong>
                        <strong>Email *</strong>
                        <input type="email" value={newEmail} onChange={handleEmailChange}/>
                        <div className='jv-search-combobox-container'>
                            <label htmlFor="region">Seleccione región:</label>
                            <select 
                            name="regionId" 
                            id="region" 
                            value={selectedRegion} 
                            onChange={handleSelectionChange}>
                            <option value="">-- Seleccione región --</option>
                            {regionsList.map((region, index) => (
                                <option key={index} value={region.id}>
                                    {region.region_name}
                                </option>))
                            }
                            </select>
                        </div>
                        { selectedRegion ? 
                            <div className='jv-search-combobox-container'>
                                <label htmlFor="commune">Seleccione comuna:</label>
                                <select 
                                name="communeId" 
                                id="commune" 
                                value={selectedCommune} 
                                onChange={handleSelectionChange}>
                                <option value="">-- Seleccione comuna --</option>
                                {communesList.map((commune, index) => (
                                    <option key={index} value={commune.id}>
                                        {commune.commune_name}
                                    </option>))
                                }
                                </select>
                            </div>
                            : <></>
                        }

                        <label htmlFor="image-back">Logo de la Junta *</label>
                        <div>
                            <Button component="label" variant="contained" disableElevation color={ newJv.logo_url ? 'success' : 'primary' } size='small' startIcon={newJv.logo_url ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                                {newJv.logo_url ? 'Cargado' : 'Cargar imagen'}
                                <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e)} />
                            </Button>
                        </div>

                        
                    </div>
                </DialogContent>

                <DialogActions>
                <Button variant='contained' color='success' onClick={handleJvCreation} startIcon={<CheckCircleRoundedIcon />}>Crear</Button>
                    <Button variant='outlined' onClick={handleCloseCreate}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default JvListAdmin