import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/LocalStorage";
import PrivateLayout from "../layouts/PublicLayout";

const PrivateRoutes = ({ redirectPath = "/", children }) => {
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

export default PrivateRoutes;