import { forwardRef, useState, useEffect } from 'react'
import { Avatar, Group, Menu, useMantineTheme } from '@mantine/core'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from "@contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import Settings from "@components/Settings.jsx";

// eslint-disable-next-line react/display-name
const UserButton = forwardRef(({ image, name, email, ...others }, ref) => (
    <Avatar
        ref={ref}
        size={'sm'}
        radius={'xl'}

        {...others}
    >
        <Group>
            <Avatar src={image} radius='xl' />
        </Group>
    </Avatar>
))

export function UserMenu({ showHideSettingsModel }) {
    const { i18n, t } = useTranslation();
    const { logoutUser, user } = useAuth();
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState('');
    const theme = useMantineTheme();


    useEffect(() => {
        const _profileImage = localStorage.getItem('profile_image') || '';
        const host = import.meta.env.VITE_API_URL;
        const imageUrl = `${host}/${_profileImage}`.replace('/api', '');
        setProfileImage(imageUrl);
    }, [])

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

    return (
        <div>
            <Menu shadow='md' width={250} radius='md' withArrow
            arrowSize={15}
            transitionProps={{
                transition: 'scale'
            }}
            >
                <Menu.Target>
                    {/* <UserButton
                        image={profileImage}
                        name='Harriette Spoonlicker'
                        email='hspoonlicker@outlook.com'
                    /> */}
                    <Avatar size={'md'} className='!flex items-center justify-center' src={profileImage} radius='xl'
                        styles={{
                            root: {
                                border: `2px solid ${theme.colors.brand[9]}`,
                                cursor: 'pointer',
                                padding: 2
                            },
                            image: {
                                borderRadius: theme.radius.xl
                            }
                        }}
                    />
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item className='pointer-events-none'>
                        <div className='flex flex-col items-start justify-start'>
                            <p className='opacity-50 text-sm'>{t('signedInAs')}</p>
                            <h2 className='font-semibold'>User</h2>
                            <p className='font-light text-xs'>zoey@example.com</p>
                        </div>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        leftSection={<SettingsIcon size={14} />}
                        onClick={() => handleMenuItemClicked('settings')}
                    >
                        {t('settings')}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color='red' onClick={handleLogout} leftSection={<LogOutIcon size={14} />}>
                        {t('logout')}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </div>
    )
}
