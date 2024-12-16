import { useEffect, useState, useMemo } from "react";
import { Container, useMantineTheme } from "@mantine/core";
import { DataTableWrapper } from "@components/DataTableWrapper";
import { useTranslation } from "react-i18next";
import useHttp from "@hooks/axios-instance";
import { useApiConfig } from "@contexts/ApiConfigContext";
import { modals } from "@mantine/modals";
import { openNotificationWithSound } from '@config/Notifications';
import { AddEditDoctor } from '@modals/AddEditDoctor';
import { useDocumentTitle } from '@hooks/DocumentTitle';

export default function Doctors() {
    const { t, i18n } = useTranslation();
    const [columns, setColumns] = useState();
    const [dataSource, setDataSource] = useState();
    const [loading, setLoading] = useState();
    const { apiConfig } = useApiConfig();
    const http = useHttp();
    const theme = useMantineTheme();
    useDocumentTitle(t('doctors'))

    const _columns = useMemo(() =>
        [
            {
                accessor: 'doctorId',
                title: t('id'),
                width: 80,
                style: { padding: '10px' },
            },
            {
                accessor: 'doctorName',
                title: t('doctorName'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
            },
            {
                accessor: 'doctorAddress',
                title: t('address'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
            },
            {
                accessor: 'doctorDegree',
                title: t('doctorDegree'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
            },
        ], [t])

    useEffect(() => {
        if (i18n.isInitialized) {
            setColumns(_columns);
            getDoctorList();
        }
    }, [i18n.language, _columns]);

    const getDoctorList = async () => {
        setLoading(true);
        try {
            const response = await http.get(apiConfig.doctors.getList);
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
    }

    const handleAddEdit = (data, mode) => {
        openAddEditModal({ data, mode });
    }

    const handleDelete = async (data) => {
        closeModals();
    }

    const closeModals = (data = null) => {
        const { refresh } = data;
        if (refresh) handleOnRefresh();
        modals.closeAll();
    }


    const handleOnRefresh = async () => {
        await getDoctorList();
    }

    const openAddEditModal = ({ data = null, mode = 'add' }) => {
        modals.open({
            title: mode === "edit" ? `${t("edit")}: ${data?.doctorName}` : `${t("add")}` + ` ${t("doctor")}`,
            centered: true,
            size: 'xl',
            styles: {
                title: {
                    fontWeight: '500',
                    fontSize: '14px'
                }
            },
            children: (
                <AddEditDoctor
                    mode={mode}
                    data={data}
                    handleCancel={(refresh) => closeModals(refresh)} />
            )
        })
    }

    return (
        <Container>
            <DataTableWrapper
                loading={loading}
                showAddButton={false}
                id={'doctorId'}
                addTitle={t('doctor')}
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