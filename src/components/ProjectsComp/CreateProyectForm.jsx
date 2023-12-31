import React, { useContext } from 'react';
import { useState } from 'react';
import { projectTypes } from '../../utils/data';
import { project_create, project_states } from '../../requests/Projects'
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';

const CreateProyectForm = () => {
  const {userInfo} = useContext(UserContext);
  const defaultProjectState = {
    title: '',
    project_type: '',
    description: '',
    budget_max: '',
    budget_min: '',
    project_state_id: 1,
    neighborhood_id: userInfo.neighborhood.neighborhood_id,
    neighbor_id: userInfo.id,
  }
  const [newProjectData, setNewProjectData] = useState(defaultProjectState);
  const [characterCount, setCharacterCount] = useState(0);

  const maxLengthDescription = 3000;

  const handleInputChange = (event) => {
    const {name, value} = event.target;

    if (name === 'budget_min' || name === 'budget_max') {
      if (!(/^\d+$/.test(value))) {
        return;
      }
    }

    if (name === 'description') {
      setCharacterCount(maxLengthDescription - (maxLengthDescription - value.length));
    }

    setNewProjectData({
      ...newProjectData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    setNewProjectData({
      ...newProjectData,
      project_type: event.target.value,
    });
  };

  const handleSubmit = async () => {
    const payload = {'project': {
        ...newProjectData
        // description: newProjectData.description.replace(/\n/g, "\\n")
      }
    };
    const project_response = await project_create(payload);
    if (project_response.status === 200) {
      toast.success('El proyecto se creó correctamente', {autoClose: 3000, position: toast.POSITION.TOP_CENTER});
      setNewProjectData(defaultProjectState);
    }
  }

  return (
    <div className='project-creation-layout'>
      <div className='create-project-card'>

        <h1>Formulario de postulación de proyecto vecinal</h1>
        <div>
          <label>Titulo del proyecto</label>
          <input type="text" name="title" maxLength={100} value={newProjectData.title} onChange={handleInputChange} />
        </div>
        <div>
          <label>Seleccione el tipo de proyecto</label>
          <select value={newProjectData.project_type} onChange={handleSelectChange}>
            <option disabled value="">-- Seleccione tipo --</option>
            <option value="MI">Mejora de Infraestructura</option>
            <option value="PSC">Proyecto Social y Cultural</option>
            <option value="SP">Seguridad y Prevención</option>
            <option value="MA">Medio Ambiente</option>
            <option value="DEL">Desarrollo Económico Local</option>
            <option value="PC">Participación Ciudadana</option>
            <option value="PV">Proyectos de Vivienda</option>
            <option value="PS">Proyectos de Salud</option>
          </select>
        </div>
        <div>
          <label>Descripción del proyecto</label>
          <textarea name="description" placeholder='Escriba descripción ...' maxLength={maxLengthDescription} value={newProjectData.description} onChange={handleInputChange} />
          <p>{characterCount}/{maxLengthDescription}</p>
        </div>
        <div className='from-to-budget-contaner'>
          <label>Presupuesto requerido</label>
            <p>Ingrese el presupuesto aproximado que cree usted que costaría la implementación completa del proyecto.</p>
          <div>
            Desde <input type="text" name="budget_min" value={newProjectData.budget_min} onChange={handleInputChange} /> 
            hasta <input type="text" name="budget_max" value={newProjectData.budget_max} onChange={handleInputChange} />
            pesos
          </div>
        </div>
        <div className='project-creation-button-container'>
          {/* <button onClick={handleSubmit}>Enviar Proyecto</button> */}
          <Button 
            variant='contained'
            color='success'
            size='small'
            onClick={handleSubmit}
          >
              Postular proyecto
          </Button> 
        </div>
        
      </div>
      <div className='project-creation-info-card'>
        <h1>Sobre la postulación de proyectos</h1>
        <ul>
          <li><h2>Nuevo proyecto</h2><p>Crear un nuevo proyecto hará que este sea visible para todos los integrantes de la junta de vecinos. Luego este será revisado por la directiva y esta podrá iniciar una votación.</p></li>
          <li><h2>Aprobación de la directiva</h2><p>El proyecto será evaluado detenidamente por la directiva. Finalmente, si la directiva está de acuerdo con el proyecto este será marcado como <strong>APROBADO</strong> y se habilitará la creación de una votación.</p></li>
          <li><h2>Votaciones</h2><p>Las votaciones son creadas por la directiva, tendrán fecha y hora tanto de inicio como de termino y todos los integrantes de la junta podrán votar. Una vez terminada la votación la directiva el estado cambiará a <strong>APROBADO</strong> o <strong>RECHAZADO</strong> dependiendo del resultado.</p></li>
          <li><h2>En ejecución</h2><p>Luego de la aprobación por votación, tu directiva podrá pasar el estado a ejeucción o reevaluar su viabilidad. Se tomarán las medidas necesarias para comenzar el proyecto.</p></li>
          <li><h2>Finalización</h2><p>Una vez que el proyecto se haya implementado completamente, este pasará a su estado final como <strong>FINALIZADO.</strong></p></li>
        </ul>
      </div>
    </div>
  )
}

export default CreateProyectForm