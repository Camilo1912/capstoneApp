import { axiosClient } from "./AxiosClient";

export const get_application_by_id = async (application_id) => {
    const response = await axiosClient.get(`applications/${application_id}`);
    return response;
};

export const application_create = async (newApplicationPayload) => {
    const response = await axiosClient.post("applications/", newApplicationPayload);
    return response;
};

export const applications_get = async () => {
    const response = await axiosClient.get("applications/");
    return response.data;
};

export const applications_get_by_neighborhood_id = async (neighborhood_id) => {
    const response = await axiosClient.get(`neighborhoods/${neighborhood_id}/applications`);
    return response;
};

export const application_update = async (application_id, updatePayload) => {
    const response = await axiosClient.put(`applications/${application_id}`, updatePayload);
    return response;
};