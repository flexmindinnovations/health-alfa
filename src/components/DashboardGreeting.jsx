import React from 'react';
import { Title } from '@mantine/core';
import classes from '@styles/Dashboard.module.css';

/**
 * A reusable component to display a time-based greeting with a user's name.
 *
 * @param {object} props - Component props.
 * @param {string} props.greeting - The translation key for the greeting (e.g., 'goodMorning').
 * @param {string} [props.name] - The formatted name of the user to display (optional).
 * @param {function} props.t - The translation function.
 * @returns {React.ReactElement} The rendered greeting component.
 */
export const DashboardGreeting = React.memo(({ greeting, name, t }) => {
    // Basic validation for required props
    if (!greeting || !t) {
        console.warn("DashboardGreeting: 'greeting' and 't' props are required.");
        return null;
    }

    return (
        <Title
            order={2}
            mb="lg"
            className={classes.animatedGradientTitle} // Keep relevant styling
        >
            {/* Display the translated greeting. Add the name if provided. */}
            {t(greeting)}{name ? `, ${name}` : ''}
        </Title>
    );
});