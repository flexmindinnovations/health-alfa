import {forwardRef} from 'react'
import {Avatar, Group, Menu, UnstyledButton} from '@mantine/core'
import {LogOutIcon, SettingsIcon} from 'lucide-react'
import {useTranslation} from 'react-i18next'
import {useAuth} from "@contexts/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {modals} from "@mantine/modals";
import Settings from "@components/Settings.jsx";

// eslint-disable-next-line react/display-name
const UserButton = forwardRef(({image, name, email, ...others}, ref) => (
    <UnstyledButton
        ref={ref}
        style={{
            color: 'var(--mantine-color-text)',
            borderRadius: 'var(--mantine-radius-sm)'
        }}
        {...others}
    >
        <Group>
            <Avatar src={image} radius='xl'/>
        </Group>
    </UnstyledButton>
))

export function UserMenu({showHideSettingsModel}) {
    const {i18n, t} = useTranslation();
    const {logoutUser} = useAuth();
    const navigate = useNavigate();

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
            <Menu shadow='md' width={250} radius='md' withArrow>
                <Menu.Target>
                    <UserButton
                        image='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png'
                        name='Harriette Spoonlicker'
                        email='hspoonlicker@outlook.com'
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
            </Menu>
        </div>
    )
}
