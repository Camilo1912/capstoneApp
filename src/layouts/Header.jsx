import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

import { useContext, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';
import { FormLabel, Input } from '@mui/material';
import { useSelectedComponent } from '../contexts/SelectedComponentContext';
import { getUserId } from '../utils/LocalStorage';
import { logout } from '../requests/Auth';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { applications_crate_change_neighborhood } from '../requests/Applications';
import { toast } from 'react-toastify';
import { get_communes_by_region, get_regions } from '../requests/Address';
import { get_neighborhood_by_commune_id } from '../requests/Neighborhood';

const Header = () => {
    const { userInfo, handleUserInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const defaultAddressInfo = {
        street_address: '',
        number_address: '',
        image_front: null,
        image_back: null,
        image_invoice: null,
        image_face: null,
        selectedRegion: null,
        selectedCommune: null,
        selectedNeighborhoodId: null
    }
    
    const { setSelectedComponent } = useSelectedComponent()

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newEmail, setNewEmail] = useState(userInfo.email);
    const [newPhoneNumber, setNewPhoneNumber] = useState(userInfo.phone_number);
    const [labelColor, setLabelColor] = useState('blue');
    const [cambioDeJunta, setCambioDeJunta] = useState(false);
    const [addressForm, setAddressForm] = useState(defaultAddressInfo);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [regionsList, setRegionsList] = useState([]);
    const [communesList, setCommunesList] = useState([]);
    const [neighborhoodsList, setNeighborhoodsList] = useState([]);

    useEffect(() => {
        if ([2,3,4].includes(userInfo.role?.role_id)) {
            setLabelColor('#FFC300');
        } else if (userInfo.role?.role_id === 5) {
            setLabelColor('#ff770085');
        } else {
            setLabelColor('#3584e4b4');
        }

        const getRegions = async () => {
            const responseData = await get_regions();
            setRegionsList(responseData);
        };
        getRegions();
    }, []);

    useEffect(() => {
        if (addressForm.regionId) {
            const getCommues = async () => {
                const responseData = await get_communes_by_region(addressForm.regionId);
                setCommunesList(responseData);
            };
            getCommues();
        }
        setAddressForm({
            ...addressForm,
            selectedCommune: '',
            selectedNeighborhoodId: '',
        });
        setNeighborhoodsList([]);
    }, [addressForm.regionId]);

    useEffect(() => {
        if (addressForm.communeId) {
            const getNeighborhoods = async () => {
                const responseData = await get_neighborhood_by_commune_id(addressForm.communeId);
                setNeighborhoodsList(responseData);
            };
            getNeighborhoods();
        }
        setAddressForm({
            ...addressForm,
            selectedNeighborhoodId: '',
        });
    }, [addressForm.communeId]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        if (addressForm.image_back && addressForm.image_face && addressForm.image_front && addressForm.image_invoice
            && addressForm.number_address && addressForm.street_address && userInfo.neighborhood.neighborhood_id) {
                setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
        
    }, [addressForm])

    const handleSelectionChange = (e) => {
        if (e.target.name === 'neighborhood') {
            const selectedNeighborhood = JSON.parse(e.target.value);
            setAddressForm({
                ...addressForm,
                selectedNeighborhoodId: selectedNeighborhood.id,
            })
        } else {
            const { name, value } = e.target;
            setAddressForm({
                ...addressForm,
                [name]: value
            });
        }
    };
    

    const handleClose = () => {
        setEditMode(false);
        setAddressForm(defaultAddressInfo);
        setCambioDeJunta(false);
        setOpen(false);
    };

    const handleClickLogout = async () => {
        handleUserInfo({});
        const response = await logout(getUserId());
        setSelectedComponent({'nav': 0, 'menu': 0});

        navigate('/');
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = () => {
   
        handleUserInfo({
            ...userInfo,
            email: newEmail,
            phone_number: newPhoneNumber,
        });

        setEditMode(false);
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];

        if (isFileValid(file)) {
            setAddressForm({
                ...addressForm,
                [field]: file,
            });
        } else {
            toast.error('El tamaño del archivo excede el límite de 5 MB', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
            console.error('El tamaño del archivo excede el límite de 5 MB');
        }
    };

    const isFileValid = (file) => {
        return file && file.size <= 5 * 1024 * 1024;
    };

    const handleJvChangeSubmit = async () => {
        setIsSubmitDisabled(true);
        if (addressForm.image_back && addressForm.image_face && addressForm.image_front && addressForm.image_invoice
            && addressForm.number_address && addressForm.street_address && userInfo.neighborhood.neighborhood_id) {
            const payload = {
                'application[number_address]': `${addressForm['number_address']}`,
                'application[street_address]': addressForm['street_address'],
                'image_url_1': addressForm['image_front'],
                'image_url_2': addressForm['image_back'],
                'image_url_3': addressForm['image_face'],
                'image_url_4': addressForm['image_invoice'],
                '[neighborhood_id]': addressForm['selectedNeighborhoodId']
            }

            try {
                const response = await applications_crate_change_neighborhood(userInfo.neighborhood.neighborhood_id, payload);
                if (response.status === 200) {
                    toast.success('Solicitud de cambio de junta fue enviada correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
                    handleClose();
                } else {
                    console.log("Hubo un problema al crear su solicitud. Código de estado: " + response.status);
                }
            
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleSelectedNeighborhood = (e) => {
        const selectedNeighborhood = JSON.parse(e.target.value);
        setAddressForm({
            ...addressForm,
            selectedNeighborhoodId: selectedNeighborhood.id,
        })
    };




    return (
        <div className="header-wrapper">
            <div className='header-title-wrapper' style={{ textTransform: 'capitalize' }}>
                {userInfo.role.role_id !== 5 ? <h1>Comunidad vecinal {userInfo.neighborhood.neighborhood_name}</h1> : <h1>SISTEMA DE ADMINISTRACIÓN</h1>}
                
                <div>
                    <h2>{userInfo.first_name} {userInfo.last_name} {userInfo.last_name_2}</h2>
                    <p  style={{backgroundColor: labelColor}}> {userInfo.role.role_name}</p>
                </div>
                
            </div>
            <div className="header-iconset">
                <Avatar className='profile-avatar' alt={`${userInfo.first_name} ${userInfo.last_name}`} src={userInfo.face_photo_url} />
                <div className='profile-button-set'>
                    <IconButton onClick={handleClickOpen} style={{ color: '#333333'}}>
                        <SettingsIcon fontSize='medium' />
                    </IconButton>
                    <IconButton onClick={handleClickLogout} style={{ color: '#333333'}}>
                        <LogoutIcon fontSize='medium' />
                    </IconButton>
                </div>
            </div>

            <Dialog open={open} maxWidth={'lg'} onClose={handleClose}>
                <DialogTitle>
                    {cambioDeJunta ? <>Solicitud de cambio de junta</>: <>Datos y ajustes de usuario</>}
                    
                </DialogTitle>
                <DialogContent>
                    {!cambioDeJunta ? 
                    <div className='user-edit-form'>
                        
                        <div>
                            <FormLabel>Nombre completo</FormLabel>
                            <p style={{ textTransform: 'capitalize' }}>{userInfo.first_name} {userInfo.second_name} {userInfo.last_name} {userInfo.last_name_2}</p>
                        </div>
                        <div>
                            <FormLabel>RUT</FormLabel>
                            <p>{userInfo.rut}</p>
                        </div>
                        <div>
                            <FormLabel>Fecha de nacimiento</FormLabel>
                            <p>{userInfo.birth_date}</p>
                        </div>
                        <div>
                            <FormLabel>Correo electrónico</FormLabel>
                            {editMode ? (
                                <input
                                label="Nuevo correo electrónico"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                />
                                ) : (<p>{userInfo.email}</p>
                                    )}
                        </div>
                        <div>
                            <FormLabel>Dirección de residencia</FormLabel>
                            <p>{userInfo.street_address} {userInfo.number_address}, {userInfo.commune.commune_name}, Región {userInfo.region.region_name}</p>
                        </div>
                        <div>
                            <FormLabel>Telefono</FormLabel>
                            {editMode ? (
                                <input
                                label="Nuevo telefono de contacto"
                                value={newPhoneNumber}
                                onChange={(e) => setNewPhoneNumber(e.target.value)}
                                />
                                ) : (
                                    <p>{userInfo.phone_number}</p>
                                    )}
                            </div>
                        <p>Para realizar el cambio de dirección se requiere envíar una solicitud de cambio de junta. Seleccione la misma junta en la que ya se encuentra.</p>
                        {[2, 3, 4].includes(userInfo.id) ? 
                            null
                        : <Button onClick={() => (setCambioDeJunta(true))} variant='outlined' >Cambio a otra Junta</Button>}

                    </div>
                    : 
                        <>
                                <div>
                                    <label htmlFor="region">Seleccione su región *</label>
                                    <select 
                                        name="regionId" 
                                        id="region" 
                                        value={addressForm.selectedRegion} 
                                        onChange={handleSelectionChange}
                                    >
                                        <option value="">-- Seleccione región --</option>
                                        {regionsList.map((region, index) => (
                                            <option key={index} value={region.id}>
                                                {region.region_name}
                                            </option>))
                                        }
                                    </select>
                                </div>
                                <br />
                                <div>
                                    <label htmlFor="commune">Seleccione una comuna *</label>
                                    <select 
                                    name="communeId" 
                                    id="commune" 
                                    value={addressForm.communeId} 
                                    disabled={addressForm.regionId ? false : true}
                                    onChange={handleSelectionChange}>
                                        <option value="">-- Seleccione comuna --</option>
                                        {addressForm.regionId ? <>
                                            {communesList.map((commune, index) => (
                                                <option key={index} value={commune.id}>
                                                    {commune.commune_name}
                                                </option>))
                                            }</>
                                        : null}
                                    </select>
                                </div>
                                <br />
                                <div>
                                    <label htmlFor="neighborhood">Seleccione tu Junta de Vecinos *</label>
                                    <select 
                                    name="neighborhood" 
                                    id="neighborhood" 
                                    disabled={addressForm.communeId ? false : true}
                                    value={JSON.stringify(addressForm.neighborhood)} 
                                    onChange={handleSelectedNeighborhood}>
                                        <option value="">-- Seleccione Junta de Vecinos --</option>
                                        {addressForm.communeId ? 
                                            <>
                                            {neighborhoodsList.map((neighborhood, index) => (
                                                <option key={index} value={JSON.stringify(neighborhood)}>
                                                {neighborhood.name}
                                                </option>))
                                            }
                                            </>
                                        :null}
                                    </select>
                                </div>
                                <br />
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                                    <strong>Dirección *</strong>
                                    <div style={{ display: 'flex', gap: '15px'}}>
                                        <Input placeholder='Calle' type="text" maxLength={200} value={addressForm.street_address} onChange={(e) => (setAddressForm({...addressForm, street_address: e.target.value}))}></Input>
                                        <Input placeholder='Número + Nro. Dpto./Casa' type="text" maxLength={100} value={addressForm.number_address} onChange={(e) => (setAddressForm({...addressForm, number_address: e.target.value}))}></Input>
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <strong>Para poder verificarte frente a tu junta de vecinos necesitamos los siguientes documentos: </strong>
                                    <div className='register-combobox-container register-upload-file-container'style={{ border: '1px solid #999999'}}>
                                        <label htmlFor="image-front">Foto carnet fontal *</label>
                                        <div>
                                            <Button component="label" variant="contained" disableElevation color={ addressForm.image_front ? 'success' : 'primary' } size='small' startIcon={addressForm.image_front ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                                                {addressForm.image_front ? 'Cargado' : 'Cargar imagen'}
                                                <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_front')} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='register-combobox-container register-upload-file-container'style={{ border: '1px solid #999999'}}>
                                        <label htmlFor="image-back">Foto carnet parte posterior *</label>
                                        <div>
                                            <Button component="label" variant="contained" disableElevation color={ addressForm.image_back ? 'success' : 'primary' } size='small' startIcon={addressForm.image_back ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                                                {addressForm.image_back ? 'Cargado' : 'Cargar imagen'}
                                                <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_back')} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='register-combobox-container register-upload-file-container' style={{ border: '1px solid #999999'}}>
                                        <label htmlFor="image-invoice">Foto de una cuenta o contrato que muestre su dirección y Rut. *</label>
                                        <Button component="label" variant="contained" disableElevation color={ addressForm.image_invoice ? 'success' : 'primary' } size='small' startIcon={addressForm.image_invoice ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                                            {addressForm.image_invoice ? 'Cargado' : 'Cargar imagen'}
                                            <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_invoice')} />
                                        </Button>
                                    </div>
                                    <div className='register-combobox-container register-upload-file-container'style={{ border: '1px solid #999999'}}>
                                        <label htmlFor="image-face">Foto de su rostro *</label>
                                        <Button component="label" variant="contained" disableElevation color={ addressForm.image_face ? 'success' : 'primary' } size='small' startIcon={addressForm.image_face ? <CheckCircleIcon /> : <CloudUploadIcon />}>
                                            {addressForm.image_face ? 'Cargado' : 'Cargar imagen'}
                                            <input type="file" accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, 'image_face')} />
                                        </Button>
                                    </div>
                                    Formatos aceptados: JPG, JPEG o PNG - Tamaño maximo 5mb
                                </div>
                                
                        </>
                    }
                    
                </DialogContent>
                <DialogActions>
                    {cambioDeJunta ? 
                    <>
                        <Button onClick={handleJvChangeSubmit} disabled={isSubmitDisabled} variant='contained' color='success'>Enviar solicitud</Button>
                        <Button onClick={() => (setCambioDeJunta(false))} variant='outlined' >Cancelar</Button>    
                    </>
                    :
                    <>
                        {!editMode && (
                            <Button onClick={handleEditClick}>Editar</Button>
                        )}
                        <Button onClick={handleClose}>Cerrar</Button>
                        {editMode && (
                            <Button onClick={handleSaveClick}>Guardar</Button>
                        )}
                    </>
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Header;