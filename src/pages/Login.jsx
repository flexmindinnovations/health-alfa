import styles from '../styles/login.module.css'
import {
    Anchor,
    AspectRatio,
    Button,
    Card,
    Center,
    Checkbox,
    Group,
    Image,
    PasswordInput,
    Stack,
    Text,
    useMantineTheme
} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {useForm} from '@mantine/form'
import {useState} from 'react';
import useHttp from '@hooks/axios-instance.js'
import {useApiConfig} from '@contexts/ApiConfigContext.jsx'
import {openNotificationWithSound} from '@config/Notifications'
import {GlobalPhoneInput} from '@components/PhoneInput'
import Logo from '/images/logo.png';
import {zodResolver} from 'mantine-form-zod-resolver';
import {z} from 'zod';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import {motion} from 'framer-motion'
import {useNavigate} from 'react-router-dom'
import {useTranslation} from 'react-i18next';
import {useDocumentTitle} from '@hooks/DocumentTitle';

const emailSchema = z.string().min(3, {message: "Atleast 3 chars"});
const phoneNumberSchema = z.string().refine(
    (value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() || false;
    },
    {message: "Please enter a valid phone number"}
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
        {message: "Please enter a valid username"}
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

    const [visible, {toggle}] = useDisclosure(false);
    const theme = useMantineTheme()
    const {apiConfig} = useApiConfig()
    const [loading, setLoading] = useState(false);
    const http = useHttp();
    const navigate = useNavigate();
    const {t} = useTranslation();
    useDocumentTitle(t("login"));
    const radius = theme.radius.xl;
    console.log('radius: ', radius)

    const handleCountryChange = (selected) => {
        const {userName} = form.getValues();
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
        const {value} = event;
        form.setFieldValue('userName', value);
        form.validateField('userName');
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        const formValue = form.values;

        http.post(apiConfig.auth.login, formValue)
            .then((response) => {
                const {data} = response;
                if (data) {
                    const {token} = data;
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
                    whileInView={{opacity: 1, scale: 1}}
                    initial={{opacity: 0, scale: 0.7}}
                    className={`flex items-center justify-center !rounded-[28px]`}
                    transition={{duration: 0.3, ease: 'easeInOut'}}
                    style={{height: 'auto', width: '100%', overflow: 'hidden'}}
                >
                    <Card radius={"xl"}
                          className='!p-0 min-h-80 min-w-96 lg:h-[75vh] lg:w-[75%] lg:min-h-[62vh] flex flex-col lg:!flex-row-reverse'>
                        <Card.Section withBorder m={'auto'}
                                      className={`!flex flex-col ${styles.loginFormSection} flex-1 p-8`}>
                            <Card.Section className='w-full !mx-auto rounded-md'>
                                <Stack className='w-full py-2' align='center' gap={0}>
                                    <AspectRatio ratio={16 / 9} className={`flex lg:!hidden xl:!hidden 2xl:!hidden`}>
                                        <Image
                                            bd={1}
                                            h={100}
                                            w={100}
                                            mb={20}
                                            fit="scale-down"
                                            src={Logo}
                                        />
                                    </AspectRatio>
                                    <Text align='center' className='w-full m-0' fz={'h3'} fw={'bold'}>
                                        Sign In
                                    </Text>
                                    <Text className='w-full text-center' fz={'sm'}>
                                        Welcome back, please enter your details
                                    </Text>
                                </Stack>
                            </Card.Section>
                            <Card.Section className='w-full !mx-auto !flex-1'>
                                <form onSubmit={handleFormSubmit}>
                                    <Stack my={20} gap={10}>
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
                                                },
                                                error: {
                                                    fontSize: theme.fontSizes.xs
                                                }
                                            }}
                                        />
                                        <Group justify='space-between'>
                                            <Checkbox
                                                size='sm'
                                                styles={{
                                                    label: {
                                                        cursor: 'pointer'
                                                    }
                                                }}

                                                label="Remember Me"
                                            />
                                            <Anchor underline="hover" size='sm'>
                                                Forgot Password
                                            </Anchor>
                                        </Group>
                                        <Button
                                            disabled={!form.isValid()}
                                            size='md'
                                            my={20}
                                            loading={loading}
                                            onClick={handleFormSubmit}
                                        >
                                            Sign In
                                        </Button>
                                        <Center className='w-full'>
                                            <Text size='xs' styles={{
                                                root: {
                                                    textAlign: 'center'
                                                }
                                            }} className='opacity-70'>
                                                By clicking on &#39;Sign In&#39;, you acknowledge the&nbsp;
                                                <Anchor underline="always" size='xs'>
                                                    Terms of Services
                                                </Anchor>
                                                &nbsp; and &nbsp;
                                                <Anchor underline="always" size='xs'>
                                                    Privacy Policy
                                                </Anchor>
                                            </Text>
                                        </Center>
                                    </Stack>
                                </form>
                            </Card.Section>
                            <Card.Section withBorder mih={50} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Stack>
                                    <Center>
                                        <Text size='sm' opacity={apiConfig.appConfig.opacity}>
                                            {t('brandName')} &copy; {t('since')} {2023}
                                        </Text>
                                    </Center>
                                </Stack>
                            </Card.Section>
                        </Card.Section>
                        <Card.Section
                            m="auto"
                            className={`${styles.loginInfoSection} !hidden lg:!flex flex-[2] relative`}
                            style={{
                                height: '100%',
                                position: 'relative',
                            }}
                        >
                            <Group className="w-full" p="lg" align="start" gap={0}>
                                <AspectRatio ratio={16 / 9}>
                                    <Image
                                        bd={1}
                                        h={150}
                                        w={150}
                                        fit="scale-down"
                                        src={Logo}
                                    />
                                </AspectRatio>
                            </Group>
                            <div
                                className="absolute bottom-0 left-0 w-full h-24 pointer-events-none"
                                style={{
                                    height: '100%',
                                }}
                            />
                        </Card.Section>

                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
