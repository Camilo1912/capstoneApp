import React from 'react'

import { useSelectedComponent } from '../../contexts/SelectedComponentContext';
import ProjectList from './ProjectList';
import CreateProyectForm from './CreateProyectForm';

const ProjectsContainer = () => {
    const { selectedComponent } = useSelectedComponent();

    return (
        <div className='news-main-layout'>
            <h1>Proyectos</h1>
            {(selectedComponent.menu === 0)? <ProjectList /> : <CreateProyectForm />}
        </div>
    )
}

export default ProjectsContainer