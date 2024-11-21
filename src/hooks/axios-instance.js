import axios from "axios";
import { useAuth } from "@contexts/AuthContext.jsx";

const useHttp = () => {
    const { isAuthenticated, getToken } = useAuth();

    const http = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    http.interceptors.request.use(
        async (config) => {
            const isLoggedIn = await isAuthenticated();
            if (isLoggedIn) {
                const token = await getToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    http.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                console.error("Unauthorized - handle logout or redirect.");
            }
            return Promise.reject(error);
        }
    );

    return http;
};

export default useHttp;
