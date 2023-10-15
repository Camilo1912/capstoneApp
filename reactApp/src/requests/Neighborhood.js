import { axiosClient } from "./AxiosClient";

export const get_neighborhood_by_id = async (id) => {
    try {
        const response = await axiosClient.get('http://127.0.0.1:3000/neighborhoods/'+id);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching role by ID:', error);
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