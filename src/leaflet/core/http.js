import axios from "axios";
import L from "leaflet";

const http = axios.create({
    // timeout : 60
});

http.interceptors.response.use(
    function(response) {
        // 对响应数据做点什么
        return response.data;
    },
    function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

L.http = http;

export default http;
