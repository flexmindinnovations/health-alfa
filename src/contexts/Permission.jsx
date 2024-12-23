import {createContext, useContext, useEffect, useState} from "react";
import {useEncrypt} from "@hooks/EncryptData.js";

const roles = {
    Doctor: ['DASHBOARD', 'CLIENTS', 'AVAILABILITY']
}

const PermissionContext = createContext({
    userRole: '',
    permissions: []
});

export const PermissionsProvider = ({children}) => {
    const {getEncryptedData} = useEncrypt();
    const [userRole, setUserRole] = useState('');
    const [permissions, setPermissions] = useState([]);


    useEffect(() => {
        const _userRole = getEncryptedData('roles');
        if (_userRole) {
            setUserRole(_userRole);
            setPermissions(roles[_userRole]);
        }
    }, [roles]);

    return (
        <PermissionContext.Provider value={{userRole, permissions}}>
            {children}
        </PermissionContext.Provider>
    )
}

export const usePermissions = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('useApiConfig must be used within an ApiConfigProvider')
    }
    return context
}