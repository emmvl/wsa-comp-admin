import axios from "axios";

const competitionManagementHttp = axios.create({

    baseURL: "http://ac3812371ecb342998edfafd640b8ad7-673095728.ap-southeast-2.elb.amazonaws.com/competition",
});

competitionManagementHttp.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default competitionManagementHttp;
