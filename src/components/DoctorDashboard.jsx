import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Container, Title, Text, Card, Group, Grid, useMantineTheme, Alert, Center, Stack,Skeleton  } from '@mantine/core';
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

dayjs.extend(isBetween);

export function DoctorDashboard() {
    const { t } = useTranslation();
    const [greeting, setGreeting] = useState('');
    const { user } = useAuth();
    const http = useHttp();
    const { apiConfig } = useApiConfig();
    const theme = useMantineTheme();

    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [appointmentError, setAppointmentError] = useState(null);
    const [ongoingAppointment, setOngoingAppointment] = useState(null);
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        const currentHour = dayjs().hour();
        let _greeting = '';
        if (currentHour >= 5 && currentHour < 12) {
            _greeting = 'goodMorning';
        } else if (currentHour >= 12 && currentHour < 18) {
            _greeting = 'goodAfternoon';
        } else {
            _greeting = 'goodEvening';
        }
        setGreeting(_greeting);
        return () => {
            setGreeting('');
        }
    }, [t]);

    useEffect(() => {
        const checkOngoingAppointment = () => {
            const now = dayjs();
            setCurrentTime(now);

            const currentAppointment = appointments.find(appt => {
                const startTime = dayjs(appt.appointmentDate);
                const endTime = startTime.add(appt.durationInMinutes, 'minute');
                return now.isBetween(startTime, endTime, null, '[)');
            });
            setOngoingAppointment(currentAppointment || null);
        };

        checkOngoingAppointment();
        const intervalId = setInterval(checkOngoingAppointment, 60 * 1000);

        return () => clearInterval(intervalId);

    }, [appointments]);

    const fetchAppointments = useCallback(async (doctorId) => {
        setLoadingAppointments(true);
        setAppointmentError(null);
        try {
            const response = await http.get(apiConfig.appointment.getAppointmentListByDoctorId(doctorId));
            if (response.status === 200 && Array.isArray(response.data)) {
                const today = dayjs().startOf('day');
                const todaysAppointments = response.data.filter(appt =>
                    dayjs(appt.appointmentDate).isSame(today, 'day')
                );
                setAppointments(todaysAppointments);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
            const errorMessage = error.message || t('failedToLoadAppointments');
            setAppointmentError(errorMessage);
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
        } else if (user && !user.doctorId) {
            setLoadingAppointments(false);
            setAppointments([]);
        } else {
            setLoadingAppointments(false);
            setAppointments([]);
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
            render: (record) => dayjs(record.appointmentDate).format('h:mm A'),
        },
        {
            accessor: 'durationInMinutes',
            title: t('duration'),
            render: (record) => `${record.durationInMinutes} ${t('min')}`,
        },
        {
            accessor: 'appointmentStatus',
            title: t('status'),
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

    const MIN_TABLE_AREA_HEIGHT = 250;

    const getRemainingTime = (appointment) => {
        if (!appointment) return '';
        const now = currentTime;
        const endTime = dayjs(appointment.appointmentDate).add(appointment.durationInMinutes, 'minute');
        const diff = endTime.diff(now, 'minute');
        return diff > 0 ? `${diff} ${t('minRemaining')}` : t('endingSoon');
    };

    return (
        <Container fluid>
                        <Title
                order={2}
                mb="lg"
                className={classes.animatedGradientTitle} 
            >
                {t(greeting)}{user?.doctorName ? `, Dr. ${user.doctorName}` : ''}
            </Title>

            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Card withBorder radius="md" p="md" mb="lg"
                        style={{ minHeight: MIN_TABLE_AREA_HEIGHT + 60 }}>
                        <Group justify="space-between" mb="sm">
                            <Title order={4}>{t('todaysAppointments')}</Title>
                        </Group>

                        {/* Conditional Rendering for Appointments Area */}
                        {appointmentError ? (
                            <Center style={{ height: MIN_TABLE_AREA_HEIGHT }}>
                                <Alert icon={<AlertCircle size="1rem" />} title={t('error')} color="red" variant="light">
                                    {appointmentError}
                                </Alert>
                            </Center>
                        ) : !loadingAppointments && appointments.length === 0 ? (
                            // --- Custom No Appointments View ---
                            <Center style={{ height: MIN_TABLE_AREA_HEIGHT }}>
                                <Stack align="center" gap="sm">
                                    <CalendarOff size={48} strokeWidth={1.5} color={theme.colors.gray[5]} />
                                    <Text c="dimmed" size="lg">
                                        {t('noAppointmentsToday')}
                                    </Text>
                                </Stack>
                            </Center>
                        ) : (
                            // --- DataTable View ---
                            <DataTableWrapper
                                id="doctor-dashboard-appointments"
                                loading={loadingAppointments}
                                columns={appointmentColumns}
                                dataSource={appointments}
                                recordsPerPage={5}
                                recordsPerPageOptions={[5, 10]}
                                minHeight={MIN_TABLE_AREA_HEIGHT}
                                noRecordsText={t('noAppointmentsToday')}
                                showAddButton={false}
                                showEditButton={false}
                                showDeleteButton={false}
                                showNavigation={false}
                                showActions={false}
                                onRefresh={() => user?.doctorId && fetchAppointments(user.doctorId)}
                            />
                        )}
                    </Card>
                </Grid.Col>

                {/* --- Other Dashboard Sections (no changes) --- */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    {/* <Card withBorder radius="md" p="md" mb="lg">
                        <Title order={4}>{t('quickStats')}</Title>
                        <Text size="sm">{t('patientsToday')}: {!loadingAppointments && !appointmentError ? appointments.length : '...'}</Text>
                        <Text size="sm">{t('pendingPrescriptions')}: ...</Text>
                    </Card> */}
                    <Card withBorder radius="md" p="md" mb="lg">
                        <Title order={4} mb="sm">{t('quickStats')}</Title>
                        {/* Show skeleton while loading appointments */}
                        {loadingAppointments ? (
                            <>
                                <Skeleton height={16} width="70%" mb="xs" />
                                <Skeleton height={16} width="50%" />
                            </>
                        ) : (
                            <>
                                <Text size="sm">{t('patientsToday')}: {!appointmentError ? appointments.length : 'N/A'}</Text>
                                <Text size="sm">{t('pendingPrescriptions')}: ...</Text> {/* Placeholder */}
                            </>
                        )}
                    </Card>

                    {/* --- Ongoing Appointment Card --- */}
                    <Card withBorder radius="md" p="md" mb="lg">
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
                                    // src={ongoingAppointment.patientProfileImagePath || null} // Add image path if available
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
                </Grid.Col>

                <Grid.Col span={{ base: 12 }}>
                    <Card withBorder radius="md" p="md">
                        <Title order={4}>{t('recentPatients')}</Title>
                        <Text size="sm">{t('accessRecentPatientFiles')}</Text>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
