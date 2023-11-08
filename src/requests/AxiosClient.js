import axios from "axios";
import { getValidToken } from "../utils/LocalStorage";
import { refreshToken } from "./Auth";

// const Develop = "http://127.0.0.1:3000/";
const Develop = "https://calm-ravine-26914-08e68e4d0255.herokuapp.com/";

export const axiosClient = axios.create({
    baseURL: Develop,
});

axiosClient.interceptors.request.use(function (config) {
    const access_token = getValidToken();
    config.headers.Authorization = access_token ? `Bearer ${access_token}` : "";
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const access_token = await refreshToken();
                axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                // Handle refresh token error
                console.error("Error refreshing token:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }

);
