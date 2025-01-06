import {
    Anchor,
    AspectRatio, Button,
    Center, Checkbox,
    Container,
    Grid, Group,
    Image,
    Overlay,
    PasswordInput,
    Stack,
    Text,
    useMantineTheme
} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {useForm} from '@mantine/form'
import {useState} from 'react';
import useHttp from '@hooks/AxiosInstance.jsx'
import {useApiConfig} from '@contexts/ApiConfigContext.jsx'
import {openNotificationWithSound} from '@config/Notifications'
import classes from '@styles/login.module.css';
import {zodResolver} from 'mantine-form-zod-resolver';
import {z} from 'zod';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import {useNavigate} from 'react-router-dom'
import {useTranslation} from 'react-i18next';
import {useDocumentTitle} from '@hooks/DocumentTitle';
import {useAuth} from "@contexts/AuthContext.jsx";
import {useEncrypt} from '@hooks/EncryptData.jsx';
import {motion} from 'framer-motion';
import Logo from "../assets/images/logo.png";
import {GlobalPhoneInput} from "@components/PhoneInput.jsx";

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
    const {setUserDetails} = useAuth();
    const [loading, setLoading] = useState(false);
    const http = useHttp();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {setEncryptedData} = useEncrypt();
    useDocumentTitle(t("login"));
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);
    const [isLoginError, setIsLoginError] = useState(false);
    const [isCardLoaded, setIsCardLoaded] = useState(false);

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
                    const {token, clientModel, doctorModel, userId, roleName} = data;
                    setEncryptedData('roles', roleName);
                    setEncryptedData('user', userId);
                    if (clientModel && typeof clientModel === 'object' && Object.keys(clientModel).length > 0) {
                        const {profileImagePath} = clientModel;
                        localStorage.setItem('profile_image', profileImagePath);
                        setUserDetails(JSON.parse((JSON.stringify(clientModel))));
                    }
                    if (doctorModel && typeof doctorModel === 'object' && Object.keys(doctorModel).length > 0) {
                        const {doctorProfileImagePath} = doctorModel;
                        localStorage.setItem('profile_image', doctorProfileImagePath);
                        setUserDetails(JSON.parse((JSON.stringify(doctorModel))));
                    }
                    localStorage.setItem('token', token);
                    setIsLoginSuccess(true);
                    openNotificationWithSound({
                        title: t('success'),
                        message: t('loginSuccessMessage'),
                        color: theme.colors.brand[9]
                    }, 'success')
                    setTimeout(() => {
                        navigate('/');
                    }, 1000)
                }
            }).catch(error => {
            if (error.status === 401) {
                const response = error.response;
                if (response) {
                    const {data} = response;
                    openNotificationWithSound({
                        title: t('unauthorized'),
                        message: data.message,
                        color: theme.colors.red[6]
                    }, 'error')
                }
            } else {
                openNotificationWithSound({
                    title: error.name,
                    message: error.message,
                    color: theme.colors.red[6]
                }, 'error')
            }
            setIsLoginError(true);
        }).finally(() => {
            setLoading(false);
            setTimeout(() => {
                setIsLoginSuccess(false);
                setIsLoginError(false);
            }, 2500)
        })
    }

    return (
        <Container fluid className={classes.loginPage}>
            <Overlay className={`h-full w-full flex items-center justify-center !backdrop-blur-lg`}>
                <Center p={20}>
                    <motion.div
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        onAnimationComplete={() => setIsCardLoaded(true)}
                        className={`bg-tb-700 max-w-sm p-4 relative rounded-3xl`}
                    >
                        <motion.div>
                            <Grid>
                                <Grid.Col order={2} span={12}>
                                    <Stack>
                                        <Center>
                                            <motion.div
                                                className={`
                                                absolute -top-16
                                                mb-4
                                            h-36 w-36 bg-white p-2 
                                            flex items-center justify-center rounded-full
                                            `}>
                                                {
                                                    isCardLoaded && (
                                                        <motion.div
                                                            className={`h-full w-full 
                                                 flex items-center justify-center rounded-full`}
                                                            initial={{opacity: 0, scale: 0.8}}
                                                            animate={{opacity: 1, scale: 1}}
                                                            exit={{opacity: 0, scale: 0.8}}
                                                        >
                                                            <AspectRatio ratio={16 / 9}>
                                                                <Image
                                                                    bd={1}
                                                                    h={100}
                                                                    w={100}
                                                                    fit="scale-down"
                                                                    src={Logo}
                                                                />
                                                            </AspectRatio>
                                                        </motion.div>
                                                    )
                                                }
                                            </motion.div>
                                        </Center>

                                        <Stack gap={5} mt={50}>
                                            <Text align='center' className='w-full !text-white m-0' fz={'h1'}
                                                  fw={'bold'}>
                                                Sign In
                                            </Text>
                                            <Text className='w-full text-xs !text-white text-center' fz={'sm'}>
                                                Welcome back, please enter your details
                                            </Text>
                                        </Stack>

                                        <form onSubmit={handleFormSubmit}>
                                            <Stack my={20} gap={10}>
                                                <GlobalPhoneInput
                                                    {...form.getInputProps('userName')}
                                                    label='Username'
                                                    withAsterisk
                                                    onChange={handleUsernameChange}
                                                    onCountryChange={handleCountryChange}
                                                    className={`w-full !text-white m-0`}
                                                    required={true}
                                                    labelProps={{
                                                        color: 'white',
                                                    }}
                                                />
                                                <PasswordInput
                                                    {...form.getInputProps('userPassword')}
                                                    label='Password'
                                                    radius={'xl'}
                                                    autoComplete="off"
                                                    variant='default'
                                                    withAsterisk
                                                    size='md'
                                                    classNames={{
                                                        visibilityToggle: classes.visibilityToggle
                                                    }}
                                                    onVisibilityChange={toggle}
                                                    varient={'outlined'}
                                                    className={`min-h-[5.5rem]`}
                                                    styles={{
                                                        label: {
                                                            fontSize: '14px',
                                                            color: theme.white
                                                        },
                                                        input: {
                                                            fontSize: '14px',
                                                        },
                                                        root: {
                                                            backgroundColor: 'transparent'
                                                        }
                                                    }}
                                                />
                                                <Group justify='space-between'>
                                                    <Checkbox
                                                        size='sm'
                                                        styles={{
                                                            label: {
                                                                cursor: 'pointer',
                                                                color: theme.white
                                                            }
                                                        }}

                                                        label="Remember Me"
                                                    />
                                                    <Anchor underline="hover" c={theme.white} size='sm'>
                                                        Forgot Password
                                                    </Anchor>
                                                </Group>
                                                <Button
                                                    disabled={!form.isValid()}
                                                    size='md'
                                                    variant={"white"}
                                                    my={20}
                                                    loading={loading}
                                                    onClick={handleFormSubmit}
                                                    component={motion.div}
                                                    style={{transition: 'background-color 0.3s ease'}}
                                                    c={
                                                        isLoginSuccess ? theme.white : isLoginError ? theme.white : ''
                                                    }
                                                    animate={{
                                                        backgroundColor: isLoginSuccess
                                                            ? theme.colors.teal[6]
                                                            : isLoginError
                                                                ? theme.colors.red[6]
                                                                : ''
                                                    }}
                                                >
                                                    {
                                                        isLoginSuccess ? t('signedIn') : t('signIn')
                                                    }
                                                </Button>
                                                <Center className='w-full'>
                                                    <Text size='xs' styles={{
                                                        root: {
                                                            textAlign: 'center',
                                                            color: theme.white,
                                                        }
                                                    }} className='opacity-70'>
                                                        By clicking on &#39;Sign In&#39;, you acknowledge the&nbsp;
                                                        <Anchor underline="always" c={theme.colors.brand[1]} size='xs'>
                                                            Terms of Services
                                                        </Anchor>
                                                        &nbsp; and &nbsp;
                                                        <Anchor underline="always" c={theme.colors.brand[1]} size='xs'>
                                                            Privacy Policy
                                                        </Anchor>
                                                    </Text>
                                                </Center>
                                            </Stack>
                                        </form>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        </motion.div>
                    </motion.div>
                </Center>
            </Overlay>
        </Container>
    )
}
