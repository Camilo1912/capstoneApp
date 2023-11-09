import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { get_announcements_by_neighborhood_id } from '../../requests/News';
import { IconButton } from '@mui/material/';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

const NewsCard = ({ cardData }) => {
  const { userInfo } = useContext(UserContext);
  const [refresh, setRefresh] = useState(true);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const getAnnouncements = async () => {
      const response = await get_announcements_by_neighborhood_id(userInfo.neighborhood.neighborhood_id);
      setNewsList(response);
    };
    getAnnouncements();
  }, [refresh])

  return (
    <div className='card-grid'>
        <div className='refresh-button-container'>
            <IconButton onClick={() => setRefresh(!refresh)} id='refresh-button'>
                <RefreshRoundedIcon />
            </IconButton>
        </div>
        {newsList.map((card, index) => (
            <div key={index} className='news-card'>
                {card.image_url ? 
                    <img
                        src={card.image_url}
                        alt={`Image for ${card.title}`}
                    />
                    :
                    null
                }

                {card.title ? 
                    <div className='card-content'>

                    <h2>{card.title}</h2>
                        <div>
                        <p className="news-card-content-text">{card.description}</p>
                        <p className='date-value'>{card.created_at}</p>
                        </div>
                    </div>
                    : null
                }
                
                
                
            </div>
        ))}
    </div>
  )
}

export default NewsCard