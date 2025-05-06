import {useCallback, useEffect, useMemo, useState} from "react";
import {Container, useMantineTheme} from "@mantine/core";
import {DataTableWrapper} from "@components/DataTableWrapper";
import {useTranslation} from "react-i18next";
import useHttp from "@hooks/AxiosInstance.jsx";
import {useApiConfig} from "@contexts/ApiConfigContext";
import {modals} from "@mantine/modals";
import {openNotificationWithSound} from '@config/Notifications';
import {AddEditPatientVisit} from '@modals/AddEditPatientVisit';
import {useDocumentTitle} from "@hooks/DocumentTitle";
import {useEncrypt} from "@hooks/EncryptData.jsx";

export default function PatientVisits() {
    const {t, i18n} = useTranslation();
    const [columns, setColumns] = useState();
    const [dataSource, setDataSource] = useState();
    const [loading, setLoading] = useState();
    const {apiConfig} = useApiConfig();
    const http = useHttp();
    const theme = useMantineTheme();
    const {getEncryptedData} = useEncrypt();
    useDocumentTitle(t('patientVisits'));

    const _columns = useMemo(() =>
        [
            {
                accessor: 'doctorId',
                title: t('id'),
                width: 80,
                style: {padding: '10px'},
            },
            {
                accessor: 'doctorName',
                title: t('doctorName'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
            {
                accessor: 'doctorAddress',
                title: t('doctorAddress'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
            {
                accessor: 'doctorDegree',
                title: t('doctorDegree'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
        ], [t])
    useEffect(() => {
        if (i18n.isInitialized) {
            setColumns(_columns);
            getPatientVisitList();
        }
    }, []);

    const getPatientVisitList = useCallback(async () => {
        setLoading(true);
        try {
            const userId = getEncryptedData('user');
            const response = await http.get(apiConfig.patientVisits.getPatientVisitListDoctorWise(userId));
            if (response?.status === 200) {
                const data = response.data;
                setDataSource(data);
            }
        } catch (err) {
            setDataSource([]);
            const {name, message} = err;
            openNotificationWithSound({
                title: name,
                message: message,
                color: theme.colors.red[6]
            }, {withSound: false})

        } finally {
            setLoading(false);
        }
    }, [dataSource]);

    const handleOnAdd = (data) => {
        openAddEditModal({data, mode: 'add'});
    }

    const handleEdit = (data) => {
        openAddEditModal({data, mode: 'edit'});
    }
    const handleDelete = async (data) => {

        closeModals();
    }

    const closeModals = () => {
        modals.closeAll();
    }

    const handleOnRefresh = async () => {
        await getPatientVisitList();
    }
    const openAddEditModal = ({data = null, mode = 'add'}) => {
        modals.open({
            title: mode === "edit" ? `${t("edit")}` : `${t("add")}` + ` ${t("patientVisits")}`,
            centered: true,
            children: (
                <AddEditPatientVisit mode={mode} data={data}
                                     handleCancel={() => closeModals()}/>
            )
        })
    }

    return (
        <Container p={15}>
            <DataTableWrapper
                loading={loading}
                showAddButton={true}
                id={'doctorId'}
                addTitle={t('patientVisit')}
                columns={columns}
                dataSource={dataSource}
                handleOnAdd={(data) => handleOnAdd(data)}
                handleOnDelete={data => handleDelete(data)}
                handleOnEdit={data => handleEdit(data)}
                onRefresh={() => handleOnRefresh()}
            />
        </Container>
    )
}