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
    return user_info_obj.email;
}

export function getUserId() {
    const user_info = localStorage.getItem("user_info");
    const user_info_obj = JSON.parse(user_info);
    return user_info_obj.id;
}

export function getValidToken() {
    const valid_token = localStorage.getItem("access_token");
    return JSON.parse(valid_token);    
}

export function getRefreshToken() {
    const refresh_token = localStorage.getItem("refresh_token");
    return JSON.parse(refresh_token);
}