import React, { useContext } from 'react'
import { useSelectedComponent } from '../../contexts/SelectedComponentContext';
import MembershipApplication from './MembershipApplication';
import ResourceApplication from './ResourceApplication';
import CertificateApplication from './CertificateApplication';
import CreateCertificateApplication from './CreateCertificateApplication';
import NeighborApplications from './NeighborApplications';
import { UserContext } from '../../contexts/UserContext';
import CreateResourceApplication from './CreateResourceApplication';

const ApplicationContainer = () => {
    const { selectedComponent } = useSelectedComponent();
    const { userInfo } = useContext(UserContext);

    return (
        <div className='news-main-layout'>
            {[2, 3, 4].includes(userInfo?.role.role_id) ? 
                <>
                    { selectedComponent.menu === 0 ? 
                        <>
                            <h1>Solicitudes / Certificados</h1>
                            <CertificateApplication />
                        </>
                    :null}

                    {selectedComponent.menu === 1 ? 
                        <>
                            <h1>Solicitudes / Recurso</h1>
                            <ResourceApplication />
                        </>
                    :null}

                    {selectedComponent.menu === 2 ? 
                        <>
                            <h1>Solicitudes / Inscripción</h1>
                            <MembershipApplication />
                        </>
                    :null}

                    {selectedComponent.menu === 3 ? 
                        <>
                            <h1>Solicitudes / Nueva solicitud de Certificado</h1>
                            <CreateCertificateApplication />
                        </>
                    :null}

                    {selectedComponent.menu === 4 ? 
                        <>
                            <h1>Solicitudes / Nueva solicitud de Recurso</h1>
                            <CreateResourceApplication />
                        </>
                    :null}
                </>
                :               
                <>
                    { selectedComponent.menu === 0 ? 
                        <>
                            <h1>Solicitudes / Certificados</h1>
                            <NeighborApplications />
                        </>
                    :null}

                    { selectedComponent.menu === 1 ? 
                        <>
                            <h1>Solicitudes / Nueva solicitud de Certificado</h1>
                            <CreateCertificateApplication />
                        </>
                    :null}

                    { selectedComponent.menu === 2 ? 
                        <>
                            <h1>Solicitudes / Nueva solicitud de Recurso</h1>
                            <CreateResourceApplication />
                        </>
                    :null}
                </>}
            </div> 
    )
}

export default ApplicationContainer