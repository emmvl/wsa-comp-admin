import axios from "axios";

const http = axios.create({
  baseURL: "https://netball-api-stg.worldsportaction.com/users/",
});

http.interceptors.request.use(function (config) {
  const token = localStorage.token;
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default http;
