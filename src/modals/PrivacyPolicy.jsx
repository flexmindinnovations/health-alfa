import { Anchor, Text, ScrollArea, Title, Stack, List } from '@mantine/core';

export function PrivacyPolicy() {
    const listItemFontSize = 13;

    return (
        <ScrollArea h={400} p={20}>
            <Stack spacing="md">
                <Text>
                    Health Alpha is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our healthcare platform.
                </Text>

                <Title order={5}>1. Information We Collect</Title>
                <List spacing="sm" withPadding
                    styles={{
                        item: {
                            fontSize: listItemFontSize
                        }
                    }}
                >
                    <List.Item><b>Personal Details:</b> Name, email address, phone number, and date of birth.</List.Item>
                    <List.Item><b>Health Information:</b> Medical history, prescriptions, symptoms, and other health-related data you provide.</List.Item>
                    <List.Item><b>Payment Information:</b> Billing details for paid services.</List.Item>
                    <List.Item><b>Device and Usage Information:</b> IP address, browser type, and usage patterns.</List.Item>
                </List>

                <Title order={5}>2. How We Use Your Information</Title>
                <List spacing="sm" withPadding
                    styles={{
                        item: {
                            fontSize: listItemFontSize
                        }
                    }}
                >
                    <List.Item>Providing healthcare consultation services.</List.Item>
                    <List.Item>Improving our platform and user experience.</List.Item>
                    <List.Item>Sending appointment reminders and health-related notifications.</List.Item>
                    <List.Item>Ensuring compliance with legal and regulatory requirements.</List.Item>
                </List>

                <Title order={5}>3. Data Sharing and Disclosure</Title>
                <List spacing="sm" withPadding
                styles={{
                        item: {
                            fontSize: listItemFontSize
                        }
                    }}
                >
                    <List.Item><b>Healthcare Providers:</b> Doctors and medical professionals for consultations.</List.Item>
                    <List.Item><b>Service Providers:</b> Third-party vendors who assist in platform operations (e.g., payment processing).</List.Item>
                    <List.Item><b>Legal Authorities:</b> If required by law or to protect user safety.</List.Item>
                </List>

                <Title order={5}>4. Data Security</Title>
                <List spacing="sm" withPadding
                styles={{
                        item: {
                            fontSize: listItemFontSize
                        }
                    }}
                >
                    <List.Item>End-to-end encryption for data transmission.</List.Item>
                    <List.Item>Secure cloud storage with restricted access.</List.Item>
                    <List.Item>Regular security audits and compliance checks.</List.Item>
                </List>

                <Title order={5}>5. Your Rights and Choices</Title>
                <List spacing="sm" withPadding
                styles={{
                        item: {
                            fontSize: listItemFontSize
                        }
                    }}
                >
                    <List.Item>Access, correct, or delete your personal data.</List.Item>
                    <List.Item>Withdraw consent for data processing.</List.Item>
                    <List.Item>Request a copy of your stored health records.</List.Item>
                </List>

                <Title order={5}>6. Compliance with Laws</Title>
                <List spacing="sm" withPadding
                styles={{
                        item: {
                            fontSize: listItemFontSize
                        }
                    }}
                >
                    <List.Item>HIPAA (if applicable in the U.S.).</List.Item>
                    <List.Item>GDPR (for EU users).</List.Item>
                    <List.Item>Dubai Data Protection Law (for operations in the UAE).</List.Item>
                </List>

                <Title order={5}>7. Retention of Data</Title>
                <Text>
                    We retain user data only as long as necessary for legal, regulatory, or operational purposes. Upon account deletion, we will securely erase your personal information.
                </Text>

                <Title order={5}>8. Changes to This Privacy Policy</Title>
                <Text>
                    We may update this policy periodically. Any significant changes will be communicated via email or app notifications.
                </Text>

                <Text mt="md">For any privacy-related questions or requests, please contact us at &nbsp;
                    <Anchor href="mailto:support@healthalpha.ae">support@healthalpha.ae</Anchor></Text>
            </Stack>
        </ScrollArea>
    )
}