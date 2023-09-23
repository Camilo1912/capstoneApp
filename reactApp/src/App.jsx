import "./styles/App.css";
import React, {useEffect} from 'react';
import Login from './components/Login';
import GeneralLayout from "./layouts/GeneralLayout"
import { BrowserRouter, Routes, Route } from 'react-router-dom';



const App = () => {
  return (
    <div>
      <BrowserRouter>
        <GeneralLayout />
      </BrowserRouter>
    </div>
  )
}

export default App