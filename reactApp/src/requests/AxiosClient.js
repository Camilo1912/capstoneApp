import axios from "axios";
import { getValidToken } from "../utils/LocalStorage";
import { refreshToken } from "./Auth";

const Develop = "https://6520d42f906e276284c4b88b.mockapi.io/login";

export const axiosClient = axios.create({});

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
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const access_token = await refreshToken();
            axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
            return axiosClient(originalRequest);
        }
        return Promise.reject(error);
    }
);
