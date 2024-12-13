import { useEffect, useState, useMemo, useCallback } from 'react'
import { Container, useMantineTheme } from '@mantine/core'
import { useDocumentTitle } from '@hooks/DocumentTitle'
import { useTranslation } from 'react-i18next'
import { DataTableWrapper } from '@components/DataTableWrapper'
import { AddEditClient } from '@modals/AddEditClient'
import { useApiConfig } from '@contexts/ApiConfigContext.jsx'
import useHttp from '@hooks/axios-instance'
import { modals } from "@mantine/modals";
import dayjs from 'dayjs';

export default function Users() {
    const { t, i18n } = useTranslation();
    const [columns, setColumns] = useState();
    const [dataSource, setDataSource] = useState();
    const [loading, setLoading] = useState();
    const { apiConfig } = useApiConfig();
    const http = useHttp();
    const theme = useMantineTheme();
    useDocumentTitle(t('clients'));

    const props = {
        resizable: true,
        sortable: true,
        // toggleable: true,
        // draggable: true,
    };

    const _columns = useMemo(() =>
        [
            {
                accessor: 'clientId',
                title: t('id'),
                width: 80,
                style: { padding: '10px' },
            },
            {
                accessor: 'profileImagePath',
                title: t('profileImagePath'),
                width: 80,
                style: { padding: '10px' },
                render: (record) => {
                    const imageEndpoint = record.profileImagePath;
                    const host = import.meta.env.VITE_API_URL;
                    const imageUrl = `${host}/${imageEndpoint}`.replace('/api', '');
                    return (
                        <img
                            src={imageUrl}
                            alt={t('profileImage')}
                            style={{
                                width: '30px',
                                height: '30px',
                                margin: '0 auto',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    )
                }
            },
            {
                accessor: 'firstName',
                title: t('firstName'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
            {
                accessor: 'middleName',
                title: t('middleName'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
            {
                accessor: 'lastName',
                title: t('lastName'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
            {
                accessor: 'emergencyContactNumber',
                title: t('emergencyContactNumber'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
            {
                accessor: 'emailId',
                title: t('emailId'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
            {
                accessor: 'mobileNo',
                title: t('mobileNo'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
            {
                accessor: 'gender',
                title: t('gender'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
            {
                accessor: 'bloodType',
                title: t('bloodType'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
            {
                accessor: 'dateOfBirth',
                title: t('dateOfBirth'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props,
                render: (record) => dayjs(record.dateOfBirth).format('DD/MM/YYYY'),
            },
            {
                accessor: 'height',
                title: t('height'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
            {
                accessor: 'clientAddress',
                title: t('address'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                ...props
            },
        ], [t])

    useEffect(() => {
        if (i18n.isInitialized) {
            setColumns(_columns);
            getClientList();
        }
    }, [i18n.language]);

    const getClientList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await http.get(apiConfig.clients.getList);
            if (response?.status === 200) {
                const data = response.data;
                setDataSource(data);
            }
        } catch (err) {
            setDataSource([]);
            const { name, message } = err;
            openNotificationWithSound({
                title: name,
                message: message,
                color: theme.colors.red[6]
            }, { withSound: false })
        } finally {
            setLoading(false);
        }
    }, [])

    const handleAddEdit = (data, mode) => {
        openAddEditModal({ data, mode });
    }

    const closeModals = (data) => {
        const { refresh } = data;
        if (refresh) handleOnRefresh();
        modals.closeAll();
    }

    const handleOnRefresh = async () => {
        await getClientList();
    }

    const openAddEditModal = ({ data = null, mode = 'add' }) => {
        modals.open({
            title: `${mode === "edit" ? t("edit") : t("add")}` + ` ${t("client")}`,
            centered: true,
            size: 'xl',
            styles: {
                body: {
                    marginTop: '1rem'
                }
            },
            children: (
                <AddEditClient
                    mode={mode}
                    data={data}
                    handleCancel={(refresh) => closeModals(refresh)}
                />
            )
        })
    }

    return (
        <Container>
            <DataTableWrapper
                loading={loading}
                showAddButton={true}
                id={'clientId'}
                addTitle={t('testType')}
                columns={columns}
                dataSource={dataSource}
                handleOnAdd={(data) => handleAddEdit(data, 'add')}
                handleOnEdit={data => handleAddEdit(data, 'edit')}
                handleOnDelete={data => handleDelete(data)}
                onRefresh={() => handleOnRefresh()}
            />
        </Container>
    )
}
