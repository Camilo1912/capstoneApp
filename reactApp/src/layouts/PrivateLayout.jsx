import ContentLayout from "./ContentLayout";
import Header from "../components/Header";
import Footer from "../components/Footer";

const GeneralLayout = () => {
    return (
        <div className="general-layout">
            <div className="header">
                <Header />
            </div>
            <div className="main">
                <ContentLayout />
            </div>
            <div className="footer">
                <Footer />
            </div>
        </div>
    );
};

export default GeneralLayout;