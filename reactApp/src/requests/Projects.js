import { axiosClient } from "./AxiosClient";

export const project_by_id = async (project_number) => {
    const response = await axiosClient.get("project_by_id/", {
        params: {
            project_number: project_number,
        },
    });
    return response.data;
};