import { axiosClient } from "./AxiosClient";

// export const register = async (userData) => {
//     const response = await axiosClient.post("neighbors/", userData);
//     return response;
// };


export const register = async (userData) => {
    const formData = new FormData();
    formData.append("image_front", userData.image_front);
    formData.append("image_back", userData.image_back);
    formData.append("image_invoice", userData.image_invoice);
    formData.append("image_face", userData.image_face);

    delete userData.image_front;
    delete userData.image_back;
    delete userData.image_invoice;
    delete userData.image_face;
  
 
    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    const response = await axiosClient.post("neighbors/", formData);
    return response;
};