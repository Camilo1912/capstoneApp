import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { get_announcements_by_neighborhood_id } from '../../requests/News';

const NewsCard = ({ cardData }) => {
  const { userInfo } = useContext(UserContext);
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const getAnnouncements = async () => {
      const response = await get_announcements_by_neighborhood_id(userInfo.neighborhood.neighborhood_id);
      setNewsList(response);
    };
    getAnnouncements();
  }, [])

  return (
    <div className='card-grid'>
        {newsList.map((card, index) => (
            <div key={index} className='news-card'>
                <img
                    src={card.image_url}
                    alt={`Image for ${card.title}`}
                />
                <div className='card-content'>

                  <h2>{card.title}</h2>
                  <div>
                    <p className="news-card-content-text">{card.description}</p>
                    <p className='date-value'>{card.created_at}</p>
                  </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default NewsCard