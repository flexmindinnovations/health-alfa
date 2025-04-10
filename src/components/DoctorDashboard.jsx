import React from 'react';
import { Container, Title, Text, Grid } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function DoctorDashboard() {
    const { t } = useTranslation();

    return (
        <Container fluid>
            <Title order={2} mb="lg">{t('doctorDashboard')}</Title>
            <Text mb="md">{t('welcomeDoctorMessage')}</Text>

            {/* Example Grid Layout for Widgets */}
            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    {/* Placeholder for Upcoming Appointments List/Calendar */}
                     <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                        <Title order={4}>{t('upcomingAppointments')}</Title>
                        <Text size="sm">{t('viewYourSchedule')}</Text>
                        {/* Integrate Appointment List or Calendar Component */}
                    </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    {/* Placeholder for Quick Stats (e.g., Patients Today) */}
                     <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                        <Title order={4}>{t('quickStats')}</Title>
                        <Text size="sm">{t('patientsToday')}: 5</Text>
                        <Text size="sm">{t('pendingPrescriptions')}: 2</Text>
                        {/* Add more relevant stats */}
                    </div>
                </Grid.Col>
                 <Grid.Col span={{ base: 12 }}>
                    {/* Placeholder for Quick Access to Patient Records */}
                     <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                        <Title order={4}>{t('recentPatients')}</Title>
                        <Text size="sm">{t('accessRecentPatientFiles')}</Text>
                        {/* Add search or list */}
                    </div>
                </Grid.Col>
                {/* Add more widgets as needed */}
            </Grid>
        </Container>
    );
}
