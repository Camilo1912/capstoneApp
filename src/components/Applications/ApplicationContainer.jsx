import React, { useContext } from 'react'
import { useSelectedComponent } from '../../contexts/SelectedComponentContext';
import MembershipApplication from './MembershipApplication';
import ResourceApplication from './ResourceApplication';
import CertificateApplication from './CertificateApplication';
import CreateCertificateApplication from './CreateCertificateApplication';
import NeighborApplications from './NeighborApplications';
import { UserContext } from '../../contexts/UserContext';

const ApplicationContainer = () => {
    const { selectedComponent } = useSelectedComponent();
    const { userInfo } = useContext(UserContext);

    return (
        <div className='news-main-layout'>
                {(selectedComponent.menu === 0)? 
                <>
                    <h1>Solicitudes / Certificados</h1>
                    {[2, 3, 4].includes(userInfo?.role.role_id) ? 
                        <CertificateApplication />
                    : <NeighborApplications />
                    }
                    
                </>
                : 
                <>
                    {selectedComponent.menu === 1 ? 
                        <>
                            <h1>Solicitudes / Nueva solicitud de certificado</h1>
                            <CreateCertificateApplication />
                        </>
                        : 
                        <>
                            {selectedComponent.menu === 2 ?
                                <>
                                    <h1>Solicitudes / Recurso</h1>
                                    <ResourceApplication />
                                </>
                            : 
                                <>
                                    <h1>Solicitudes / Inscripción</h1>
                                    <MembershipApplication />
                                </>
                            }
                        </>
                    } 
                </>
                }
            </div>
    )
}

export default ApplicationContainer