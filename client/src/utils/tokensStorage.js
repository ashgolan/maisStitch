import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY.toString();
const ACCESS_TOKEN_KEY = process.env.REACT_APP_ACCESS_TOKEN_KEY.toString();
const REFRESH_TOKEN_KEY = process.env.REACT_APP_REFRESH_TOKEN_KEY.toString();
const USERID_KEY = process.env.REACT_APP_USERID_KEY.toString();

const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};
const decrypt = (ciphertext) => {
  let bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const setTokens = (accessToken, refreshToken) => {
  const encryptedAccessToken = encrypt(accessToken);
  const encryptedRefreshToken = encrypt(refreshToken);

  Cookies.set(ACCESS_TOKEN_KEY, encryptedAccessToken, { expires: 7 }); // Set expiration in days
  Cookies.set(REFRESH_TOKEN_KEY, encryptedRefreshToken, { expires: 7 }); // Set expiration in days
};

export const getAccessToken = () => {
  const encryptedAccessToken = Cookies.get(ACCESS_TOKEN_KEY);
  return encryptedAccessToken ? decrypt(encryptedAccessToken) : null;
};
export const setUserId = (userId) => {
  const encryptedUserId = encrypt(userId);
  Cookies.set(USERID_KEY, encryptedUserId, { expires: 7 }); // Set expiration in days
};
export const getUserId = () => {
  const encryptedUserId = Cookies.get(USERID_KEY);
  return encryptedUserId ? decrypt(encryptedUserId) : null;
};

export const deleteUserId = () => {
  Cookies.remove(USERID_KEY);
};
export const getRefreshToken = () => {
  const encryptedRefreshToken = Cookies.get(REFRESH_TOKEN_KEY);
  return encryptedRefreshToken ? decrypt(encryptedRefreshToken) : null;
};

export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};
