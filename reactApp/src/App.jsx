import "./styles/App.css";
import React from 'react';
import PublicLayout from "./layouts/PublicLayout";
import GeneralLayout from "./layouts/GeneralLayout";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserContextProvider from "./contexts/UserContext";


const App = () => {
  return (
    <UserContextProvider>
      <PublicLayout />
    </UserContextProvider>
  );
}

export default App