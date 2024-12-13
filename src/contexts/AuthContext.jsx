import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";

const AuthContext = createContext({
    fetchUserDetails: () => { },
    setUserDetails: (data) => { },
    logoutUser: () => { },
    loginUser: () => { },
    getToken: () => String,
    isAuthenticated: () => Boolean
})

export const AuthProvider = ({ children }) => {
    const { apiConfig } = useApiConfig();
    const [user, setUser] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [error, setError] = useState(null)

    const fetchUserDetails = async () => {
        // console.log('called fetchUserDetails');

        // try {
        //     const user = JSON.parse(localStorage.getItem('user') || '{}');
        //     console.log('user: ', user);

        //     const getUserDetails = apiConfig.customer.getCustomerById(user) || "";
        //     console.log('getUserDetails: ', getUserDetails);

        //     const response = await http.get(getUserDetails);
        //     const { data } = response;
        //     if (data) {
        //         setUser(data);
        //         return data;
        //     }
        // } catch (error) {
        //     const errorMessage = error.message
        //     toast.error(errorMessage)
        //     return null
        // }
    }

    const setUserDetails = (userDetails) => {
        console.log('userDetails: ', userDetails)
        setUser(userDetails);
    }

    const logoutUser = async () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
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
        const userString = localStorage.getItem('user');
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

    return (
        <AuthContext.Provider
            value={{
                user,
                getToken,
                setUserDetails,
                fetchUserDetails,
                logoutUser,
                loginUser,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}
