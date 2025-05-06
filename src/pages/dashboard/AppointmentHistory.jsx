import {
    Container,
    Skeleton,
    Text,
    useMantineTheme,
    Stack,
    Badge,
    Title,
    Group,
    Center,
    ActionIcon
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { useDocumentTitle } from "@hooks/DocumentTitle.jsx";
import { useEffect, useState, useMemo } from "react";
import { openNotificationWithSound } from "@config/Notifications.js";
import useHttp from "@hooks/AxiosInstance.jsx";
import { DataTable } from 'mantine-datatable';
import { useLocation, useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useEncrypt } from "@hooks/EncryptData.jsx";
import { ExternalLink } from 'lucide-react';

export default function AppointmentHistory() {
    const { t } = useTranslation();
    useDocumentTitle(t("appointmentHistory"));
    const { apiConfig } = useApiConfig();
    const [loading, setLoading] = useState(true);
    const theme = useMantineTheme();
    const http = useHttp();
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState([]);
    const [appointmentItem, setAppointmentItem] = useState({});
    const state = location.state?.data || null;
    const { getEncryptedData } = useEncrypt();
    const columns = useMemo(() =>
        [
            {
                accessor: 'appointmentId',
                title: t('id'),
                width: 80,
                style: { padding: '10px' },
            },
            {
                accessor: 'appointmentDate',
                title: t('appointmentDate'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                render: (record) =>
                    record?.appointmentDate
                        ? dayjs(record.appointmentDate).format('DD/MM/YYYY')
                        : 'N/A',
            },
            {
                accessor: 'appointmentTime',
                title: t('appointmentTime'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                render: (record) =>
                    record?.appointmentDate
                        ? dayjs(record.appointmentDate).format('h:mm A')
                        : 'N/A',
            },
            {
                accessor: 'doctorName',
                title: t('doctorName'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
            },
            {
                accessor: 'mobileNo',
                title: t('mobileNo'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
            },
            {
                accessor: 'appointmentStatus',
                title: t('appointmentStatus'),
                width: 'auto',
                style: { padding: '10px', flex: 1 },
                render: (record) => (
                    <Badge color={getStatusColor(record?.appointmentStatus)} variant="light">{record?.appointmentStatus}</Badge>
                )
            },
            {
                accessor: 'actions',
                title: t('action'),
                width: 100,
                style: { padding: '10px' },
                render: (record) => (
                    <ActionIcon
                        variant="transparent"
                        className="cursor-pointer"
                        onClick={() => navigate(`/app/appointments/details/all/${record?.appointmentId}`)}
                    >
                        {<ExternalLink size={16} />}
                    </ActionIcon>
                )
            }
        ], [t])

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'booked': return 'blue';
            case 'completed': return 'green';
            case 'cancelled': return 'red';
            case 'pending': return 'yellow';
            default: return 'gray';
        }
    };

    useEffect(() => {
        getAppointmentDetails();
        setAppointmentItem(state);
    }, []);

    const getAppointmentDetails = async () => {
        const appointmentId = getEncryptedData('appointmentId');
        setLoading(true);
        try {
            const response = await http.get(apiConfig.appointment.getAppointmentDetailsById(appointmentId));
            if (response?.status === 200) {
                const { data } = response;
                setAppointmentItem(data);
            }
        } catch (err) {
            setAppointmentItem({});
            const { name, message } = err;
            openNotificationWithSound(
                {
                    title: name || "Error",
                    message: message || "An unexpected error occurred.",
                    color: theme.colors.red[6],
                },
                { withSound: false }
            );
        } finally {
            getAppointmentList();
        }
    }

    const getAppointmentList = async () => {
        try {
            const response = await http.get(apiConfig.appointment.getAppointmentListByDoctorAndPatientIdWise(params?.doctorId, params?.patientId));
            if (response?.status === 200) {
                const { data } = response;
                setDataSource(data);
            }
        } catch (err) {
            setDataSource([]);
            const { name, message } = err;
            openNotificationWithSound(
                {
                    title: name || "Error",
                    message: message || "An unexpected error occurred.",
                    color: theme.colors.red[6],
                },
                { withSound: false }
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container fluid p={15} className="flex flex-col">
            <Group py={5} justify="space-between">
                {
                    loading ? (
                        <Skeleton height={30} width={150} radius="xl" />
                    ) : (
                        <Title size={'lg'}>
                            {appointmentItem?.patientName}
                        </Title>
                    )
                }
                {
                    loading ? (
                        <Skeleton height={20} width={100} radius="xl" />
                    ) : (
                        <Text size="sm" opacity={0.8}>{t('doctorName')}:&nbsp;{appointmentItem?.doctorName}</Text>
                    )
                }
            </Group>
            <Stack styles={{ root: { flex: '1' } }}>
                <DataTable
                    idAccessor='appointmentId'
                    withTableBorder
                    withColumnBorders
                    highlightOnHover
                    striped
                    fetching={loading}
                    borderRadius={theme.radius.lg}
                    classNames={{
                        pagination: {
                            fontSize: theme.fontSizes.xs,
                        }
                    }}
                    styles={{
                        root: {
                            width: '100%',
                        },
                        header: {
                            fontSize: theme.fontSizes.xs,
                        },
                    }}
                    records={dataSource}
                    columns={columns}
                    noRecordsText={t('noRecordsToShow')}
                />
            </Stack>
        </Container>
    )
}
