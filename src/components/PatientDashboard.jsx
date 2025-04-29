import {useState, useEffect} from 'react';
import { Container, Title, Text, Grid, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@contexts/AuthContext.jsx";
import { DashboardGreeting } from '@components/DashboardGreeting.jsx';

export function PatientDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [username, setUsername] = useState('');

    useEffect(() => {
      if(user) {
        const _name = user?.firstName + ' ' + user?.lastName;
        setUsername(_name);
      }
    }, [user])
    

    const handleBookAppointment = () => {
        navigate('/app/book-appointment');
    };

    return (
        <Container fluid>
            <Grid>
                <Grid.Col span={{ base: 12, md: 12 }}>
                    <DashboardGreeting name={username} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                        <Title order={4}>{t('yourAppointments')}</Title>
                        <Text size="sm">{t('viewYourUpcomingAppointments')}</Text>
                        <Button mt="sm" onClick={() => navigate('/app/appointments')}>
                            {t('viewAppointments')}
                        </Button>
                    </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    {/* Placeholder for Quick Actions */}
                    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                        <Title order={4}>{t('quickActions')}</Title>
                        <Button mt="sm" onClick={handleBookAppointment}>
                            {t('bookNewAppointment')}
                        </Button>
                        {/* Add other actions like 'View Medical Records' */}
                    </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}>
                    {/* Placeholder for Notifications (Test Results, Messages) */}
                    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                        <Title order={4}>{t('notifications')}</Title>
                        <Text size="sm">{t('noNewNotifications')}</Text>
                        {/* Display actual notifications here */}
                    </div>
                </Grid.Col>
                {/* Add more widgets as needed */}
            </Grid>
        </Container>
    );
}
