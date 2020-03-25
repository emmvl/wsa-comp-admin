import axios from "axios";

const competitionManagementHttp = axios.create({

    baseURL: "http://a90830342b690491db1e89b76ed1d900-512956195.ap-southeast-2.elb.amazonaws.com/competition",
});

competitionManagementHttp.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default competitionManagementHttp;
