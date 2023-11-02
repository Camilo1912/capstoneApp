import { axiosClient } from "./AxiosClient";


export const poll_create = async (poll_info) => {
    const response = await axiosClient.post("polls/", poll_info);
    return response;
};

export const get_polls = async (neighborhoodId) => {
    const response = await axiosClient.get(`polls/by_neighborhood/${neighborhoodId}`);
    return response;
}
