import { axiosClient } from "./AxiosClient";

export const project_by_id = async (project_number) => {
    const response = await axiosClient.get("project_by_id/", {
        params: {
            project_number: project_number,
        },
    });
    return response.data;
};


export const project_create = async (project_info) => {
    const response = await axiosClient.post("projects/", project_info);
    return response.data;
};


export const project_states = async () => {
    const response = await axiosClient.get("project_states/");
    return response.data;
};
