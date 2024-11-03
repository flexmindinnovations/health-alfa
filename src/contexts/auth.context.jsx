import {createContext, useContext, useState} from "react";
import toast from "react-hot-toast";
import {useApiConfig} from "./api-config.context.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    // const apiConfig = useApiConfig();
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);


    const fetchUserDetails = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            // const getUserDetails = apiConfig.customer.getCustomerById(user.customerId) || "";
            // const response = await http.get(getUserDetails);
            // const {data} = response;
            // if (data) {
            //     setUser(data);
            //     return data;
            // }
        } catch (error) {
            const errorMessage = error.message;
            toast.error(errorMessage);
            return null;
        }
    }


    const logoutUser = async () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        window.location.reload();
    };

    const loginUser = async () => {
        const isSingedIn = await isAuthenticated();
        if (isSingedIn) {
            setIsLoggedIn(true);
        }
    };

    const isAuthenticated = async () => {
        const _user = JSON.parse(localStorage.getItem("user") || "{}");
        const hasUserObj = _user && typeof _user === "object" && Object.keys(_user).length > 0;
        return hasUserObj && !!localStorage.getItem("token");
    };

    return (
        <AuthContext.Provider value={{user, fetchUserDetails, logoutUser, loginUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}