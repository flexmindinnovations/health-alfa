import {Card, Container, Text} from "@mantine/core";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import {useDocumentTitle} from "@hooks/DocumentTitle.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {useMemo} from "react";
import {useListManager} from "@hooks/ListManager.jsx";
import {AddEditAppointment} from "@modals/AddEditAppointment.jsx";
import dayjs from "dayjs";

export default function Appointments() {
    const {t} = useTranslation();
    const {apiConfig} = useApiConfig();
    useDocumentTitle(t('doctors'));
    const {openModal} = useModal();

    const columns = useMemo(() =>
        [
            {
                accessor: 'appointmentId',
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
                accessor: 'patientName',
                title: t('patientName'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
            {
                accessor: 'appointmentDate',
                title: t('appointmentDate'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
                render: (record) => dayjs(record.appointmentDate).format('DD/MM/YYYY'),
            },
            {
                accessor: 'durationInMinutes',
                title: t('durationInMinutes'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
            {
                accessor: 'appointmentStatus',
                title: t('status'),
                width: '120px',
                style: {padding: '10px'},
                render: (record) => (
                    <Card p={0} shadow>
                        <Text
                            className={`
                        ${record.appointmentStatus === 'Booked' ?
                                '!bg-teal-500 flex items-center justify-center !p-1 !font-semibold !text-white' :
                                ''} 
                    `}
                            size={"xs"}>{record.appointmentStatus}</Text>
                    </Card>
                )
            },
            {
                accessor: 'notes',
                title: t('notes'),
                width: 'auto',
                style: {padding: '10px', flex: 1},
            },
        ], [t])

    const {
        loading,
        dataSource,
        handleRefresh
    } = useListManager({
        apiEndpoint: apiConfig.appointment.getList,
    });

    const openAddEditModal = ({data = null, mode = 'add'}) => {
        openModal({
            Component: AddEditAppointment,
            data,
            mode,
            title: t("appointment"),
            handleRefresh: handleRefresh
        });
    };

    const handleDelete = (data) => {
    }

    return (
        <Container>
            <DataTableWrapper
                loading={loading}
                showAddButton={false}
                showActions={false}
                id={'appointmentId'}
                addTitle={t('appointment')}
                columns={columns}
                dataSource={dataSource}
                handleOnAdd={() => openAddEditModal({mode: 'add'})}
                handleOnEdit={(data) => openAddEditModal({data, mode: 'edit'})}
                onRefresh={handleRefresh}
                handleOnDelete={data => handleDelete(data)}
            />
        </Container>
    )
}