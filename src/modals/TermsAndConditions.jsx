import { Anchor, Text, ScrollArea, Title, Stack, List } from '@mantine/core';

export function TermsAndConditions() {
    return (
        <ScrollArea h={400} p={20}>
            <Stack spacing="md">
                <Text>
                    Welcome to <b>Health Alpha</b> ("we," "us," or "our"). These Terms and Conditions govern your use of our healthcare platform. By accessing or using Health Alpha, you agree to comply with these terms.
                </Text>

                <Title order={5}>1. Eligibility</Title>
                <List spacing="sm" withPadding>
                    <List.Item>You must be at least 18 years old to use our services.</List.Item>
                    <List.Item>If accessing on behalf of a minor, you confirm parental or guardian consent.</List.Item>
                </List>

                <Title order={5}>2. Use of Services</Title>
                <List spacing="sm" withPadding>
                    <List.Item>Health Alpha provides healthcare consultations, health record management, and other related services.</List.Item>
                    <List.Item>You agree to provide accurate and up-to-date information.</List.Item>
                    <List.Item>You may not misuse, modify, or attempt unauthorized access to our platform.</List.Item>
                </List>

                <Title order={5}>3. Medical Disclaimer</Title>
                <List spacing="sm" withPadding>
                    <List.Item>Health Alpha is a digital platform that connects users with healthcare providers.</List.Item>
                    <List.Item>We do not provide medical advice. Consult a licensed physician for diagnosis and treatment.</List.Item>
                    <List.Item>Any reliance on information from Health Alpha is at your own risk.</List.Item>
                </List>

                <Text mt="md">For any questions, contact us at &nbsp;
                <Anchor href="mailto:support@healthalpha.ae">support@healthalpha.ae</Anchor></Text>
            </Stack>
        </ScrollArea>
    );
}
