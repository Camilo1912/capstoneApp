import { useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/register/Register";
import RegistrationContextProvider from "../contexts/RegitrationContext";

const GeneralLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <RegistrationContextProvider>
            <div className="public-layout">
                { (currentPath === '/register') ? <Register /> : <Login />}
            </div>
        </RegistrationContextProvider>
    );
};

export default GeneralLayout;