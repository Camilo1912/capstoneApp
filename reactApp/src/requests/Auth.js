import { axiosClient } from "./AxiosClient";
import { getRefreshToken } from "../utils/LocalStorage";

export const login = async (user, pass) => {
  try {
    const response = await axiosClient.post("login/", {
      neighbor: {
        email: user,
        password: pass,
      }
    });

    if ("token" in response.data) {
      localStorage.setItem("access_token", JSON.stringify(response.data.token));
      // localStorage.setItem("refresh_token", JSON.stringify(response.data["refresh"]));
      localStorage.setItem("user_info", JSON.stringify(response.data["neighbor"]));
    } else { 
      console.error('Token not found in response data'); 
    }

    return response.data["neighbor"];
    
  } catch (error) {
    console.error("An error occurred during login:", error);

    if (error.response && error.response.status === 500) {
      console.error("Internal Server Error (500) occurred during login.");
    }
    throw error;
  }
};

//falta crear la url de logout
export const logout = async (user_id) => {
  let responseMsg = '';
  try {
    const response = await axiosClient.post("logout/", {
      id: user_id,
    });
    responseMsg = response.data["message"];
  } catch (error) {
    console.error("Error al cerrar sesión: ", error.response);
  }
  localStorage.clear();
  return responseMsg;
};

export const refreshToken = async (refresh) => {
  const response = await axiosClient.post("api/token/refresh/", {
    refresh: getRefreshToken(),
  });
  localStorage.setItem("access_token", JSON.stringify(response.data["access"]));
  localStorage.setItem(
    "refresh_token",
    JSON.stringify(response.data["refresh"])
  );
  return response.data["access"];
};
