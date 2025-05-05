import {
    Modal,
    Text,
    TextInput,
    Button,
    Stack,
    Group
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { openNotificationWithSound } from '@config/Notifications';
import useHttp from '@hooks/AxiosInstance.jsx';

export function ForgotPasswordModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const http = useHttp();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: {
            email: (value) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? null
                    : t('invalidEmail'),
        },
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await http.post('/auth/forgot-password', { email: values.email });
            openNotificationWithSound({
                title: t('success'),
                message: t('passwordResetEmailSent'),
                color: 'green',
            }, 'success');
            onClose();
        } catch (error) {
            openNotificationWithSound({
                title: t('error'),
                message: t('passwordResetFailed'),
                color: 'red',
            }, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={t('forgotPassword')}
            centered
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <Text>{t('enterEmailForPasswordReset')}</Text>
                    <TextInput
                        label={t('email')}
                        placeholder={t('enterYourEmail')}
                        {...form.getInputProps('email')}
                        required
                    />
                    <Group position="end" mt="md">
                        <Button onClick={onClose} variant="default">
                            {t('cancel')}
                        </Button>
                        <Button type="submit" loading={loading}>
                            {t('submit')}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}