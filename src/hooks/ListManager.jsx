import {useCallback, useEffect, useState} from "react";
import useHttp from "@hooks/AxiosInstance.jsx";
import {useMantineTheme} from "@mantine/core";
import {openNotificationWithSound} from "@config/Notifications.js";

export function useListManager({apiEndpoint, onRefreshCallback}) {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const http = useHttp();
    const theme = useMantineTheme();


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await http.get(apiEndpoint);
            if (response?.status === 200) {
                setDataSource(response.data);
            }
        } catch (err) {
            setDataSource([]);
            const {name, message} = err;
            openNotificationWithSound({
                title: name,
                message: message,
                color: theme.colors.red[6]
            }, {withSound: false});
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint]);

    const handleRefresh = useCallback(() => {
        fetchData().then(() => {
            onRefreshCallback?.();
        });
    }, [fetchData, onRefreshCallback]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        loading,
        dataSource,
        fetchData,
        handleRefresh,
    };
}