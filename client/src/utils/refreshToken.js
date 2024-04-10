import { Api } from "./Api";

export const refreshAccessToken = async (refreshToken) => {
  try {
    const { data } = await Api.post("user/refresh", {
      refreshToken: refreshToken,
    });
    const newAccessToken = data.accessToken;
    return newAccessToken;
  } catch (error) {
    throw error;
  }
};
