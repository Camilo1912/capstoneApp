import { axiosClient } from "./AxiosClient";

export const get_activitie_by_id = async (activitie_id) => {
    const response = await axiosClient.get(`activities/${activitie_id}`);
    return response;
};

export const activitie_create = async (newActivitiePayload) => {
    const response = await axiosClient.post("activities/", newActivitiePayload);
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

export const activitie_update = async (activitie_id, updatePayload) => {
    const response = await axiosClient.put(`activities/${activitie_id}`, updatePayload);
    return response;
};