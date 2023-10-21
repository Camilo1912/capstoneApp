import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/LocalStorage";
import PrivateLayout from "../layouts/PrivateLayout";

const PrivateRoute = ({ redirectPath = "/", children }) => {
    if (!isAuthenticated()) {
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