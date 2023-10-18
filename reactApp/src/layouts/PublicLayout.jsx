import { useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/register/Register";

const GeneralLayout = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="public-layout">
            { (currentPath === '/register') ? <Register /> : <Login />}
        </div>
    );
};

export default GeneralLayout;