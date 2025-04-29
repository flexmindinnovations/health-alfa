import { Container, useMantineTheme, Text, Badge, Group, Stack, RadioGroup, Radio } from "@mantine/core";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
import { DataTableWrapper } from "@components/DataTableWrapper";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { useListManager } from "@hooks/ListManager.jsx";
import { useMemo, useState } from "react";
import { openNotificationWithSound } from "@config/Notifications.js";
import { utils } from "@config/utils.js";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const ALL_STATUS = 'All';

export default function PrescriptionList() {
    const { t } = useTranslation();
    const { apiConfig } = useApiConfig();
    const theme = useMantineTheme();
    useDocumentTitle(t("prescriptionList"));
    const navigate = useNavigate();

    const appointmentStatusOptions = useMemo(() => [
        { value: ALL_STATUS, label: t('all') },
        { value: utils.appointmentStatus.BOOKED, label: t(utils.appointmentStatus.BOOKED) },
        { value: utils.appointmentStatus.COMPLETED, label: t(utils.appointmentStatus.COMPLETED) },
        { value: utils.appointmentStatus.CANCELLED, label: t(utils.appointmentStatus.CANCELLED) }
    ], [t]);

    const [selectedStatus, setSelectedStatus] = useState(ALL_STATUS);

    const getStatusColor = (status) => {
        switch (status) {
            case utils.appointmentStatus.BOOKED: return 'blue';
            case utils.appointmentStatus.COMPLETED: return 'green';
            case utils.appointmentStatus.CANCELLED: return 'red';
            case utils.appointmentStatus.PENDING: return 'yellow';
            default: return 'gray';
        }
    };

    const columns = useMemo(
        () => [
            {
                accessor: "doctorName",
                title: t("doctorName"),
                width: "auto",
                style: { padding: "10px", flex: 1 },
                render: (record) => (
                    <Text size="xs" p={0}>{record.doctorName}</Text>
                )
            },
            {
                accessor: "durationInMinutes",
                title: t("durationInMinutes"),
                width: "150px",
                style: { padding: "10px", flex: 1 },
                render: (record) => (
                    <Text size="xs" p={0}>{record.durationInMinutes}</Text>
                )
            },
            {
                accessor: "appointmentDate",
                title: t("appointmentDate"),
                width: "auto",
                style: { padding: "10px", flex: 1 },
                render: (record) =>
                    record?.appointmentDate
                        ? dayjs(record.appointmentDate).format('DD/MM/YYYY')
                        : 'N/A',
            },
            {
                accessor: "appointmentStatus",
                title: t("appointmentStatus"),
                width: 200,
                style: { padding: "10px", flex: 1 },
                filter: ({close}) => (
                    <RadioGroup
                        value={selectedStatus}
                        onChange={(value) => {
                            setSelectedStatus(value);
                            close();
                        }}
                        mt="xs"
                    >
                        <Stack spacing="xs" mt="xs">
                            {
                                appointmentStatusOptions.map((item) => (
                                    <Radio
                                        key={item.value}
                                        value={item.value}
                                        label={item.label}
                                        size="xs"
                                        styles={{
                                            label: {
                                                cursor: 'pointer'
                                            }
                                        }}
                                    />
                                ))
                            }
                        </Stack>
                    </RadioGroup>
                ),
                render: (record) => (
                    <Badge
                        color={getStatusColor(record?.appointmentStatus)}
                        variant="light"
                        size="sm"
                    >
                        {record?.appointmentStatus ? t(record.appointmentStatus) : 'N/A'}
                    </Badge>
                )
            },
        ],
        [t, selectedStatus, appointmentStatusOptions]
    );

    const { loading, dataSource: rawDataSource, handleRefresh } = useListManager({
        apiEndpoint: apiConfig.appointment.getList,
        onError: (err) => {
            const { name, message } = err;
            openNotificationWithSound(
                {
                    title: name || t(utils.error),
                    message: message || t(utils.unexpectedError),
                    color: theme.colors.red[6],
                },
                { withSound: false }
            );
        }
    });

    const filteredData = useMemo(() => {
        if (selectedStatus === "All") return rawDataSource;
        return rawDataSource.filter((item) => item.appointmentStatus === selectedStatus);
    }, [rawDataSource, selectedStatus]);

    const handleEventClick = (record) => {
        const { appointmentId, doctorId } = record;
        if (appointmentId && doctorId) {
            navigate(`/app/prescription/lookup/${doctorId}/${appointmentId}`);
        } else {
            console.error("Missing doctorId or appointmentId for navigation", record);
            openNotificationWithSound({
                title: t(utils.error),
                message: t("navigationErrorMissingId"),
                color: theme.colors.orange[6],
            }, { withSound: false });
        }
    };

    return (
        <Container>
            <DataTableWrapper
                loading={!filteredData.length || loading}
                showAddButton={false}
                id={"appointmentId"}
                addTitle={t("uploadPrescription")}
                columns={columns}
                dataSource={filteredData}
                showDeleteButton={false}
                showEditButton={false}
                showNavigation={true}
                onRefresh={handleRefresh}
                handleOnNavigate={handleEventClick}
                noRecordsText={t('noRecordsToShow')}
            />
        </Container>
    );
}