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
    <div className='project-creation-layout'>
      <div className='create-project-card'>

        <h1>Formulario de postulación de poryecto vecinal</h1>
        <div>
          <label>Titulo del proyecto</label>
          <input type="text" name="title" value={newProjectData.title} onChange={handleInputChange} />
        </div>
        <div>
          <label>Seleccione el tipo de proyecto</label>
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
        </div>
        <div>
          <label>Descripción del proyecto</label>
          <textarea name="description" placeholder='Escriba descripción ...' value={newProjectData.description} onChange={handleInputChange} />
        </div>
        <div className='from-to-budget-contaner'>
          <label>Presupuesto requerido</label>
            <p>Ingrese el presupuesto aproximado que cree usted que costaría la implementación completa del proyecto.</p>
          <div>
            Desde <input type="text" name="budgetMin" value={newProjectData.budgetMin} onChange={handleInputChange} /> 
            hasta <input type="text" name="budgetMax" value={newProjectData.budgetMax} onChange={handleInputChange} />
          </div>
        </div>
        <div className='project-creation-button-container'>
          <button onClick={handleSubmit}>Enviar Proyecto</button>
        </div>
        
      </div>
      <div className='project-creation-info-card'>
        <h1>Sobre la postulación de proyectos</h1>
        <ul>
          <li><h2>Nuevo proyecto</h2><p>Crear un nuevo proyecto hará que este sea visible para todos los integrantes de la junta de vecinos. Luego este será revisado por la directiva y esta podrá iniciar una votación.</p></li>
          <li><h2>Votaciones</h2><p>Las votaciones tendrán fecha y hora tanto de inicio como de termino y todos los integrantes de la junta podrán votar. El procentaje de votos a favor para  la aprovación será definido por la directiva de la junta.</p></li>
          <li><h2>Aprobación</h2><p>Una vez que la votación del proyecto termine, este será evaluado mas detenidamente por la directiva. Finalmente, si la directiva está de acuerdo con la ejecución del proyecto será marcado como <strong>APROBADO</strong>.</p></li>
          <li><h2>Puesta en marcha</h2><p>Luego de la aprobación, se tomarán las medidas necesarias para comenzar el proyecto. Cuando estas estén en orden el proyecto pasará a estár <strong>EN EJECUCIÓN.</strong></p></li>
          <li><h2>Finalización</h2><p>Una vez que el proyecto se haya implementado completamente, este pasará a su estado final como <strong>FINALIZADO.</strong></p></li>
        </ul>
      </div>
    </div>
  )
}

export default CreateProyectForm