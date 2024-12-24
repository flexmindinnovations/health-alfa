import {
    Anchor,
    AspectRatio,
    Button,
    Card,
    Center,
    Checkbox,
    Grid,
    Group,
    Image,
    Overlay,
    Paper,
    PasswordInput,
    Stack,
    Text,
    useMantineTheme
} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {useForm} from '@mantine/form'
import {useState} from 'react';
import useHttp from '@hooks/AxiosInstance.js'
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
import Logo from '../assets/images/logo.png';
import {GlobalPhoneInput} from "@components/PhoneInput.jsx";
import {useEncrypt} from '@hooks/EncryptData.js';

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
                    openNotificationWithSound({
                        title: t('success'),
                        message: t('loginSuccessMessage'),
                        color: theme.colors.brand[9]
                    }, 'success')
                    navigate('/');
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
        <Card radius={0} shadow={0} pb={0} className={classes.loginPage}>
            <Paper pos={'relative'} className={`h-full flex !bg-tb-800/90 w-full !rounded-t-none`}
                   styles={{
                       root: {
                           borderBottomLeftRadius: theme.radius.xl,
                           borderBottomRightRadius: theme.radius.xl,
                       }
                   }}
            >
                <Overlay
                    blur={'20px'}
                    color={theme.colors.brand[5]}
                    opacity={0.8}
                    className={`lg:!rounded-b-[30px] xl:!rounded-b-[30px] 2xl:!rounded-b-[30px] !backdrop-blur-md`}>
                    <Grid grow gutter={0} className={`h-full w-full
                    lg:!rounded-b-full xl:!rounded-b-full 2xl:!rounded-b-full
                `}
                          styles={{
                              inner: {
                                  height: '100%',
                                  width: '100%',
                                  padding: theme.spacing.xl,
                              }
                          }}
                    >
                        <Grid.Col order={2} span={{base: 12, sm: 12, md: 5, lg: 4}}>
                            <Paper display={"flex"}
                                   className={`!bg-transparent !items-center h-full w-full lg:!rounded-r-none xl:!rounded-r-none 2xl:!rounded-r-none`}>
                                <Stack>
                                    <Center>
                                        <AspectRatio ratio={16 / 9}
                                                     className={`flex lg:!hidden xl:!hidden 2xl:!hidden`}>
                                            <Image
                                                bd={1}
                                                h={100}
                                                w={100}
                                                mb={20}
                                                fit="scale-down"
                                                src={Logo}
                                            />
                                        </AspectRatio>
                                    </Center>

                                    <Stack gap={5}>
                                        <Text align='center' className='w-full !text-white m-0' fz={'h1'} fw={'bold'}>
                                            Sign In
                                        </Text>
                                        <Text className='w-full !text-white text-center' fz={'sm'}>
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
                                                autoComplete="off"
                                                withAsterisk
                                                size='md'
                                                classNames={{
                                                    visibilityToggle: classes.visibilityToggle
                                                }}
                                                onVisibilityChange={toggle}
                                                className={`min-h-[5.5rem] ${classes.input}`}
                                                styles={{
                                                    label: {
                                                        fontWeight: 'inherit',
                                                        fontSize: '14px',
                                                        color: theme.white
                                                    },
                                                    input: {
                                                        backgroundColor: 'transparent',
                                                        color: theme.white
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
                                                my={20}
                                                loading={loading}
                                                onClick={handleFormSubmit}
                                            >
                                                Sign In
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
                            </Paper>
                        </Grid.Col>
                        <Grid.Col order={1} span={{base: 0, sm: 0, md: 7, lg: 8}}>
                            <Paper
                                className={`!bg-transparent h-full w-full !rounded-l-none xl:!rounded-l-none 2xl:!rounded-l-none`}></Paper>
                        </Grid.Col>
                    </Grid>
                </Overlay>
            </Paper>
        </Card>
    )
}
