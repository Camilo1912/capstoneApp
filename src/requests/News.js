import { axiosClient } from "./AxiosClient";

export const get_announcements_by_neighborhood_id = async (neighborhood_id) => {
    const response = await axiosClient.get(`neighborhoods/${neighborhood_id}/announcements`);
    return response;
};


export const get_announcements = async () => {
    const response = await axiosClient.get('announcements/');
    return response.data;
};

export const submit_new_announcement = async (announcement) => {
    const formData = new FormData();
    console.log(announcement);
    formData.append("image_1", announcement.image_1);
    delete announcement.image_1;
    for (const key in announcement) {
        formData.append(key, announcement[key]);
    }
    const response = await axiosClient.post('announcements/', formData);
    return response;
};

export const update_announcement = async (announcement_id, payload) => {
    const response = await axiosClient.put(`announcements/${announcement_id}`, payload);
    return response;
};

export const delete_announcement = async (announcement_id) => {
    const response = await axiosClient.delete(`announcements/${announcement_id}`);
    return response;
};
