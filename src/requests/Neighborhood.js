import { axiosClient } from "./AxiosClient";

export const get_neighborhood_by_id = async(id) => {
    const response = await axiosClient.get(`neighborhoods/${id}`);
    return response;
};



export const get_neighborhood_by_commune_id = async(commune_id) => {
    try {
        const response = await axiosClient.get(`communes/${commune_id}/neighborhoods`);
        return response.data;
    } catch (error) {
        console.error('Error fetching neighborhoods by commue_id:', error);
        if (error.response) {
            console.error('Server responded with error:', error.response.data);
        } else if (error.request) {
            console.error('No response received from the server');
        } else {
            console.error('Error setting up the request:', error.message);
        }
        throw error;
    }
};