import Header from "./Header";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { ToastContainer } from 'react-toastify';

const PrivateLayout = () => {
    const { userInfo, handleUserInfo } = useContext(UserContext);
    return (
        <div className="general-layout">
            <Header />
            { userInfo.role.role_id !== 5 ? <Navbar /> : <></>}
            
            <Outlet />
            {/* <div className="header">
                <Header />
            </div>
            <div className="navbar">
                <Navbar />
            </div>
            <div className="main">
                <ContentLayout />
            </div> */}
        </div>
    );
};

export default PrivateLayout;