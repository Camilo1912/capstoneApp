import React from 'react';
import { useState } from 'react';
import { projectTypes } from '../../utils/data';
import { project_create, project_states } from '../../requests/Projects'

const CreateProyectForm = () => {
  const [newProjectData, setNewProjectData] = useState({
    title: '',
    type: 'NA',
    description: '',
    budgetMin: '',
    budgetMax: '',
    project_state_id: 1,
  });

  const handleInputChange = (event) => {
    const {name, value} = event.target;

    if (name === 'budgetMin' || name === 'budgetMax') {
      if (!(/^\d+$/.test(value))) {
        return;
      }
    }

    setNewProjectData({
      ...newProjectData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    setNewProjectData({
      ...newProjectData,
      type: event.target.value,
    });
  };

  const handleSubmit = async () => {
    console.log(newProjectData);
    // const project_response = await project_create(newProjectData);
    const project_response = await project_states();
    console.log(project_response);
  }

  return (
    <>
      <div>CreateProyectForm</div>
      <div>
        <label>Titulo del proyecto</label>
        <input type="text" name="title" value={newProjectData.title} onChange={handleInputChange} />
        <br />
        <label>Tipo</label>
        <select value={newProjectData.type} onChange={handleSelectChange}>
          <option value="MI">Mejora de Infraestructura</option>
          <option value="PSC">Proyecto Social y Cultural</option>
          <option value="SP">Seguridad y Prevención</option>
          <option value="MA">Medio Ambiente</option>
          <option value="DEL">Desarrollo Económico Local</option>
          <option value="PC">Participación Ciudadana</option>
          <option value="PV">Proyectos de Vivienda</option>
          <option value="PS">Proyectos de Salud</option>
        </select>
        <br />
        <label>Descripción del proyecto</label>
        <textarea name="description" value={newProjectData.description} onChange={handleInputChange} />
        <br />
        <label>Presupuesto requerido</label>
        Entre <input type="text" name="budgetMin" value={newProjectData.budgetMin} onChange={handleInputChange} /> 
        a <input type="text" name="budgetMax" value={newProjectData.budgetMax} onChange={handleInputChange} />
        <br />
        <button onClick={handleSubmit}>Enviar Proyecto</button>
      </div>
    </>
  )
}

export default CreateProyectForm