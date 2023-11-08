import "./styles/App.scss";
import React from 'react';
import PublicLayout from "./layouts/PublicLayout";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContextProvider from "./contexts/UserContext";
import PrivateRoute from "./routes/PrivateRoute";
import PresidentHome from "./pages/PresidentHome";
import Login from "./pages/Login";
import NeighborHome from "./pages/NeighborHome";
import SecretaryHome from "./pages/SecretaryHome";
import AdminHome from "./pages/adminPage/AdminHome";
import TreasurerLayout from "./pages/TreasurerLayout";
import { SelectedComponentProvider } from "./contexts/SelectedComponentContext";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <UserContextProvider>
        <SelectedComponentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/capstoneApp/" element={<PublicLayout />}>
                <Route index element={<Login />} />
              </Route>
              <Route path="/capstoneApp/register" element={<PublicLayout />} />
              <Route path="/capstoneApp/guest_home" element={<PublicLayout />} />
              <Route element={<PrivateRoute allowedRoles={[1]} />} >
                <Route path="/capstoneApp/neighbor_home" element={<NeighborHome />} />
              </Route>
              <Route element={<PrivateRoute allowedRoles={[2 ,3 ,4]} />}>
                <Route path="/capstoneApp/president_home" element={<PresidentHome />} />
                <Route path="/capstoneApp/secretary_home" element={<SecretaryHome />} />
                <Route path="/capstoneApp/treasurer_home" element={<TreasurerLayout />} />
              </Route>
              <Route element={<PrivateRoute allowedRoles={[5]} />}>
                <Route path="/capstoneApp/admin_home" element={<AdminHome />} />
              </Route>
              <Route path="*" element={<p>No hay nada aquí: error 404</p>} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </SelectedComponentProvider>
      </UserContextProvider>
    </LocalizationProvider>
  );
}

export default App