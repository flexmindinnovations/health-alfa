import { createContext, useContext } from "react";

const ApiConfigContext = createContext(null);

export const ApiConfigProvider = ({ children }) => {
    const apiConfig = {
        user: {
            login: ``,
            register: ``,
            getUserDetails: ``
        }
    };

    return (
        <ApiConfigContext.Provider value={apiConfig}>
            {children}
        </ApiConfigContext.Provider>
    );
};

export const useApiConfig = () => {
    const context = useContext(ApiConfigContext);
    if (!context) throw new Error("useApiConfig must be used within an ApiConfigProvider");
    return context;
};
