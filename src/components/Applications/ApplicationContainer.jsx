import React from 'react'
import { useSelectedComponent } from '../../contexts/SelectedComponentContext';
import MembershipApplication from './MembershipApplication';
import ResourceApplication from './ResourceApplication';
import CertificateApplication from './CertificateApplication';

const ApplicationContainer = () => {
    const { selectedComponent } = useSelectedComponent();

    return (
        <div className='news-main-layout'>
                {(selectedComponent.menu === 0)? 
                <>
                    <h1>Solicitudes / Certificados</h1>
                    <CertificateApplication />
                </>
                : 
                <>
                {selectedComponent.menu === 1 ? 
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
            </div>
    )
}

export default ApplicationContainer