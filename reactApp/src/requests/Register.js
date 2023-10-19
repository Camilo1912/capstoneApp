import { axiosClient } from "./AxiosClient";

export const register = async (userData) => {
    const response = await axiosClient.post("neighbors/", userData);
    return response.data;
};