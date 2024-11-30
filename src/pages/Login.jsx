import styles from '../styles/login.module.css'
import { Button, Card, Stack, Center, Image, PasswordInput, Text, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { useState } from 'react';
import useHttp from '@hooks/axios-instance.js'
import { useApiConfig } from '@contexts/ApiConfigContext.jsx'
import { openNotificationWithSound } from '@config/Notifications'
import { GlobalPhoneInput } from '@components/PhoneInput'
import Logo from '/images/logo.png';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const emailSchema = z.string().min(3, { message: "Atleast 3 chars" });
const phoneNumberSchema = z.string().refine(
    (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() || false;
    },
    { message: "Please enter a valid phone number" }
);

const passwordSchema = z.string().min(3, "Password must be at least 3 characters long.")
const loginSchema = z.object({
    userName: z.string().refine(
        (value) => {
            const trimmedValue = value.trim();
            const isPhoneNumber = /^\d|\+/.test(trimmedValue);
            if (!isPhoneNumber) {
                return emailSchema.safeParse(trimmedValue).success;
            } else {
                return phoneNumberSchema.safeParse(value).success;
            }
        },
        { message: "Please enter a valid username" }
    ),
    userPassword: passwordSchema
})

export default function Login() {
    const form = useForm({
        initialValues: {
            userName: '',
            userPassword: ''
        },
        validateInputOnBlur: true,
        validateInputOnChange: true,
        validate: zodResolver(loginSchema)
    });

    const [visible, { toggle }] = useDisclosure(false);
    const theme = useMantineTheme()
    const { apiConfig } = useApiConfig()
    const [loading, setLoading] = useState(false);
    const http = useHttp();
    const navigate = useNavigate();

    const handleCountryChange = (selected) => {
        const { userName } = form.getValues();
        const formattedValue = userName.trim();
        if (formattedValue) {
            const isPhoneNumber = /^\d|\+/.test(formattedValue);
            if (isPhoneNumber && !formattedValue.startsWith(selected.label)) {
                const updatedValue = formattedValue.replace(/^\+?/, '');
                form.setFieldValue('userName', updatedValue);
                form.validateField('userName');
            } else {
                form.setFieldValue('userName', formattedValue);
                form.validateField('userName');
            }
        }
        form.validateField('userName');
    };

    const handleUsernameChange = (event) => {
        const { value } = event;
        form.setFieldValue('userName', value);
        form.validateField('userName');
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const formValue = form.values;

        http.post(apiConfig.auth.login, formValue)
            .then((response) => {
                const { data } = response;
                if (data) {
                    const { token } = data;
                    localStorage.setItem('token', token)
                    openNotificationWithSound({
                        title: 'Success',
                        message: 'You have been successfully verified',
                        color: theme.colors.brand[9]
                    }, 'success')
                    navigate('/')
                }
            }).catch(error => {
                openNotificationWithSound({
                    title: error.name,
                    message: error.message,
                    color: theme.colors.red[6]
                }, 'error')
            }).finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.overlay}>
                <motion.div
                    whileInView={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ height: 'auto', overflow: 'hidden' }}
                >
                    <Card p={0} className='min-h-80 min-w-96 lg:min-h-[62vh] lg:max-w-96' radius={'lg'}>
                        <Card.Section mx={'auto'} my={10}>
                            <Stack className='w-full' align='center' gap={0}>
                                <Center>
                                    <Image
                                        bd={1}
                                        h={120}
                                        w={120}
                                        fit='scale-down'
                                        src={Logo}
                                    />
                                </Center>
                            </Stack>
                        </Card.Section>
                        <Card.Section className='w-full !mx-auto'>
                            <Stack className='w-full py-2' align='center' gap={0}>
                                <Text align='center' className='w-full m-0' fz={'h3'} fw={'bold'}>
                                    Welcome Back!
                                </Text>
                                <Text className='w-full text-center' fz={'h6'} opacity={0.8}>Enter Your Phone Number to Get OTP</Text>
                            </Stack>
                        </Card.Section>
                        <Card.Section className='w-full !mx-auto' px={30}>
                            <form onSubmit={handleFormSubmit}>
                                <Stack my={20} gap={20}>
                                    <GlobalPhoneInput
                                        {...form.getInputProps('userName')}
                                        label='Username'
                                        withAsterisk
                                        onChange={handleUsernameChange}
                                        onCountryChange={handleCountryChange}
                                        styles={{
                                            label: {
                                                fontWeight: 'inherit',
                                                fontSize: '14px'
                                            }
                                        }}
                                    />
                                    <PasswordInput
                                        {...form.getInputProps('userPassword')}
                                        label='Password'
                                        withAsterisk
                                        size='md'
                                        radius={'md'}
                                        onVisibilityChange={toggle}
                                        styles={{
                                            label: {
                                                fontWeight: 'inherit',
                                                fontSize: '14px'
                                            }
                                        }}
                                    />
                                    <Button
                                        disabled={!form.isValid()}
                                        size='md'
                                        my={20}
                                        loading={loading}
                                        onClick={handleFormSubmit}
                                    >
                                        Login
                                    </Button>
                                </Stack>
                            </form>
                        </Card.Section>
                    </Card>
                </motion.div>
            </div>
        </div >
    )
}
