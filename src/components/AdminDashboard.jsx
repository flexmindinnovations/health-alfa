import React from 'react';
import { Container, Title, Text, Grid } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function AdminDashboard() {
    const { t } = useTranslation();

    return (
        <Container fluid>
            <Title order={2} mb="lg">{t('adminDashboard')}</Title>
            <Text mb="md">{t('welcomeAdminMessage')}</Text>

            <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    {/* Placeholder for a widget (e.g., User Management) */}
                    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                        <Title order={4}>{t('userManagement')}</Title>
                        <Text size="sm">{t('manageDoctorsPatients')}</Text>
                        {/* Add buttons or links */}
                    </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    {/* Placeholder for another widget (e.g., System Settings) */}
                     <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                        <Title order={4}>{t('systemSettings')}</Title>
                        <Text size="sm">{t('configureSystem')}</Text>
                        {/* Add buttons or links */}
                    </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                    {/* Placeholder for stats (e.g., Total Appointments) */}
                     <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
                        <Title order={4}>{t('appointmentStats')}</Title>
                        <Text size="sm">{t('viewAppointmentTrends')}</Text>
                        {/* Add charts or stats */}
                    </div>
                </Grid.Col>
                {/* Add more widgets as needed */}
            </Grid>
        </Container>
    );
}
