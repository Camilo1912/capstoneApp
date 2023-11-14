import { axiosClient } from "./AxiosClient";

export const get_activity_by_id = async (activity_id) => {
    const response = await axiosClient.get(`activities/${activity_id}`);
    return response;
};

export const activity_create = async (newActivityPayload) => {
    const response = await axiosClient.post("activities/", newActivityPayload);
    return response;
};

export const activities_get = async () => {
    const response = await axiosClient.get("activities/");
    return response.data;
};

export const activities_get_by_neighborhood_id = async (neighborhood_id) => {
    const response = await axiosClient.get(`neighborhoods/${neighborhood_id}/activities`);
    return response;
};

export const activity_update = async (activity_id, updatePayload) => {
    const response = await axiosClient.put(`activities/${activity_id}`, updatePayload);
    return response;
};

export const activity_join = async (activity_id, updatePayload) => {
    const response = await axiosClient.put(`activities/${activity_id}/sign_in`, updatePayload);
    return response;
};

export const activity_delete = async (activity_id) => {
    const response = await axiosClient.delete(`activities/${activity_id}`);
    return response;
};