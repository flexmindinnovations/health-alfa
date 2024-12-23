import {Container, useMantineTheme} from "@mantine/core";
import {useTranslation} from "react-i18next";
import {useEffect, useMemo, useState} from "react";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import useHttp from "@hooks/axios-instance.js";
import {useDocumentTitle} from "@hooks/DocumentTitle.jsx";
import {openNotificationWithSound} from "@config/Notifications.js";
import {modals} from "@mantine/modals";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {AddEditAvailability} from "@modals/AddEditAvailability.jsx";
import dayjs from 'dayjs';

const getFormattedTime = (time) => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    return dayjs(`${currentDate}T${time}`, "YYYY-MM-DDTHH:mm:ss").format("h:mm A");
}

export default function Availability() {
    const {t, i18n} = useTranslation();
    const [columns, setColumns] = useState();
    const [dataSource, setDataSource] = useState();
    const [loading, setLoading] = useState();
    const {apiConfig} = useApiConfig();
    const http = useHttp();
    const theme = useMantineTheme();
    useDocumentTitle(t('doctors'));


    const _columns = useMemo(() => [{
        accessor: 'doctorTimingId', title: t('id'), width: 80, style: {padding: '10px'},
    }, {
        accessor: 'doctorName', title: t('doctorName'), width: 'auto', style: {padding: '10px', flex: 1},
    }, {
        accessor: 'dayOfWeek', title: t('dayOfWeek'), width: 'auto', style: {padding: '10px', flex: 1},
    }, {
        accessor: 'slotType', title: t('slotType'), width: 'auto', style: {padding: '10px', flex: 1},
    }, {
        accessor: 'startTime', title: t('startTime'), width: 'auto', style: {padding: '10px', flex: 1},
        render: (record) => getFormattedTime(record.startTime),
    }, {
        accessor: 'endTime', title: t('endTime'), width: 'auto', style: {padding: '10px', flex: 1},
        render: (record) => getFormattedTime(record.endTime),
    },
    ], [t])

    useEffect(() => {
        if (i18n.isInitialized) {
            setColumns(_columns);
            getAppointmentList();
        }
    }, [i18n.language, _columns]);

    const getAppointmentList = async () => {
        setLoading(true);
        try {
            const response = await http.get(apiConfig.doctors.getAvailability);
            if (response?.status === 200) {
                const data = response.data;
                if (data && Array.isArray(data)) {
                    const updatedResponse = data.map((item) => {
                        return {
                            ...item,
                            dayOfWeek: item.dayOfWeek.charAt(0).toUpperCase() + item.dayOfWeek.slice(1),
                            slotType: item.slotType.charAt(0).toUpperCase() + item.slotType.slice(1)
                        }
                    })
                    setDataSource(updatedResponse);
                }
            }
        } catch (err) {
            setDataSource([]);
            const {name, message} = err;
            openNotificationWithSound({
                title: name, message: message, color: theme.colors.red[6]
            }, {withSound: false})
        } finally {
            setLoading(false);
        }
    }

    const handleAddEdit = (data, mode) => {
        if (mode === 'edit') {
            const {doctorId} = data;
            getDoctorAppointmentsById(doctorId, mode);
        } else {
            openAddEditModal({data, mode});
        }
    }

    const getDoctorAppointmentsById = async (doctorId, mode) => {
        setLoading(true);
        await http.get(apiConfig.doctors.getAvailabilityById(doctorId))
            .then((response) => {
                const data = response.data;
                openAddEditModal({data, mode});
            })
            .catch(error => {
                const {name, message} = error;
                openNotificationWithSound({
                    title: name, message: message, color: theme.colors.red[6]
                }, {withSound: false})
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleDelete = async (data) => {
        closeModals();
    }

    const closeModals = (data = null) => {
        const {refresh} = data;
        if (refresh) handleOnRefresh();
        modals.closeAll();
    }


    const handleOnRefresh = async () => {
        await getAppointmentList();
    }

    const openAddEditModal = ({data = null, mode = 'add'}) => {
        modals.closeAll();
        modals.open({
            title: mode === "edit" ? `${t("edit")}` : `${t("add")}` + ` ${t("availability")}`,
            centered: true,
            trapFocus: false,
            size: 'lg',
            styles: {
                title: {
                    fontWeight: '500', fontSize: '14px'
                }
            },
            children: (<AddEditAvailability
                mode={mode}
                data={data}
                handleCancel={(refresh) => closeModals(refresh)}/>)
        })
    }

    return (<Container>
        <DataTableWrapper
            loading={loading}
            showAddButton={true}
            id={'doctorTimingId'}
            addTitle={t('availability')}
            columns={columns}
            dataSource={dataSource}
            handleOnAdd={(data) => handleAddEdit(data, 'add')}
            handleOnEdit={data => handleAddEdit(data, 'edit')}
            handleOnDelete={data => handleDelete(data)}
            onRefresh={() => handleOnRefresh()}
        />
    </Container>)
}