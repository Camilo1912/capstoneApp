import React from 'react'

import { useSelectedComponent } from '../../contexts/SelectedComponentContext';
import ProjectList from './ProjectList';
import CreateProyectForm from './CreateProyectForm';
import PollList from '../Polls/PollList';

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
            {selectedComponent.menu === 1 ? 
                <>
                    <h1>Proyectos / Postular nuevo proyecto</h1>
                    <CreateProyectForm />
                </>
                : 
                <>
                    <h1>Proyectos / Votaciones</h1>
                    <PollList />
                </>
            } 
                
            </>
            }
        </div>
    )
}

export default ProjectsContainer