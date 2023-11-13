import React from 'react'
import { useSelectedComponent } from '../../contexts/SelectedComponentContext';
import ActivitiesList from './ActivitiesList';
import ActivitiesCreationForm from './ActivitiesCreationForm';

const ActivitiesContainer = () => {
    const { selectedComponent } = useSelectedComponent();

    return (
        <div className='news-main-layout'>
            {(selectedComponent.menu === 0)? 
            <>
                <h1>Actividades / Todas</h1>
                <ActivitiesList />
            </>
            : 
            <>
                {selectedComponent.menu === 1 ? 
                    <>
                        <h1>Actividades / Crear</h1>
                        <ActivitiesCreationForm />
                    </>
                : null}
            </>
            }
        </div>
    )
}

export default ActivitiesContainer