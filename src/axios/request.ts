// import { message } from "./../components/Antd/EscapeAntd";
import axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

const instance: AxiosInstance = axios.create({
    baseURL: ``,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
    }
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config;
}, err => {
    return Promise.reject(err);
});

/**
 * 响应拦截器
 */
instance.interceptors.response.use((res: AxiosResponse) => {

    console.log('这里是响应拦截器', res)

    return res;
}, err => {
    return Promise.reject(err.response);
})


export default instance;