import {createContext, useContext, useEffect, useState} from 'react';
import {useEncrypt} from "@hooks/EncryptData.jsx";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {usePermissions} from "@contexts/Permission.jsx";
import useHttp from "@hooks/AxiosInstance.jsx";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext({
    fetchUserDetails: () => {
    }, setUserDetails: (data) => {
    }, logoutUser: () => {
    }, loginUser: () => {
    }, getToken: () => String, isAuthenticated: () => Boolean
})

export const AuthProvider = ({children}) => {
    const {apiConfig} = useApiConfig();
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [error, setError] = useState(null);
    const {getEncryptedData} = useEncrypt();
    const [userRole, setUserRole] = useState(null);
    const {permissions} = usePermissions();
    const http = useHttp();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            logoutUser();
            navigate('/');
        }
        const role = getEncryptedData('roles');
        if (role) setUserRole(role.toLowerCase());
    }, [userRole])

    const fetchUserDetails = async () => {
        const userId = await getEncryptedData('user');
        const role = userRole || getEncryptedData('roles')?.toLowerCase();
        const endpoint = await getUserDetailsEndpoint(userId, role);
        if (role === 'admin' || role === 'doctor') {
            try {
                if (endpoint) {
                    const response = await http.get(endpoint);
                    const {data} = response;
                    if (data) {
                        setUser(data);
                        return data;
                    }
                }
            } catch (error) {
                const errorMessage = error.message
                toast.error(errorMessage)
                return null
            }
        }
    }

    const getUserDetailsEndpoint = async (userId, role) => {
        let endpoint = '';
        switch (role) {
            case "admin":
                endpoint = apiConfig.admin.getAdminInfoById(userId);
                break;
            case "client":
                endpoint = '';
                break;
            case "doctor":
                endpoint = apiConfig.doctors.getDoctorInfoById(userId);
                break;
        }

        return endpoint;
    }

    const setUserDetails = (userDetails) => {
        setUser(userDetails);
    }

    const logoutUser = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('profile_image');
        localStorage.removeItem('roles');
        localStorage.clear();
        sessionStorage.clear();
        setIsLoggedIn(false)
    }

    const loginUser = async () => {
        const isSingedIn = await isAuthenticated()
        if (isSingedIn) {
            setIsLoggedIn(true)
        }
    }

    const getToken = async () => {
        return localStorage.getItem('token')
    }

    const isAuthenticated = () => {
        const userString = getEncryptedData('user');
        let _user = null;
        if (userString) {
            try {
                _user = JSON.parse(userString);
            } catch (e) {
                console.error('Error parsing user:', e);
            }
        }

        const hasUserObj = _user && typeof _user === 'object' && Object.keys(_user).length > 0;
        // return hasUserObj && !!localStorage.getItem('token');
        return !!localStorage.getItem('token');
    };

    return (<AuthContext.Provider
        value={{
            user, getToken, setUserDetails, fetchUserDetails, logoutUser, loginUser, isAuthenticated
        }}
    >
        {children}
    </AuthContext.Provider>)
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}
