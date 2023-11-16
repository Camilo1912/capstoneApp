import { axiosClient } from "./AxiosClient";


export const get_resources_by_neighborhood_id = async (neighborhood_id) => {
    const response = await axiosClient.get(`neighborhoods/${neighborhood_id}/resources`);
    return response;
};