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


export const neighborhood_create = async (neighborhood_data) => {
    const formData = new FormData();
    formData.append("image_1", neighborhood_data.logo_url);


    delete neighborhood_data.logo_url;

    for (const key in neighborhood_data) {
      formData.append(key, neighborhood_data[key]);
    }
    const response = await axiosClient.post("neighborhoods", formData);
    return response;
};


export const neighborhood_delete = async (neighborhood_id) => {
    const response = await axiosClient.delete(`/neighborhoods/${neighborhood_id}`);
    return response
};