import React from 'react'

import { useSelectedComponent } from '../../contexts/SelectedComponentContext';
import ProjectList from './ProjectList';
import CreateProyectForm from './CreateProyectForm';

const ProjectsContainer = () => {
    const { selectedComponent } = useSelectedComponent();

    return (
        <div className='news-main-layout'>
            {(selectedComponent.menu === 0)? 
            <>
                <h1>Proyectos / Todos</h1>
                <ProjectList /> 
            </>
            : 
            <>
                <h1>Proyectos / Postular nuevo proyecto</h1>
                <CreateProyectForm />
            </>
            }
        </div>
    )
}

export default ProjectsContainer