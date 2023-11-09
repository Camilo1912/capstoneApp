import { axiosClient } from "./AxiosClient";

// export const register = async (userData) => {
//     const response = await axiosClient.post("neighbors/", userData);
//     return response;
// };


export const register = async (userData) => {
    // Crear un nuevo objeto FormData que incluye el archivo de imagen
    const formData = new FormData();
    formData.append("image_front", userData.image_front); // "image" es el campo del formulario que esperas en el servidor
    formData.append("image_back", userData.image_back);
    formData.append("image_invoice", userData.image_invoice);
    formData.append("image_face", userData.image_face);
    // Elimina el campo "image" del objeto userData, ya que lo hemos agregado al FormData
    delete userData.image_front;
    delete userData.image_back;
    delete userData.image_invoice;
    delete userData.image_face;
  
    // Agrega el resto de los datos del formulario al FormData
    for (const key in userData) {
      formData.append(key, userData[key]);
    }
    const response = await axiosClient.post("neighbors/", formData);
    return response;
};