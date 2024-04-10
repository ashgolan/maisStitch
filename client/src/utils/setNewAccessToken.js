import { refreshAccessToken } from "./refreshToken";
import { getRefreshToken, setTokens } from "./tokensStorage";

export const refreshMyToken = async () => {
  const newAccessToken = await refreshAccessToken(getRefreshToken());
  setTokens(newAccessToken, getRefreshToken());
  return newAccessToken;
};
