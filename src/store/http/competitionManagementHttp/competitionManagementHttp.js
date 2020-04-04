import axios from "axios";

const competitionManagementHttp = axios.create({

    baseURL: "https://competition-api-dev.worldsportaction.com",
});

competitionManagementHttp.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default competitionManagementHttp;
