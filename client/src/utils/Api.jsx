import axios from "axios";
let url = "http://localhost:5000";

if (process.env.NODE_ENV === "production") {
  url = "https://khaled-khateeb-server.onrender.com";
}

const Api = axios.create({
  baseURL: url,
});
export { Api, url };
