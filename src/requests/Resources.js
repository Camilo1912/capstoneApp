import { axiosClient } from "./AxiosClient";


export const get_resources_by_neighborhood_id = async (neighborhood_id) => {
    const response = await axiosClient.get(`neighborhoods/${neighborhood_id}/resources`);
    return response;
};

export const submit_resource = async (payload) => {
    const response = await axiosClient.post(`/resources`, payload);
    return response;
};

export const delete_resource = async (resource_id) => {
    const response = await axiosClient.delete(`/resources/${resource_id}`);
    return response;
};