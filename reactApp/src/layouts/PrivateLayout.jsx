import ContentLayout from "../pages/NeighborHome";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
    return (
        <div className="general-layout">
            <Header />
            <Navbar />
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