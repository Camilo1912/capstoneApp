import { axiosClient } from "./AxiosClient";

export const get_project_by_id = async (project_id) => {
    const response = await axiosClient.get(`projects/${project_id}`);
    return response;
};

export const project_create = async (project_info) => {
    const response = await axiosClient.post("projects/", project_info);
    return response;
};

export const project_states = async () => {
    const response = await axiosClient.get("project_states/");
    return response.data;
};

export const get_projects = async () => {
    const response = await axiosClient.get("projects/");
    return response.data;
};

export const get_projects_by_neighborhood_id = async (neighborhood_id) => {
    const response = await axiosClient.get(`neighborhoods/${neighborhood_id}/projects`);
    return response.data;
};

export const update_project_by_id = async (project_id, payload) => {
    const response = await axiosClient.put();
    return response;
};