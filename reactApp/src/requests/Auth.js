import { axiosClient } from "./AxiosClient";
import { getRefreshToken } from "../utils/LocalStorage";

export const login = async (user, pass) => {
  const response = await axiosClient.post("login/", {
    username: user,
    password: pass,
  });
  localStorage.setItem("access_token", JSON.stringify(response.data["access"]));
  localStorage.setItem(
    "refresh_token",
    JSON.stringify(response.data["refresh"])
  );
  localStorage.setItem("user_info", JSON.stringify(response.data["user"]));
  return response.data["user"];
};

export const logout = async (username) => {
  const response = await axiosClient.post("logout/", {
    username: username,
  });
  localStorage.clear();
  return response.data["message"];
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
