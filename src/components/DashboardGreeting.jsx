import React, { useState, useEffect } from 'react';
import { Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import classes from '@styles/Dashboard.module.css';

export const DashboardGreeting = React.memo(({ name }) => {
    const { t } = useTranslation();
    const [greetingKey, setGreetingKey] = useState('');

    useEffect(() => {
        const currentHour = dayjs().hour();
        let key = 'goodMorning';
        if (currentHour >= 5 && currentHour < 12) {
            key = 'goodMorning';
        } else if (currentHour >= 12 && currentHour < 18) {
            key = 'goodAfternoon';
        }
        setGreetingKey(key);
    }, []);

    if (!greetingKey) {
        return null;
    }

    return (
        <Title
            order={2}
            mb="lg"
            className={classes.animatedGradientTitle}
        >
            {t(greetingKey)}{name ? `, ${name}` : ''}
        </Title>
    );
});

DashboardGreeting.displayName = 'DashboardGreeting';
