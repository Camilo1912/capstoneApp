import React from 'react'
import NewsCard from './NewsCard';

import cardPlaceholderData from "../utils/PlaceholderData";

const News = () => {

    return (
        <div className='news-main-layout'>
            <h1>Anuncios</h1>
            <NewsCard cardData={cardPlaceholderData}/>
        </div>
    );
};

export default News;