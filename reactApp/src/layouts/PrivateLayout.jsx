import ContentLayout from "./ContentLayout";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const PrivateLayout = () => {
    return (
        <div className="general-layout">
            <Header />
            <Navbar />
            <ContentLayout />
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