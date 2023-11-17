import { axiosClient } from "./AxiosClient";
import axios from 'axios';

export const get_application_by_id = async (application_id) => {
    const response = await axiosClient.get(`applications/${application_id}`);
    return response;
};

export const application_create = async (newApplicationPayload) => {
    const response = await axiosClient.post("applications/", newApplicationPayload);
    return response;
};

export const application_verified_create = async (user_id) => {
    const response = await axiosClient.post(`applications/verified_certificate/${user_id}`, {application: {pay_amount: 0}});
    return response;
};

export const application_resource_create = async (user_id, payload) => {
    const response = await axiosClient.post(`applications/resource_application/${user_id}`, payload);
    return response;
};

export const applications_get = async () => {
    const response = await axiosClient.get("applications/");
    return response.data;
};

export const applications_get_by_neighborhood_id = async (neighborhood_id) => {
    const response = await axiosClient.get(`neighborhoods/${neighborhood_id}/applications`);
    return response;
};

export const application_update = async (application_id, updatePayload) => {
    const response = await axiosClient.put(`applications/${application_id}`, updatePayload);
    return response;
};

export const applications_get_by_neighbor_id = async (neighbor_id) => {
    const response = await axiosClient.get(`applications/index_by_neighbor/${neighbor_id}`);
    return response;
};

// export const submit_certificate_application = async (application_id, presidentId) => {
//     const formData = new FormData();
//     const file = new File( [await fetch('/capstoneApp/src/assets/images/sign.png').then((res) => res.blob())], 'sign.png');
//     formData.append('sign', file);
//     const response = await axiosClient.post(`neighborhoods/${application_id}/${presidentId}/certificate`, formData);
//     return response;
// };

export const submit_certificate_application = async (application_id, presidentId) => {
    const filepath = '/capstoneApp/src/assets/images/sign.png';

    const response1 = await axios.get(filepath, {responseType: 'blob'});

    const formData = new FormData();
    formData.append("sign", await fetch('/capstoneApp/src/assets/images/sign.png').then((res) => res.blob()), 'sign.png');
    const response = await axiosClient.post(`neighborhoods/${application_id}/${presidentId}/certificate`, formData);
    return response;
};


export const applications_guest_create_cert = async (userData) => {
    const formData = new FormData();
    formData.append("image_url_1", userData.image_front);
    formData.append("image_url_2", userData.image_back);
    formData.append("image_url_3", userData.image_face);
    formData.append("image_url_4", userData.image_invoice);

    delete userData.image_front;
    delete userData.image_back;
    delete userData.image_invoice;
    delete userData.image_face;
  

    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    const response = await axiosClient.post("applications/certificate", formData);
    return response;
};



export const get_resource_applications_by_neighborhood = async (neighborhood_id) => {
    const response = await axiosClient.get(`applications/resources/${neighborhood_id}`);
    return response;
};