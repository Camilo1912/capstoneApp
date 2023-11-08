import { axiosClient } from "./AxiosClient";


export const poll_create = async (poll_info) => {
    const response = await axiosClient.post("polls/", poll_info);
    return response;
};

export const get_polls = async (neighborhoodId) => {
    const response = await axiosClient.get(`polls/by_neighborhood/${neighborhoodId}`);
    return response;
};

export const poll_submit_vote = async (poll_id, payload) => {
    console.log('enviando voto....');
    const response = await axiosClient.post(`polls/${poll_id}/vote`, payload);
    return response;
}

export const get_user_voting_status = async (poll_id, neighbor_id) => {
    const response = await axiosClient.get(`polls/${poll_id}/check_vote/${neighbor_id}`);
    return response;
};

export const update_poll_state = async (poll_id, new_poll_state) => {
    console.log(poll_id, '  ', new_poll_state);
    const response = await axiosClient.put(`polls/${poll_id}`, new_poll_state);
    return response;
};