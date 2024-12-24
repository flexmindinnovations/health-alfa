import {useEffect, useState} from 'react'
import {Avatar, Menu, Skeleton, Stack, Text, Title, useMantineTheme} from '@mantine/core'
import {LogOutIcon, SettingsIcon} from 'lucide-react'
import {useTranslation} from 'react-i18next'
import {useAuth} from "@contexts/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {useEncrypt} from "@hooks/EncryptData.jsx";

export function UserMenu({showHideSettingsModel}) {
    const {i18n, t} = useTranslation();
    const {logoutUser, user} = useAuth();
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState('');
    const theme = useMantineTheme();
    const {getEncryptedData} = useEncrypt();
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        const _profileImage = localStorage.getItem('profile_image') || '';
        const host = import.meta.env.VITE_API_URL;
        const imageUrl = `${host}/${_profileImage}`.replace('/api', '');
        setProfileImage(imageUrl);
        const role = getEncryptedData('roles')?.toLowerCase();
        if (role === 'admin') {
            setIsAdmin(true)
        }
        if (user && role) {
            processUserDetails(role);
        }
    }, [user])

    const processUserDetails = (role) => {
        const _userDetails = {
            username: '', email: '', mobileNumber: '',
        }

        switch (role) {
            case 'admin':
                break;
            case 'user':
                break;
            case 'doctor': {
                const {doctorName, emailId, mobileNo} = user;
                _userDetails.username = doctorName;
                _userDetails.email = emailId;
                _userDetails.mobileNumber = mobileNo;
                break;
            }
        }
        setUserDetails(_userDetails)
    }

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    }

    const handleMenuItemClicked = (item) => {
        switch (item) {
            case 'settings':
                showHideSettingsModel(true);
                break;
        }
    }

    return (<div>
        {!user && !isAdmin ? <Skeleton circle width={40} height={40}/> :

            <Menu shadow='md' width={250} radius='md' withArrow
                  arrowSize={15}
                  transitionProps={{
                      transition: 'scale'
                  }}
            >
                <Menu.Target>
                    <Avatar size={'md'} className='!flex items-center justify-center' src={profileImage}
                            radius='xl'
                            styles={{
                                root: {
                                    border: `2px solid ${theme.colors.brand[9]}`, cursor: 'pointer', padding: 2
                                }, image: {
                                    borderRadius: theme.radius.xl
                                }
                            }}
                    />
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item className='pointer-events-none'>
                        <Stack gap={0} className='flex flex-col items-start justify-start'>
                            <Text size={'xs'} className='opacity-50 text-sm'>{t('signedInAs')}</Text>
                            <Title size={18} className='font-semibold !my-0.5'>{userDetails.username || isAdmin ? 'Admin' : 'Guest'}</Title>
                            <p className='font-light text-xs'>{userDetails.email || isAdmin ? `admin@${t('brandEmail')}.com` : 'email@test.com'}</p>
                            <p className='font-light text-xs'>{userDetails.mobileNumber || '+xx-xxxxxxxx'}</p>
                        </Stack>
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item
                        leftSection={<SettingsIcon size={14}/>}
                        onClick={() => handleMenuItemClicked('settings')}
                    >
                        {t('settings')}
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item color='red' onClick={handleLogout} leftSection={<LogOutIcon size={14}/>}>
                        {t('logout')}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>}
    </div>)
}
