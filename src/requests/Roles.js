import axios from 'axios';
import { axiosClient } from './AxiosClient';

export const allRoles = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:3000/roles');
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

export const get_roles_by_id = async (id) => {
    try {
        const response = await axios.get('http://127.0.0.1:3000/roles/${id}');
        return response.data;
    } catch (error) {
        console.error('Error fetching role by ID:', error);
        // You might want to handle different error scenarios here
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server responded with error:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from the server');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up the request:', error.message);
        }
        throw error;
    }
};

export const set_user_rol = async (user_id, new_rol) => {
    const payload = {
        neighbor: {

            role_id: new_rol,
        }
    }
    const response = await axiosClient.put(`neighbors/${user_id}`, payload);
    return response;
};