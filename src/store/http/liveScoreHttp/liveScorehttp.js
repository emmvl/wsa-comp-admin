import axios from "axios";

const http = axios.create({
    // baseURL: "http://13.237.1.133:8085"
    // baseURL: "https://world-sport-action-socket.appspot.com"
    baseURL: "http://a90830342b690491db1e89b76ed1d900-512956195.ap-southeast-2.elb.amazonaws.com/livescores/"
    // baseURL: "http://192.168.3.98:3001"
    // baseURL: "http://192.168.3.98:8083/"
});

http.interceptors.request.use(function (config) {
    const token = localStorage.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default http;
