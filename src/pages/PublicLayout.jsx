import {AppShell, Burger, Button, Group, UnstyledButton, useMantineTheme} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {useAuth} from '@contexts/auth.context'
import {useTranslation} from 'react-i18next'
import {Link, Outlet, useLocation} from 'react-router-dom'
import styles from '@styles/layout.module.css'
import {createElement, useEffect, useState} from 'react'
import {HeadsetIcon, HomeIcon, InfoIcon, LayoutDashboardIcon, LockIcon} from 'lucide-react';

const links = [
    {link: '/', label: 'Home', icon: HomeIcon, key: 'Home', active: false},
    {
        link: '/about-us',
        label: 'About',
        icon: InfoIcon,
        key: 'About',
        active: false
    },
    {
        link: '/contact-us',
        label: 'Contact',
        icon: HeadsetIcon,
        key: 'Contact',
        active: false
    }
]

const authItems = [
    {
        link: '/login',
        label: 'Login',
        icon: LockIcon,
        key: 'login',
        active: true
    },
    {
        link: '/app',
        label: 'Go To Dashboard',
        icon: LayoutDashboardIcon,
        key: 'dashboard',
        active: false
    }
]

export function PublicLayout() {
    const [opened, {toggle}] = useDisclosure()
    const {t} = useTranslation()
    const [menuItems, setMenuItems] = useState([])
    const [publicItems, setpublicItems] = useState([])
    const [userMenuItems, setUserMenuItems] = useState(authItems)
    const {pathname} = useLocation()
    const {isAuthenticated} = useAuth()
    const theme = useMantineTheme()

    useEffect(() => {
        const updatedMenuItems = links.map(item => ({
            ...item,
            active: `${item.link}` === pathname
        }))
        const publicItems = updatedMenuItems.slice(links.length - 1, links.length)
        setMenuItems(updatedMenuItems)
        setpublicItems(publicItems)

        const updatedItems = userMenuItems.map(item => {
            const obj = item
            if (obj.key === 'login') obj.active = !isAuthenticated() ? true : false
            if (obj.key === 'dashboard') obj.active = isAuthenticated()
            return obj
        })
        setUserMenuItems(updatedItems)
    }, [isAuthenticated])

    const handleNavClick = menuItem => {
        const publicLinkItemIndex = publicItems.findIndex(
            item => item.key === menuItem.key
        )
        const isPublicLink = publicLinkItemIndex !== -1
        const updateMenuItems = menuItems.map(item => ({
            ...item,
            active: item.key === menuItem.key
        }))
        setMenuItems(updateMenuItems)
        if (!isPublicLink) toggle()
    }

    return (
        <AppShell
            header={{height: 60}}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {desktop: true, mobile: !opened}
            }}
            padding={0}
        >
            <AppShell.Header>
                <Group h='100%' px='md'>
                    <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='md'/>
                    <Group justify='space-between' style={{flex: 1}}>
                        <div></div>
                        <Group ml='xl' gap={10} visibleFrom='md'>
                            {menuItems.map(item => (
                                <UnstyledButton
                                    key={item.key}
                                    onClick={() => handleNavClick(item)}
                                    className={`${
                                        item.active ? styles.activeItem : styles.inactiveItem
                                    } ${styles.publicNavbarItem}`}
                                >
                                    <Link
                                        to={item.link}
                                        className={`flex items-center py-2 px-4 text-sm gap-2 !font-medium`}
                                    >
                                        <span>{createElement(item.icon, {size: 16})}</span>
                                        <span>{t(item.key)}</span>
                                    </Link>
                                </UnstyledButton>
                            ))}
                        </Group>
                        <Group>
                            {userMenuItems.map(
                                item =>
                                    item.active && (
                                        <Button
                                            variant='outline'
                                            p={0}
                                            color={theme.primaryColor}
                                            key={item.key}
                                            onClick={() => handleNavClick(item)}
                                            className={`!rounded-full`}
                                        >
                                            <Link
                                                to={item.link}
                                                className={`flex items-center py-2 px-4 text-sm gap-2 !font-medium`}
                                            >
                                                <span>{createElement(item.icon, {size: 16})}</span>
                                                <span>{t(item.label)}</span>
                                            </Link>
                                        </Button>
                                    )
                            )}
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py='md' px={4}>
                {menuItems.slice(0, menuItems.length - 1).map(item => (
                    <UnstyledButton
                        key={item.key}
                        onClick={() => handleNavClick(item)}
                        className={`${
                            item.active ? styles.activeItem : styles.inactiveItem
                        } ${styles.publicNavbarItem} sm:!max-w-[50%]`}
                    >
                        <Link
                            to={item.link}
                            className={`flex items-center py-2 px-6 text-sm gap-2 lg:gap-4 xl:gap-4 2xl:gap-4 !font-medium ${
                                item.active ? 'text-white' : 'text-cTextPrimary'
                            }`}
                        >
                            <span>{createElement(item.icon, {size: 16})}</span>
                            <span>{t(item.key)}</span>
                        </Link>
                    </UnstyledButton>
                ))}
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet/>
            </AppShell.Main>
        </AppShell>
    )
}
