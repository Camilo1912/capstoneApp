import "./styles/App.scss";
import React from 'react';
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserContextProvider from "./contexts/UserContext";
import PrivateRoutes from "./routes/PrivateRoutes";


const App = () => {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />} />
          <Route path="/register" element={<PublicLayout />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<PrivateLayout />} />
          </Route>
          {/* <Route path="/home" element={<PrivateLayout />}/> */}
          <Route path="*" element={<p>No hay nada aquí: error 404</p>} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App