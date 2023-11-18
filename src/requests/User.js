import { axiosClient } from "./AxiosClient";

export const user_update = async (user_id, payload) => {
    const response = await axiosClient.patch(`neighbors/${user_id}`, payload);
    return response.data;
};

export const get_user_by_id = async (user_id) => {
    const response = await axiosClient.get(`neighbors/${user_id}`);
    return response.data;
};

export const get_users_by_neighborhood_id = async (neighborhood_id) => {
    const response = await axiosClient.get(`neighborhoods/${neighborhood_id}/neighbors`);
    return response;
};

export const remove_user_by_id = async (neighbor_id) => {
    const response = await axiosClient.delete(`neighbors/${neighbor_id}`);
    return response;
};
