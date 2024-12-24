import {createContext, useContext, useEffect, useState} from 'react';

const DeviceContext = createContext();

const useDeviceTypeProvider = () => {
    const [deviceType, setDeviceType] = useState("desktop");

    useEffect(() => {
        // Define media queries for each device type
        const mobileQuery = window.matchMedia("(max-width: 768px)");
        const tabletQuery = window.matchMedia("(max-width: 1024px)");

        const updateDeviceType = () => {
            if (mobileQuery.matches) {
                setDeviceType("mobile");
            } else if (tabletQuery.matches) {
                setDeviceType("tablet");
            } else {
                setDeviceType("desktop");
            }
        };

        // Initial check
        updateDeviceType();

        // Set up listeners for each media query
        mobileQuery.addEventListener("change", updateDeviceType);
        tabletQuery.addEventListener("change", updateDeviceType);

        // Cleanup listeners on unmount
        return () => {
            mobileQuery.removeEventListener("change", updateDeviceType);
            tabletQuery.removeEventListener("change", updateDeviceType);
        };
    }, []);

    return deviceType;
};

export const DeviceProvider = ({children}) => {
    const deviceType = useDeviceTypeProvider();
    return <DeviceContext.Provider value={deviceType}>{children}</DeviceContext.Provider>;
}

export const useDeviceType = () => {
    return useContext(DeviceContext);
}
