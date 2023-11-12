import "./styles/App.scss";
import React, { useMemo } from 'react';
import PublicLayout from "./layouts/PublicLayout";
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import UserContextProvider from "./contexts/UserContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import NeighborHome from "./pages/NeighborHome";
import AdminHome from "./pages/adminPage/AdminHome";
import { SelectedComponentProvider } from "./contexts/SelectedComponentContext";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import GuestContextProvider from "./contexts/GuestContext";
import { createTheme, useMediaQuery } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import DirectiveHome from "./pages/DirectivePage/DirectiveHome";

const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark');

    const theme = useMemo(() => createTheme({
        palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
        },
    }), [prefersDarkMode],);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
            <UserContextProvider>
                <SelectedComponentProvider>
                    <GuestContextProvider>
                    {/* <BrowserRouter> */}
                        <HashRouter>
                            <Routes>
                                <Route path="/" element={<PublicLayout />}>
                                    <Route index element={<Login />} />
                                </Route>
                                <Route path="/register" element={<PublicLayout />} />
                                <Route path="/guest_home" element={<PublicLayout />} />
                                <Route element={<PrivateRoute allowedRoles={[1]} />} >
                                    <Route path="/neighbor_home" element={<NeighborHome />} />
                                </Route>
                                <Route element={<PrivateRoute allowedRoles={[2 ,3 ,4]} />}>
                                    <Route path="/directive_home" element={<DirectiveHome />} />
                                </Route>
                                <Route element={<PrivateRoute allowedRoles={[5]} />}>
                                    <Route path="/admin_home" element={<AdminHome />} />
                                </Route>
                                <Route path="*" element={<p>No hay nada aquí: error 404</p>} />
                            </Routes>
                        </HashRouter>
                    {/* </BrowserRouter> */}
                    </GuestContextProvider>
                <ToastContainer />
                </SelectedComponentProvider>
            </UserContextProvider>
            </ThemeProvider>
        </LocalizationProvider>
    );
}

export default App