import "./styles/App.scss";
import React from 'react';
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContextProvider from "./contexts/UserContext";
import PrivateRoute from "./routes/PrivateRoute";
import PresidentHome from "./pages/PresidentHome";
import Login from "./pages/Login";
import NeighborHome from "./pages/NeighborHome";
import SecretaryHome from "./pages/SecretaryHome";
import AdminHome from "./pages/AdminHome";
import TreasurerLayout from "./pages/TreasurerLayout";
import { SelectedComponentProvider } from "./contexts/SelectedComponentContext";

const App = () => {
  return (
    <UserContextProvider>
      <SelectedComponentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Login />} />
            </Route>
            <Route path="/register" element={<PublicLayout />} />
            <Route element={<PrivateRoute />}>
              <Route path="/neighbor_home" element={<NeighborHome />} />
              <Route path="/president_home" element={<PresidentHome />} />
              <Route path="/secretary_home" element={<SecretaryHome />} />
              <Route path="/treasurer_home" element={<TreasurerLayout />} />
              <Route path="/admin_home" element={<AdminHome />} />
            </Route>
            <Route path="*" element={<p>No hay nada aquí: error 404</p>} />
          </Routes>
        </BrowserRouter>
      </SelectedComponentProvider>
    </UserContextProvider>
  );
}

export default App