import React, { useContext, useEffect, useState } from 'react'
import { get_users_by_neighborhood_id } from '../../requests/User';
import { UserContext } from '../../contexts/UserContext';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { userRolsTypes } from '../../utils/data';
import * as XLSX from 'xlsx/xlsx.mjs';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

const MembersList = ({updateCount}) => {
    const { userInfo, handleUserInfo } = useContext(UserContext);
    const neighborhood = userInfo.neighborhood.neighborhood_id;
    const [refresh, setRefresh] = useState(true);
    const [open, setOpen] = useState(false);
    const [membersList, setMembersList] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const currentDate = new Date();
    

    useEffect(() => {
        if (membersList) {
            const getMembers = async () => {
                const membersResponse = await get_users_by_neighborhood_id(neighborhood);
                setMembersList(membersResponse.data);
                updateCount(membersResponse.data.length);
            }
            getMembers();
        }
    }, [userInfo, refresh]);

    const handleClickOpen = (member) => {
        setOpen(true);
        setSelectedMember(member);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedMember(null);
    };

// : "7538"
// : "973"
// : 2
// : "Minhiriath"
// : "no verificado"

    const handleExport = () => {
        if (membersList) {
            const selectedColumns = membersList.map(({
                rut,
                first_name,
                second_name,
                last_name,
                last_name_2,
                email,
                gender,
                birth_date,
                street_address,
                number_address,
                phone_number,
                role_id,
                verification,
            }) => ({
                RUT: rut,
                PRIMER_NOMBRE: first_name,
                SEGUNDO_NOMBRE: second_name,
                APELLIDO_PATERNO: last_name,
                APELLIDO_MATERNO: last_name_2,
                EMAIL: email,
                GENERO: gender,
                FECHA_NACIMIENTO: birth_date,
                DIRECCION_CALLE: street_address,
                DIRECCION_NUMERO: number_address,
                TELEFONO: phone_number,
                ROL: userRolsTypes[role_id] || "Desconocido",
                VERIFICADO: verification,
            }));
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(selectedColumns);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");
            XLSX.writeFile(workbook, `ListaMiembros_${currentDate}.xlsx`);
          } else {
            console.error('No hay datos para exportar.');
          }
    };

    return (
        <>
            <div className='refresh-button-container'>
                <IconButton onClick={() => setRefresh(!refresh)} id='refresh-button'>
                    <RefreshRoundedIcon />
                </IconButton>
                {[2, 3, 4].includes(userInfo.role.role_id) ? 
                <IconButton onClick={handleExport}>
                    <DownloadRoundedIcon />
                </IconButton>
                : null }
            </div>
            <div className='projects-list-container'>
                
                {membersList.map((member) => (
                    <div key={member.id} className='user-card' onClick={() => handleClickOpen(member)}>
                        <Avatar
                            alt={member.first_name}
                            src={member.avatar_url}
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
            <Dialog open={open} onClose={handleClose}>
                {selectedMember ?
                    <div className='member-info-container'>
                        <div className='member-avatar-container'>
                            <Avatar
                                alt={selectedMember.first_name}
                                src={selectedMember.avatar_url}
                                sx={{ width: 100, height: 100, bgcolor: "#85abf4"}}
                            />
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
                                {/* <p>Código postal: <strong>{selectedMember.postal_code ? selectedMember.postal_code : <>-</>} </strong> </p> */}
                            </div>
                            <div>
                                <h2>Contacto</h2>
                                <p>Telefono</p>
                                <strong>{selectedMember.phone_number ? selectedMember.phone_number : <>-</>}</strong> 
                                <p>Email</p>
                                <strong>{selectedMember.email}</strong> 
                            </div>
                        </div>
                       
                    </div>

                    
                    : null
                }
            
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default MembersList