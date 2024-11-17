import axios from "axios";
import {useAuth} from "../contexts/auth.context.jsx";

const http = axios.create({
    baseURL: 'https://webapi.healthalpha.ae/api',
})

// http.interceptors.request.use(async (config) => {
//     const {isAuthenticated, getToken} = useAuth();

//     const isLoggedIn = await isAuthenticated();
//     if (isLoggedIn) {
//         const token = await getToken();
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// })

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // localStorage.removeItem("token");
            // window.location.href = "/home";
            // window.location.reload();
        }
        return Promise.reject(error);
    }
);

export default http;