import React, { useEffect, useContext, useState } from 'react';
import { get_polls } from '../../requests/Polls';
import { UserContext } from '../../contexts/UserContext';
import { formatearFecha } from '../../utils/utils';
import { get_project_by_id } from '../../requests/Projects';

const PollList = () => {
  const [pollsList, setPollsList] = useState(null);
  const { userInfo, handleUserInfo } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState(null);
  const neighborhood = userInfo.neighborhood.neighborhood_id;

  useEffect(() => {
    const newCurrentDate = new Date();
    setCurrentDate(newCurrentDate);

    if (!pollsList) {
        const getPolls = async () => {
          const response = await get_polls(neighborhood);
          // setPollsList(response.data.reverse());
          const pollsData = response.data.reverse();
          console.log(response.data);

          const pollsWithProjects = await Promise.all(
            pollsData.map(async (poll) => {
              const projectResponse = await get_project_by_id(poll.project_id);
              const projectTitle = projectResponse.data.title;
              
              const startDate = new Date(poll.start_date);
              const endDate = new Date(poll.end_date);

              startDate.setHours(startDate.getHours() + 3);
              endDate.setHours(endDate.getHours() + 3);

              return {
                ...poll,
                projectTitle,
                startDate,
                endDate
              };
            })
          );
  
          setPollsList(pollsWithProjects);
        };
        getPolls();
    }
  }, []);

  return (
    <div className='polls-wrapper'>
      <div className='polls-list'>
        <h2>Activas</h2>
        <div className='polls-list-container'>
          {pollsList?.map((poll) => {
            if (currentDate >= poll.startDate && currentDate <= poll.endDate) {
              return (
                <div key={poll.id} className='poll-card active-poll'>
                  <h3>Proyecto a votar: {poll.projectTitle}</h3>
                  Termina el {formatearFecha(poll.endDate)}
                  <br />
                </div>
              );
            }
            return null;
          })}
        </div>
        {pollsList?.filter((poll) => {
          return currentDate >= poll.startDate && currentDate <= poll.endDate;
        }).length === 0 && <p>No hay datos que mostrar</p>}
        <h2>Próximas</h2>
        <div className='polls-list-container'>
          {pollsList?.map((poll) => {
            if (currentDate < poll.startDate) {
              return (
                <div key={poll.id} className='poll-card'>
                  <h3>Proyecto a votar: {poll.projectTitle}</h3>
                  Inicia el {formatearFecha(poll.startDate)}
                  <br />
                  Termina el {formatearFecha(poll.endDate)}
                  <br />
                </div>
              );
            }
            return null;
          })}
        </div>
        {pollsList?.filter((poll) => {
          return currentDate < poll.startDate;
        }).length === 0 && <p>No hay datos que mostrar</p>}
        <h2>Cerradas</h2>
        <div className='polls-list-container'>
          {pollsList?.map((poll) => {
            if (currentDate > poll.endDate) {
              return (
                <div key={poll.id} className='poll-card closed-poll'>
                  <h3>{poll.projectTitle} {poll.approve > poll.reject ? <>APROBADO</>: <>RECHAZADO</>}</h3>
                  ID: {poll.id}
                  <br />
                  Inició el {formatearFecha(poll.startDate)}
                  <br />
                  Terminó el {formatearFecha(poll.endDate)}
                  <br />
                  Votos a favor {poll.approve}
                  <br />
                  Votos en contra {poll.reject}
                  <br />
                  Total de votos {poll.reject + poll.approve}
                </div>
              );
            }
            return null;
          })}
        </div>
        {pollsList?.filter((poll) => {
          return currentDate > poll.endDate;
        }).length === 0 && <p>No hay datos que mostrar</p>}
      </div>
      <div className='poll-info-card'>
        <h1>Sobre las votaciones</h1>
        <ul>
          <li><h2>Votaciones ACTIVAS</h2><p>Corresponden a las votaciones en curso, en ellas se indica el proyecto que se está votando, el horario de votación y si ya haz votado o no.</p></li>
          <li><h2>Votaciones PROXIMAS</h2><p>Aquí se muestran las votaciones que aún no están activas pero que ya se encuentran programadas con fecha de inicio y termino.</p></li>
          <li><h2>Votaciones CERRADAS</h2><p>Estas son votaciones que ya terminaron y por lo tanto se muestra el conteo de votos y el total de sufragios, además del resultado final.</p></li>
        </ul>
      </div>
    </div>
  );
};

export default PollList;
