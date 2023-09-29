import { createContext, useState } from "react";
import { getUser } from "../utils/LocalStorage";

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [userInfo, setUserInfo] = useState(getUser());
    const [userMenuContent, setUserMenuContent] = useState([]);
    const [userActiveContent, setUserActiveContent] = useState("1");

    const handleUserInfo = (user_info) => {
        setUserInfo(user_info);
    };

    const handleMenuContent = (menuOptions) => {
        setUserMenuContent(menuOptions);
    };

    const handleActiveContent = (value) => {
        setUserActiveContent(value);
    };

    return (
        <UserContext.Provider
            value={{
                userInfo,
                handleUserInfo,
                userMenuContent,
                handleMenuContent,
                userActiveContent,
                handleActiveContent,
            }}
        >
        {props.children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;