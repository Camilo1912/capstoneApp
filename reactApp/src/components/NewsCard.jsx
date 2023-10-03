import React from 'react'

const NewsCard = ({ cardData }) => {
  return (
    <div className='card-grid'>
        {cardData.map((card, index) => (
            <div key={index} className='news-card'>
                <img
                    src={card.imageUrl}  // Assuming you have an "imageUrl" property in your card data
                    alt={`Image for ${card.cardTitle}`}
                />
                <div className='card-content'>

                  <h2>{card.cardTitle}</h2>
                  <p>{card.cardContent}</p>
                </div>
            </div>
        ))}
    </div>
  )
}

export default NewsCard