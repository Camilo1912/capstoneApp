import { createContext, useState, useEffect } from "react";
import { getUser } from "../utils/LocalStorage";

export const UserContext = createContext();

const UserContextProvider = (props) => {
    const [userInfo, setUserInfo] = useState(getUser());
    const [userMenuContent, setUserMenuContent] = useState([]);
    const [userActiveContent, setUserActiveContent] = useState("1");

    useEffect(() => {
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        console.log(userInfo);
    }, [userInfo]);

    const handleUserInfo = (user_info) => {
        setUserInfo(user_info);
        // localStorage.setItem('userInfo',JSON.stringify(user_info));
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