export function isAuthenticated() {
    const accessApiToken = localStorage.getItem("access_token");
    return accessApiToken !== null;
}

export function getUser() {
    const user_info = localStorage.getItem("user_info");
    if (user_info === null) {
        return {};
    }
    const user_info_obj = JSON.parse(user_info);
    return user_info_obj;
}

export function getUsername() {
    const user_info = localStorage.getItem("user_info");
    const user_info_obj = JSON.parse(user_info);
    return user_info_obj.user.username;
}

