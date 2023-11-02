import React, { useEffect, useContext, useState } from 'react';
import { get_polls } from '../../requests/Polls';
import { UserContext } from '../../contexts/UserContext';

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
            setPollsList(response.data.reverse());
            console.log(response.data);
        };
        getPolls();
    }
}, []);

  return (
    <div>
    { pollsList?.map((poll) => (
      <div key={poll.id}>
        {poll.project_id}
        <br />
        {poll.start_date}
        <br />
        {poll.end_date}
        <br />

      </div>

    ))}

    </div>
  );
};

export default PollList;
