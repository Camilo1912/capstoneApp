import React, {useEffect} from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Login/>
      </BrowserRouter>
    </div>
  )
}

export default App