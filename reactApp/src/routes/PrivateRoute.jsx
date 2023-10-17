import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/LocalStorage";
import PrivateLayout from "../layouts/PrivateLayout";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

const PrivateRoute = ({allowedRoles=[], redirectPath = "/", children }) => {
    const { userInfo } = useContext(UserContext);

    if (!isAuthenticated() || !userInfo) {
        return <Navigate to={redirectPath} replace />;
    }
        
    const userRole = userInfo.role && userInfo.role.role_id;
    
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? (
        children
    ) : (
        <PrivateLayout>
            <Outlet />
        </PrivateLayout>
    );
};

export default PrivateRoute;