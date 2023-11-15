import { axiosClient } from "./AxiosClient";

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

export const applications_get_by_neighbor_rut = async (neighborhood_id, neighbor_rut) => {
    const response = await axiosClient.get(`applications/${neighborhood_id}/${neighbor_rut}`);
    return response;
};

export const submit_certificate_application = async (payload) => {
    const formData = new FormData();
    formData.append("file", payload.pdffile);
    delete payload.pdffile;
    for (const key in payload) {
        formData.append(key, payload[key]);
    }
    const response = await axiosClient.post('applications/', formData);
    return response;
};