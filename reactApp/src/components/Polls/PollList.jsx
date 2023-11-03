import React, { useEffect, useContext, useState } from 'react';
import { get_polls, get_user_voting_status, poll_submit_vote } from '../../requests/Polls';
import { UserContext } from '../../contexts/UserContext';
import { formatearFecha } from '../../utils/utils';
import { get_project_by_id } from '../../requests/Projects';
import { toast } from 'react-toastify';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';

import HowToVoteRoundedIcon from '@mui/icons-material/HowToVoteRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbDownRoundedIcon from '@mui/icons-material/ThumbDownRounded';
import { buttonBaseClasses } from '@mui/material';

const PollList = () => {
  const { userInfo, handleUserInfo } = useContext(UserContext);
  const neighborhood = userInfo.neighborhood.neighborhood_id;
  // const currentDate = new Date();
  const [open, setOpen] = useState(false);
  const [pollsList, setPollsList] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);

  const [activePollsList, setActivePollsList] = useState(null);
  const [scheduledPollsList, setScheduledPollsList] = useState(null);
  const [closedPollsList, setClosedPollsList] = useState(null);

  useEffect(() => {
    const newCurrentDate = new Date();
    setCurrentDate(newCurrentDate);

    if (!pollsList) {
        const getPolls = async () => {
          const response = await get_polls(neighborhood);
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

              const userVotingStatusResponse = await get_user_voting_status(poll.id, userInfo.id);
              const userVoted = userVotingStatusResponse.data.voted;

              return {
                ...poll,
                projectTitle,
                startDate,
                endDate,
                userVoted
              };
            })
          );
          setPollsList(pollsWithProjects);
        };
        getPolls();
    }
  }, []);

  useEffect(() => {
    if (pollsList) {
      const activePolls = pollsList.filter((poll) => currentDate >= poll.startDate && currentDate <= poll.endDate);
      const scheduledPolls = pollsList.filter((poll) => currentDate < poll.startDate);
      const closedPolls = pollsList.filter((poll) => currentDate > poll.endDate);
      setActivePollsList(activePolls);
      setScheduledPollsList(scheduledPolls);
      setClosedPollsList(closedPolls);
    }
  }, [pollsList]);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleOpenDialog = (poll) => {
    setSelectedPoll(poll);
    setOpen(true);
  };

  const handleSubmitVote = async (e) => {
    const payload = {
      id: selectedPoll?.id,
      vote_option: e.target.value,
      neighbor_id: userInfo.id
    }
    console.log('ENVIANDO VOTO');
    try {
      console.log('intentando .....');
      console.log(selectedPoll.id, '   ', payload);
      const vote_response = await poll_submit_vote(selectedPoll.id, payload);
      if (vote_response.status === 201) {

        toast.success('Su voto se envío correctamente', { autoClose: 3000, position: toast.POSITION.TOP_CENTER });
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        toast.error('Error al votar. ¡Es posible que ya haya votado en este proyecto!', { autoClose: 3000, position: toast.POSITION.TOP_CENTER })
      }
    }
  };

  return (
    <div className='polls-wrapper'>
      <div className='polls-list'>

        <div className='poll-state-separator'>
          <HowToVoteRoundedIcon />
          <h2>Activas</h2>
        </div>
        <div className='polls-list-container'>
          {activePollsList?.map((poll) => (
            <div key={poll.id} className='poll-card active-poll'>
              <h3>Proyecto a votar: {poll.projectTitle}</h3>
              Termina el {formatearFecha(poll.endDate)}
              <br />
              {poll.userVoted}
              {!poll.userVoted ? 
              <>
                <Button onClick={() => handleOpenDialog(poll)}>Votar</Button>
              </> : <>Voto envíado</>}
            </div>
          ))}
        </div>
        {activePollsList?.length === 0 && <p>No hay votaciones activas</p>}

        <div className='poll-state-separator'>
          <EventRoundedIcon />
          <h2>Próximas</h2>
        </div>
        <div className='polls-list-container'>
          {scheduledPollsList?.map((poll) => (
            <div key={poll.id} className='poll-card'>
              <h3>Proyecto a votar: {poll.projectTitle}</h3>
              Inicia el {formatearFecha(poll.startDate)}
              <br />
              Termina el {formatearFecha(poll.endDate)}
              <br />
            </div>
          ))}
        </div>
        {scheduledPollsList?.length === 0 && <p>No hay datos que mostrar</p>}

        <div className='poll-state-separator'>
          <AssessmentRoundedIcon />
          <h2>Cerradas</h2>
        </div>
        <div className='polls-list-container'>
          {closedPollsList?.map((poll) => (
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
          ))}
        </div>
        {closedPollsList?.length === 0 && <p>No hay datos que mostrar</p>}
      </div>

      <div className='poll-info-card'>
        <h1>Sobre las votaciones</h1>
        <ul>
          <li><h2>Votaciones ACTIVAS</h2><p>Corresponden a las votaciones en curso, en ellas se indica el proyecto que se está votando, el horario de votación y si ya haz votado o no.</p></li>
          <li><h2>Votaciones PROXIMAS</h2><p>Aquí se muestran las votaciones que aún no están activas pero que ya se encuentran programadas con fecha de inicio y termino.</p></li>
          <li><h2>Votaciones CERRADAS</h2><p>Estas son votaciones que ya terminaron y por lo tanto se muestra el conteo de votos y el total de sufragios, además del resultado final.</p></li>
        </ul>
      </div>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogContent>
          Código de votación: {selectedPoll?.id}
          <br />
          Proyecto a votar: {selectedPoll?.projectTitle}
          <br />
          ID de proyecto: {selectedPoll?.project_id}
          <br />
          <div className='vote-button-container'>
            <Button 
              size='large' 
              value='approve' 
              startIcon={<ThumbUpRoundedIcon />} 
              color='success' 
              variant='contained' 
              className='vote-button'
              onClick={handleSubmitVote}
            >Apruebo
            </Button>
            <Button 
              size='large' 
              value='reject' 
              startIcon={<ThumbDownRoundedIcon />} 
              color='error' 
              variant='contained' 
              className='vote-button'
              onClick={handleSubmitVote}
            >Rechazo
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PollList;
