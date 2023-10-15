import { axiosClient } from "./AxiosClient";

export const user_update = async (user_id, payload) => {
    const response = await axiosClient.patch(`neighbors/${user_id}`, payload);
    return response.data;
};