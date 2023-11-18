import React, { useEffect, useState } from 'react'
import { get_users_by_neighborhood_id, remove_user_by_id } from '../../requests/User';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { userRolsTypes } from '../../utils/data';
import Select from '@mui/material/Select';
import { IconButton, MenuItem } from '@mui/material';
import Divider from '@mui/material/Divider';
import { toast } from 'react-toastify';
import { set_user_rol } from '../../requests/Roles';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

const MembersList = ({ handleSelection, junta}) => {
    const [membersList, setMembersList] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showRolSelection, setShowRolSelection] = useState(false);
    const [selectedRole, setSelectedRole] = useState(selectedMember ? selectedMember.role_id : 1);
    const [occupiedRoles, setOccupiedRoles] = useState([]);

    useEffect(() => {
        console.log(junta);
        if (membersList) {
            const getMembers = async () => {
                const membersResponse = await get_users_by_neighborhood_id(junta.id);
                setMembersList(membersResponse.data);
            }
            getMembers();
        }
    }, [junta, refresh]);


    useEffect(() => {
        if (membersList) {
            const occupiedRoles = membersList
                .filter(member => [2, 3, 4].includes(member.role_id))
                .map(member => member.role_id);
            setOccupiedRoles(occupiedRoles);
        }
    }, [membersList]);


    const handleClickOpen = (member) => {
        setOpen(true);
        setSelectedMember(member);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedMember(null);
    };

    const handleChangeRole = async () => {
        try {
            const setRoleResponse = await set_user_rol(selectedMember.id, selectedRole);
            if (setRoleResponse.status === 200) {
                toast.success('Usuario actualizado', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
            }
            setRefresh(!refresh);
            handleClose();
        } catch (error) {
            console.error('Error al cambiar el rol del usuario', error);
        }
    };

    const handleRolSelection = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        setSelectedRole(e.target.value);
    };


    const handleUserExpulsion = async () => {
        try {
            const expulsionResponse = await remove_user_by_id(selectedMember.id);
            if (expulsionResponse.status === 200) {
                toast.success('Usuario Expulsado', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
                setOpen(false);
                setSelectedMember(null);
                setRefresh(!refresh);
            }
        } catch (error) {
            toast.error('No se pudo realizar la acción', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
        }
    };

    const rolesOptions = [
        { value: 1, label: 'Vecino' },
        { value: 2, label: 'Presidente' },
        { value: 3, label: 'Secretario' },
        { value: 4, label: 'Tesorero' },
    ];

    const availableRoles = rolesOptions.filter((role) => !occupiedRoles.includes(role.value));


    return (
        <>
        
            <div style={{ maxHeight: 'calc(100dvh - 6rem)', display: 'flex', flexDirection: 'column', minWidth: 'fit-content', borderLeft: '1px dashed #999999', gap: '5px', padding: '15px'}}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h1>Directiva</h1>
                    <IconButton >
                        <AddCircleRoundedIcon />
                    </IconButton>
                </div>
                {membersList.filter(member => [2, 3, 4].includes(member.role_id)).map((member) => (
                    <div key={member.id} className='user-card' onClick={() => handleClickOpen(member)} style={{ margin: '0px'}}>
                        <Avatar
                            alt={member.first_name}
                            src={member.face_photo_url}
                            sx={{ width: 56, height: 56, bgcolor: "#85abf4"}}
                        />
                        <div>
                        <h1>
                            {member.first_name} {member.second_name} {member.last_name} {member.last_name_2}
                        </h1>
                        <p>{member.email}</p>
                        </div>
                    </div>
                ))}
                <h1>Miembros</h1>
                <div style={{ overflow: 'auto', width: '100%'}}>
                    
                    {membersList.filter(member => [1].includes(member.role_id)).map((member) => (
                        <div key={member.id} className='user-card' onClick={() => handleClickOpen(member)} style={{ marginBottom: '5px', margin: '5px'}}>
                            <Avatar
                                alt={member.first_name}
                                src={member.face_photo_url}
                                sx={{ width: 56, height: 56, bgcolor: "#85abf4"}}
                            />
                            <div>
                            <h1>
                                {member.first_name} {member.second_name} {member.last_name} {member.last_name_2}
                            </h1>
                            <p>{member.email}</p>
                            </div>
                        </div>
                    ))} 
                </div>

            </div>
            <Dialog open={open} maxWidth={'lg'} onClose={handleClose}>
                {selectedMember ?
                    <div className='member-info-container' >
                        <div className='member-avatar-container'>
                            <Avatar
                                alt={selectedMember.first_name}
                                src={selectedMember.face_photo_url}
                                sx={{ width: 100, height: 100, bgcolor: "#85abf4"}}
                            />
                            <div>
                                <p>ID:</p>
                                <strong>{selectedMember.id}</strong>
                            </div>
                            <div>
                                <p>Nombres:</p>
                                <strong>{selectedMember.first_name} {selectedMember.second_name}</strong>
                                <p>Apellidos:</p>
                                <strong>{selectedMember.last_name} {selectedMember.last_name_2}</strong> 
                            </div>
                        </div>
                        <div className='info-box-layout'>
                            <div>
                                <h2>Información</h2>
                                <p>Rut</p>
                                <strong>{selectedMember.rut}</strong>
                                <p>Fecha de nacimiento</p>
                                <strong>{selectedMember.birth_date}</strong>
                            </div>
                            <div>
                                <h2>Usuario</h2>
                                <p>Rol</p>
                                <strong>{userRolsTypes[selectedMember.role_id]}</strong>
                                <p>Estado</p>
                                <strong>{selectedMember.verification}</strong>
                            </div>
                        </div>
                        <div className='info-box-layout'>
                            <div>
                                <h2>Dirección</h2>
                                <p>Calle</p>
                                <strong>{selectedMember.street_address}</strong>
                                <p>Número</p>
                                <strong>{selectedMember.number_address}</strong> 
                            </div>
                            <div>
                                <h2>Contacto</h2>
                                <p>Telefono</p>
                                <strong>{selectedMember.phone_number ? selectedMember.phone_number : <>-</>}</strong> 
                                <p>Email</p>
                                <strong>{selectedMember.email}</strong> 
                            </div>
                        </div>
                        <div style={{ width: '100%'}}>
                            {showRolSelection ? 
                            <>
                                <Divider></Divider>
                                <strong>SELECCIONE NUEVO ROL</strong>
                                <br />
                                <select value={selectedRole} onChange={handleRolSelection} >
                                    <option value="">-- seleccione --</option>
                                    {availableRoles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                    ))}
                                </select>
                            </>
                            : null}
                        </div>
                    
                    </div>

                    
                    : null
                }
            
                <DialogActions>
                
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '10px' }}>
                        <Button variant='contained' color='error' onClick={handleUserExpulsion}>Eliminar Usuario</Button>
                        {showRolSelection ? <Button variant='contained' onClick={handleChangeRole} color='success'>Guardar rol</Button>
                        :
                        <Button variant='contained' onClick={() => (setShowRolSelection(true))}>Cambiar Rol</Button>
                        }
                        <Button variant='outlined' onClick={handleClose}>Cerrar</Button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default MembersList