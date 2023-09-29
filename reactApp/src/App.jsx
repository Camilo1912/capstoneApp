import "./styles/App.scss";
import React from 'react';
import PublicLayout from "./layouts/PublicLayout";
import GeneralLayout from "./layouts/GeneralLayout";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserContextProvider from "./contexts/UserContext";


const App = () => {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}></Route>
          <Route path="/home" element={<GeneralLayout />}></Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App