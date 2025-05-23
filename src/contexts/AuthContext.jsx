import { createContext, useContext, useEffect, useState } from 'react';
import { useEncrypt } from "@hooks/EncryptData.jsx";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { usePermissions } from "@contexts/Permission.jsx";
import useHttp from "@hooks/AxiosInstance.jsx";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext({
    fetchUserDetails: () => {
    }, setUserDetails: (data) => {
    }, logoutUser: () => {
    }, loginUser: () => {
    }, getToken: () => String, isAuthenticated: () => Boolean
})

export const AuthProvider = ({ children }) => {
    const { apiConfig } = useApiConfig();
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { getEncryptedData } = useEncrypt();
    const [userRole, setUserRole] = useState(null);
    const { permissions } = usePermissions();
    const http = useHttp();
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        const pathname = location.pathname.split('/')[1];
        const publicPaths = ['login', 'register']
        if (!isAuthenticated() && !publicPaths.includes(pathname)) {
            logoutUser();
            navigate('/');
        }
        const role = getEncryptedData('roles');
        if (role) setUserRole(role.toLowerCase());
    }, [userRole])

    useEffect(() => {
        const pathname = location.pathname.split('/')[1];
        const publicPaths = ['about-us', 'contact-us', 'login', 'register'];
        if (!isAuthenticated() && !publicPaths.includes(pathname)) {
            navigate('/');
        }

        const handleBackButton = (event) => {
            if (!isAuthenticated() && !publicPaths.includes(pathname)) {
                event.preventDefault();
                navigate('/');
            } else if (isAuthenticated() && publicPaths.includes(pathname)) {
                event.preventDefault();
                navigate('/');
            }
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handleBackButton);

        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [location.pathname]);

    const fetchUserDetails = async () => {
        try {
            const userId = await getEncryptedData('user');
            console.log('Retrieved user ID:', userId); // Debug log
            const role = userRole || (await getEncryptedData('roles'))?.toLowerCase();
            if (role) {
                const userRoles = ['admin', 'doctor', 'client', 'user', 'User'];

                if (!userRoles.includes(role)) {
                    toast.error('Invalid user role');
                    return null;
                }

                const endpoint = getUserDetailsEndpoint(userId, role);
                if (!endpoint) {
                    toast.error('No endpoint found for the user role');
                    return null;
                }

                const response = await http.get(endpoint);
                if (response?.data) {
                    const { data } = response;
                    console.log('Fetched user details:', data); // Debug log
                    setUser(data);
                    return data;
                }
            } else {
                toast.error('Unauthorized');
            }
        } catch (error) {
            console.error('Error fetching user details:', error); // Debug log
            const errorMessage = error.message;
            toast.error(errorMessage);
            return null;
        }
    }

    const getUserDetailsEndpoint = (userId, role) => {
        let endpoint = '';
        switch (role) {
            case "admin":
                endpoint = apiConfig.admin.getAdminInfoById(userId);
                break;
            case "client":
            case "user":
            case "User":
                endpoint = apiConfig.clients.clientInfo(userId);
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
