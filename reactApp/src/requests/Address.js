import { axiosClient } from "./AxiosClient";

export const get_regions = async () => {
    const response = await axiosClient.get(`regions`);
    return response.data;
};

export const get_communes = async () => {
    const response = await axiosClient.get("communes/");
    return response.data;
};

export const get_communes_by_region = async (region_id) => {
    const response = await axiosClient.get(`communes/${region_id}`);
    return response.data;
};

