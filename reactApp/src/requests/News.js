import { axiosClient } from "./AxiosClient";

export const get_announcements_by_neighborhood_id = async (neighborhood_id) => {
    const response = await axiosClient.get(`neighborhoods/${neighborhood_id}/announcements`);
    return response.data;
};


export const get_announcements = async () => {
    const response = await axiosClient.get('announcements/');
    return response.data;
};