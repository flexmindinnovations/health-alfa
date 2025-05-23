import { useState, useEffect, createElement } from 'react';
import { Container, Title, Text, Grid, Button, Card, Group, Anchor } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@contexts/AuthContext.jsx";
import { useApiConfig } from "@contexts/ApiConfigContext.jsx";
import useHttp from "@hooks/AxiosInstance.jsx";
import { DashboardGreeting } from '@components/DashboardGreeting.jsx';
import { useEncrypt } from "@hooks/EncryptData.jsx";
import { DataTableWrapper } from "@components/DataTableWrapper.jsx"; 
import { Calendar, CalendarCheck } from 'lucide-react';

export function PatientDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { apiConfig } = useApiConfig();
    const http = useHttp();
    const { getEncryptedData } = useEncrypt();
    const [username, setUsername] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const gradientProps = {
        variant: 'gradient',
        gradient: { from: 'indigo', to: 'cyan', deg: 60 },
    }

    const analyticsItems = [
        { label: 'totalAppointments', value: analytics.totalAppointments, icon: Calendar },
        { label: 'upcomingAppointments', value: analytics.upcomingAppointments, icon: CalendarCheck },
    ];

    const appointmentColumns = [
        { accessor: 'appointmentDate', title: t('date'), render: (record) => new Date(record.appointmentDate).toLocaleDateString() },
        { accessor: 'doctorName', title: t('doctor') },
        { accessor: 'appointmentStatus', title: t('status') },
    ];

    const medicineColumns = [
        { accessor: 'medicineName', title: t('name') },
        { accessor: 'medicineType', title: t('type') },
    ];

    const prescriptionColumns = [
        { accessor: 'visitDate', title: t('date'), render: (record) => new Date(record.visitDate).toLocaleDateString() },
        { accessor: 'medicineType', title: t('type') },
    ];

    useEffect(() => {
        if (user) {
            const role = getEncryptedData('roles');
            if (role) setUserRole(role.toLowerCase());
            const id = getEncryptedData('user');
            if (id) setUserId(id);
            const _name = user?.firstName + ' ' + user?.lastName;
            setUsername(_name);
        }
    }, [user]);

    useEffect(() => {
        if (userId) {
            const fetchAppointments = async () => {
                try {
                    const response = await http.get(apiConfig.appointment.getAppointmentListByPatientIdId(userId));
                    setAppointments(response.data.slice(0, 5));
                } catch (error) {
                    console.error('Error fetching appointments:', error);
                }
            };

            const fetchMedicines = async () => {
                try {
                    const response = await http.get(apiConfig.medicine.getList());
                    setMedicines(response.data.slice(0, 5));
                } catch (error) {
                    console.error('Error fetching medicines:', error);
                }
            };

            // const fetchPrescriptions = async () => {
            //     try {
            //         const response = await http.get(apiConfig.patientVisits.getPatientVisitListByPatientId(userId));
            //         setPrescriptions(response.data.slice(0, 5));
            //     } catch (error) {
            //         console.error('Error fetching prescriptions:', error);
            //     }
            // };

            fetchAppointments();
            fetchMedicines();
            // fetchAnalytics();
            // fetchPrescriptions();
        }
    }, [userId, userRole]);

    const handleBookAppointment = () => {
        navigate('/app/book-appointment');
    };


    return (
        <Container fluid className='overflow-y-auto'>
            <Grid gutter="md" maw={'98%'} mx="auto" mt="lg" mb="lg">
                <Grid.Col span={12}>
                    <DashboardGreeting name={username} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 12, lg: 6 }} className="flex flex-col gap-4">
                    {/* Analytics Cards */}
                    <Group h={125} p={0} style={{ width: '100%', flexDirection: 'row', gap: '20px' }} className="flex justify-between items-center">
                        {analyticsItems.map((item, index) => (
                            <Card
                                key={index}
                                className="flex-1 !h-full"
                                radius="md"
                                withBorder
                            >
                                <Group position="apart" h={'100%'}>
                                    <div>
                                        <Text fw={500} size="xl">{item.value || 0}</Text>
                                        <Text size="sm" c="dimmed">{t(item.label)}</Text>
                                    </div>
                                    {/* Replace with actual icons */}
                                    {createElement(item.icon, {
                                        size: 40,
                                    })}
                                </Group>
                            </Card>
                        ))}

                    </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 12, lg: 6 }}>
                    <Card mah={'160px'} padding="lg" radius="md" withBorder style={{ width: '100%' }}>
                        <Text fw={700} variant='gradient' gradient={{ from: 'teal', to: 'blue', deg: 60 }} size='xl' mb="md">
                            {t('quickActions')}
                        </Text>
                        <Button display={'inline'} maw={220} onClick={handleBookAppointment}>
                            {t('bookNewAppointment')}
                        </Button>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 12, lg: 6 }}>
                    <Card mih={'384px'} padding="lg" radius="md" withBorder>
                        <Text fw={700} variant='gradient' gradient={{ from: 'teal', to: 'blue', deg: 60 }} size='xl' mb="md">
                            {t('yourAppointments')}
                        </Text>
                        <DataTableWrapper
                            columns={appointmentColumns}
                            dataSource={appointments}
                            id="appointmentId"
                            showAddButton={false}
                            showEditButton={false}
                            showDeleteButton={false}
                            showActions={false}
                            showNavigation={true}
                            showSearch={false}
                            showPagination={false}
                            showRefresh={false}
                        />
                        <Anchor className='block text-end' c={'blue'} size='xs' mt="md" onClick={() => navigate('/app/appointments')}>
                            {t('viewAppointments') + '...'}
                        </Anchor>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 12, lg: 6 }}>
                    <Card mih={'384px'} padding="lg" radius="md" withBorder style={{ width: '100%' }}>
                        <Text fw={700} variant='gradient' gradient={{ from: 'teal', to: 'blue', deg: 60 }} size='xl' mb="md">
                            {t('medicines')}
                        </Text>
                        <DataTableWrapper
                            showRefresh={false}
                            columns={medicineColumns}
                            dataSource={medicines}
                            id="medicineId"
                            showAddButton={false}
                            showEditButton={false}
                            showDeleteButton={false}
                            showActions={false}
                            showSearch={false}
                            showPagination={false}

                        />
                        {/* <Anchor className='block text-end' c={'blue'} size='xs' mt="md" onClick={() => navigate('/app/medicines')}>
                            {t('viewMedicines') + '...'}
                        </Anchor> */}
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 12, lg: 6 }}>
                    <Card mih={'384px'} padding="lg" radius="md" withBorder style={{ width: '100%' }}>
                        <Text fw={700} variant='gradient' gradient={{ from: 'teal', to: 'blue', deg: 60 }} size='xl' mb="md">
                            {t('prescriptions')}
                        </Text>
                        {/* <DataTableWrapper
                            showRefresh={false}
                            columns={prescriptionColumns}
                            dataSource={prescriptions}
                            id="visitId"
                            showAddButton={false}
                            showEditButton={false}
                            showDeleteButton={false}
                            showActions={false}
                            showNavigation={true}
                            showSearch={false}
                            showPagination={false}

                        /> */}
                        {/* <Anchor className='block text-end' c={'blue'} size='xs' mt="md" onClick={() => navigate('/app/prescriptions')}>
                            {t('viewPrescriptions') + '...'}
                        </Anchor> */}
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
