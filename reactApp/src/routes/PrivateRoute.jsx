import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/LocalStorage";
import PrivateLayout from "../layouts/PrivateLayout";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

const PrivateRoute = ({allowedRoles=[], redirectPath = "/", children }) => {
    const { userInfo } = useContext(UserContext);

    if (!isAuthenticated() || !allowedRoles.includes(userInfo.role_id)) {
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