import React from 'react'

const NewsCard = ({ cardData }) => {
  return (
    <div className='card-grid'>
        {cardData.map((card, index) => (
            <div key={index} className='news-card'>
                <img
                    src={card.imageUrl}
                    alt={`Image for ${card.cardTitle}`}
                />
                <div className='card-content'>

                  <h2>{card.cardTitle}</h2>
                  <div>
                    <p className="news-card-content-text">{card.cardContent}</p>
                    <p className='date-value'>{card.cardDate}</p>
                  </div>
                </div>
            </div>
        ))}
    </div>
  )
}

export default NewsCard