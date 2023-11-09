import React, { useContext } from 'react'
import NewsCard from './NewsCard';
import NewsCreationForm from './NewsCreationForm';
import { useSelectedComponent } from '../../contexts/SelectedComponentContext';

const News = () => {
    const { selectedComponent } = useSelectedComponent();

    return (
        <div className='news-main-layout'>
            {(selectedComponent.menu === 0) ?
            <>
                <h1>Anuncios y noticias / Todos</h1>
                <NewsCard />
            </>
            : 
            <>
                <h1>Anuncios / Crear nuevo</h1>
                <NewsCreationForm />
            </>}
        </div>
    );
};

export default News;