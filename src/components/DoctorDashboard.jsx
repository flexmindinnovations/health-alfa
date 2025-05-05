import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Container, Title, Text, Card, Group, Grid, useMantineTheme, Alert, Center, Stack, Skeleton, ScrollArea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useAuth } from "@contexts/AuthContext.jsx";
import useHttp from "@hooks/AxiosInstance.jsx";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import { openNotificationWithSound } from "@config/Notifications.js";
import { DataTableWrapper } from "@components/DataTableWrapper.jsx";
import { AlertCircle, CalendarOff } from 'lucide-react';
import classes from '@styles/Dashboard.module.css';
import { DashboardGreeting } from '@components/DashboardGreeting.jsx';

dayjs.extend(isBetween);

const UPCOMING_APPOINTMENTS_HEIGHT = 300;
const MIN_TABLE_AREA_HEIGHT = 300;

export function DoctorDashboard() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const http = useHttp();
    const { apiConfig } = useApiConfig();
    const theme = useMantineTheme();

    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [allAppointments, setAllAppointments] = useState([]);
    const [todaysAppointments, setTodaysAppointments] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [appointmentError, setAppointmentError] = useState(null);
    const [ongoingAppointment, setOngoingAppointment] = useState(null);
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        const now = dayjs();
        setCurrentTime(now);

        const currentAppointment = allAppointments.find(appt => {
            const startTime = dayjs(appt.appointmentDate);
            const endTime = startTime.add(appt.durationInMinutes, 'minute');
            return now.isBetween(startTime, endTime, null, '[)');
        });
        setOngoingAppointment(currentAppointment || null);

        const today = now.startOf('day');
        const endOfToday = now.endOf('day');
        const filteredTodays = allAppointments.filter(appt =>
            dayjs(appt.appointmentDate).isBetween(today, endOfToday, null, '[]')
        );
        setTodaysAppointments(filteredTodays);
        const filteredUpcoming = allAppointments.filter(appt =>
            dayjs(appt.appointmentDate).isAfter(now)
        ).sort((a, b) => dayjs(a.appointmentDate).diff(dayjs(b.appointmentDate)));
        setUpcomingAppointments(filteredUpcoming);

        const intervalId = setInterval(() => {
            const updatedNow = dayjs();
            setCurrentTime(updatedNow);

            const updatedCurrentAppointment = allAppointments.find(appt => {
                const startTime = dayjs(appt.appointmentDate);
                const endTime = startTime.add(appt.durationInMinutes, 'minute');
                return updatedNow.isBetween(startTime, endTime, null, '[)');
            });
            setOngoingAppointment(updatedCurrentAppointment || null);
            const updatedUpcoming = allAppointments.filter(appt =>
                dayjs(appt.appointmentDate).isAfter(updatedNow)
            ).sort((a, b) => dayjs(a.appointmentDate).diff(dayjs(b.appointmentDate)));
            setUpcomingAppointments(updatedUpcoming);

        }, 60 * 1000);

        return () => clearInterval(intervalId);

    }, [allAppointments]);

    const fetchAppointments = useCallback(async (doctorId) => {
        setLoadingAppointments(true);
        setAppointmentError(null);
        try {
            const response = await http.get(apiConfig.appointment.getAppointmentListByDoctorId(doctorId));
            if (response.status === 200 && Array.isArray(response.data)) {
                setAllAppointments(response.data);
            } else {
                setAllAppointments([]);
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
            const errorMessage = error.response?.data?.message || error.message || t('failedToLoadAppointments');
            setAppointmentError(errorMessage);
            setAllAppointments([]);
            openNotificationWithSound({
                title: t('error'),
                message: errorMessage,
                color: 'red',
                icon: <AlertCircle size={16} />
            }, { withSound: false });
        } finally {
            setLoadingAppointments(false);
        }
    }, []);

    useEffect(() => {
        if (user?.doctorId) {
            fetchAppointments(user.doctorId);
        } else {
            setLoadingAppointments(false);
            setAllAppointments([]);
            setTodaysAppointments([]);
            setUpcomingAppointments([]);
        }
    }, [user, fetchAppointments]);

    const appointmentColumns = useMemo(() => [
        {
            accessor: 'patientName',
            title: t('patientName'),
            sortable: true,
        },
        {
            accessor: 'appointmentDate',
            title: t('time'),
            sortable: true,
            width: 150,
            render: (record) => dayjs(record.appointmentDate).format('h:mm A'),
        },
        {
            accessor: 'durationInMinutes',
            title: t('duration'),
            width: 100,
            render: (record) => `${record.durationInMinutes} ${t('min')}`,
        },
        {
            accessor: 'appointmentStatus',
            title: t('status'),
            width: 100,
            sortable: true,
        },
        {
            accessor: 'notes',
            title: t('notes'),
            ellipsis: true,
        },
    ], [t]);




    const handleViewAppointmentDetails = (record) => {
        console.log("View details for:", record);
    };


    const getRemainingTime = (appointment) => {
        if (!appointment) return '';
        const now = currentTime;
        const endTime = dayjs(appointment.appointmentDate).add(appointment.durationInMinutes, 'minute');
        const diff = endTime.diff(now, 'minute');

        if (diff <= 0) return t('endingSoon');

        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;

        let remainingStr = '';
        if (hours > 0) {
            remainingStr += `${hours} ${t(hours > 1 ? 'hours' : 'hour')} `;
        }
        if (minutes > 0) {
            remainingStr += `${minutes} ${t(minutes > 1 ? 'minutes' : 'minute')}`;
        }

        return remainingStr.trim() + ` ${t('remaining')}`;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'booked': return 'blue';
            case 'completed': return 'green';
            case 'cancelled': return 'red';
            case 'pending': return 'yellow'; // Example
            default: return 'gray';
        }
    };

    return (
        <Container fluid
            styles={{
                root: {
                    flexDirection: 'column'
                }
            }}
        >
            <DashboardGreeting name={user?.doctorName} />

            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Card withBorder radius="md" p="md" className={`h-full flex-1`}>
                        <Title order={4}>{t('recentPatients')}</Title>
                        <Text size="sm">{t('accessRecentPatientFiles')}</Text>
                    </Card>
                </Grid.Col>
                {/* --- Other Dashboard Sections (no changes) --- */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Stack>
                        <Card withBorder radius="md" p="md" mb="lg" className={`h-full flex-1 !mb-0`}>
                            <Title order={4} mb="sm">{t('quickStats')}</Title>
                            {loadingAppointments ? (
                                <>
                                    <Skeleton height={16} width="70%" mb="xs" />
                                    <Skeleton height={16} width="50%" />
                                </>
                            ) : (
                                <>
                                    <Text size="sm">{t('patientsToday')}: {!appointmentError ? todaysAppointments.length : 'N/A'}</Text>
                                    <Text size="sm">{t('upcomingTotal')}: {!appointmentError ? upcomingAppointments.length : 'N/A'}</Text>
                                </>
                            )}
                        </Card>

                        {/* --- Ongoing Appointment Card --- */}
                        <Card withBorder radius="md" p="md" mb="lg" className={`h-full flex-1 !mb-0`}>
                            <Title order={4} mb="sm">{t('currentPatient')}</Title>
                            {loadingAppointments ? (
                                // Skeleton for ongoing appointment card
                                <Group wrap="nowrap">
                                    <Skeleton height={50} circle />
                                    <Stack gap="xs" style={{ flex: 1 }}>
                                        <Skeleton height={16} width="80%" />
                                        <Skeleton height={12} width="60%" />
                                    </Stack>
                                </Group>
                            ) : ongoingAppointment ? (
                                // Display ongoing appointment details
                                <Group wrap="nowrap" align="center">
                                    <Avatar
                                        // src={ongoingAppointment.patientProfileImagePath || null}
                                        size="lg"
                                        radius="xl"
                                    >
                                        {/* Fallback initials */}
                                        {ongoingAppointment.patientName?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Stack gap={2} style={{ flex: 1 }}>
                                        <Text fw={500} size="sm" truncate>{ongoingAppointment.patientName}</Text>
                                        <Group gap="xs" wrap="nowrap">
                                            <Clock size={14} opacity={0.7} />
                                            <Text size="xs" c="dimmed">{getRemainingTime(ongoingAppointment)}</Text>
                                        </Group>
                                    </Stack>
                                </Group>
                            ) : (
                                // Display message when no appointment is ongoing
                                <Center style={{ minHeight: 50 }}>
                                    <Text size="sm" c="dimmed">{t('noPatientCurrently')}</Text>
                                </Center>
                            )}
                        </Card>
                    </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card withBorder radius="md" p="md" className="flex flex-col" style={{ height: '100%' }}>
                        <Title order={4} mb="sm">{t('upcomingAppointments')}</Title>
                        <div style={{ height: '100%', flex: 1, minHeight: UPCOMING_APPOINTMENTS_HEIGHT, overflow: 'auto' }}
                            type="auto">
                            {loadingAppointments ? (
                                <Stack styles={{ root: { height: '100%' } }}>
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} height={60} radius="sm" mb="xs" />
                                    ))}
                                </Stack>
                            ) : appointmentError ? (
                                <Center style={{ height: '100%' }}>
                                    <Text c="red" size="sm">{t('errorLoadingUpcoming')}</Text>
                                </Center>
                            ) : upcomingAppointments.length === 0 ? (
                                <Center style={{ height: '100%' }}>
                                    <Stack align="center" gap="sm">
                                        <CalendarOff size={48} strokeWidth={1.5} color={theme.colors.gray[5]} />
                                        <Text c="dimmed" size="lg">{t('noUpcomingAppointments')}</Text>
                                    </Stack>
                                </Center>
                            ) : (
                                <Stack gap="xs">
                                    {upcomingAppointments.map((appt) => (
                                        <Card key={appt.appointmentId} withBorder radius="sm" p="xs" shadow="xs">
                                            <Group justify="space-between" wrap="nowrap">
                                                {/* Optional Avatar */}
                                                {/* <Avatar size="md" radius="xl">{appt.patientName?.charAt(0).toUpperCase()}</Avatar> */}
                                                <Stack gap={0} style={{ flex: 1, overflow: 'hidden' }}>
                                                    <Text size="sm" fw={500} truncate>{appt.patientName}</Text>
                                                    <Text size="xs" c="dimmed">
                                                        {dayjs(appt.appointmentDate).format('ddd, MMM D, h:mm A')}
                                                    </Text>
                                                </Stack>
                                                <Badge size="xs" variant="light" color={getStatusColor(appt.appointmentStatus)}>
                                                    {t(appt.appointmentStatus?.toLowerCase()) || appt.appointmentStatus}
                                                </Badge>
                                            </Group>
                                        </Card>
                                    ))}
                                </Stack>
                            )}
                        </div>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card withBorder radius="md" p="md"
                        style={{ minHeight: MIN_TABLE_AREA_HEIGHT + 60 }}>
                        <Group justify="space-between" mb="sm">
                            <Title order={4}>{t('todaysAppointments')}</Title>
                        </Group>
                        {appointmentError ? (
                            <Center style={{ height: MIN_TABLE_AREA_HEIGHT }}>
                                <Alert icon={<AlertCircle size="1rem" />} title={t('error')} color="red" variant="light">
                                    {appointmentError}
                                </Alert>
                            </Center>
                        ) : !loadingAppointments && todaysAppointments.length === 0 ? (
                            <Center style={{ height: MIN_TABLE_AREA_HEIGHT }}>
                                <Stack align="center" gap="sm">
                                    <CalendarOff size={48} strokeWidth={1.5} color={theme.colors.gray[5]} />
                                    <Text c="dimmed" size="lg">
                                        {t('noAppointmentsToday')}
                                    </Text>
                                </Stack>
                            </Center>
                        ) : (
                            <DataTableWrapper
                                id="doctor-dashboard-appointments"
                                loading={loadingAppointments}
                                columns={appointmentColumns}
                                dataSource={todaysAppointments}
                                recordsPerPage={5}
                                recordsPerPageOptions={[5, 10]}
                                minHeight={MIN_TABLE_AREA_HEIGHT}
                                noRecordsText={t('noAppointmentsToday')}
                                showAddButton={false}
                                showEditButton={false}
                                showDeleteButton={false}
                                showNavigation={false}
                                showActions={false}
                                height={'300px'}
                                onRefresh={() => user?.doctorId && fetchAppointments(user.doctorId)}
                            />
                        )}
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
