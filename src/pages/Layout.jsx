import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppShell, AspectRatio, Breadcrumbs, Burger, Group, Image, Text, UnstyledButton, useMantineTheme, Tooltip } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import styles from '@styles/layout.module.css';
import { createElement, useEffect, useState, useCallback } from 'react'; // Added useCallback
import { MENU_ITEMS } from '@config/MenuItems.js';
import { Settings } from '@components/Settings.jsx';
import { useTranslation } from 'react-i18next';
import { UserMenu } from '@components/UserMenu.jsx';
import logo from '/images/logo.png';
import { AnimatePresence, motion } from 'framer-motion';
import { modals } from "@mantine/modals";
import { ChevronRight, Home } from 'lucide-react';
import { useEncrypt } from "@hooks/EncryptData.jsx";

export function Layout() {
    const { t, i18n } = useTranslation();
    const [menuItems, setMenuItems] = useState([]);
    const [opened, { toggle }] = useDisclosure();
    const { pathname } = useLocation();
    const theme = useMantineTheme();
    const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
    const { getEncryptedData } = useEncrypt();
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);

    const filteredMenuItems = useCallback(() => {
        const userRole = getEncryptedData('roles')?.toUpperCase();
        if (!userRole) return MENU_ITEMS;
        return MENU_ITEMS.filter((item) => item.roles.includes(userRole));
    }, [getEncryptedData]);

    useEffect(() => {
        const currentMenuItems = filteredMenuItems();
        const activePath = sessionStorage.getItem('currentItem') || pathname;

        const updatedMenuItems = currentMenuItems.map(item => ({
            ...item,
            active: `/app${item.route}` === activePath
        }));
        setMenuItems(updatedMenuItems);

        const pathSegments = pathname.split('/').filter(segment => segment && segment !== 'app');
        const generatedBreadcrumbs = [];
        let currentCumulativePath = '/app';

        pathSegments.forEach((segment, index) => {
            currentCumulativePath += `/${segment}`;
            const isLastSegment = index === pathSegments.length - 1;

            const matchingMenuItem = currentMenuItems.find(item => `/app${item.route}` === currentCumulativePath);

            if (matchingMenuItem) {
                if (!generatedBreadcrumbs.some(b => b.href === currentCumulativePath)) {
                    generatedBreadcrumbs.push({
                        key: matchingMenuItem.key,
                        href: currentCumulativePath,
                        title: t(matchingMenuItem.key),
                        active: isLastSegment
                    });
                }
            }
        });

        setBreadcrumbItems(generatedBreadcrumbs);
    }, [pathname, filteredMenuItems, t]);

    const handleNavClick = useCallback((menuItem) => {
        const targetPath = `/app${menuItem.route}`;
        sessionStorage.setItem('currentItem', targetPath);
        setMenuItems(prevItems => prevItems.map(item => ({
            ...item,
            active: item.id === menuItem.id
        })));
        if (window.innerWidth < 768) toggle();
    }, [toggle]);

    const openSettings = useCallback(() => {
        const renderTitle = () => (
            <Text size="md" fw={600}>
                {t('settings')}
            </Text>
        );

        modals.open({
            title: renderTitle(),
            transitionProps: { duration: 100, timingFunction: 'linear' },
            size: 'xl',
            withCloseButton: true,
            fullScreen: isSmallScreen,
            centered: true,
            styles: {
                title: { width: '100%' },
                content: { overflow: 'hidden' },
                body: { minHeight: '50vh', padding: 0 }
            },
            children: <Settings />,
        });
    }, [t, isSmallScreen]);

    return (
        <AppShell
            header={{ height: 50 }}
            navbar={{
                width: 250,
                breakpoint: 'sm',
                collapsed: { mobile: !opened }
            }}
            styles={{ main: { height: '100vh', display: 'flex', flexDirection: 'column' } }}
            padding='sm'
            layout='alt'
            pl={0}
        >
            <AppShell.Header>
                <Group h='100%' px='20'>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom='sm'
                        size='md'
                    />
                    <Group justify='space-between' style={{ flex: 1 }}>
                        <Breadcrumbs
                            separator={<ChevronRight size={16} />}
                            styles={{ separator: { color: theme.colors.gray[6] } }}
                            className="!flex !items-center !gap-2"
                        >
                            <Tooltip label={t('home')}>
                                <UnstyledButton
                                    onClick={() => handleNavClick(MENU_ITEMS[0])}
                                >
                                    <Link to={`/app${MENU_ITEMS[0].route}`}>
                                        <Home size={16} />
                                    </Link>
                                </UnstyledButton>
                            </Tooltip>
                            {breadcrumbItems.map((item) =>
                                item.active ? (
                                    <Text key={item.key} size={'sm'} c={theme.primaryColor} fw={500}>
                                        {item.title}
                                    </Text>
                                ) : (
                                    <Link key={item.key} to={item.href}>
                                        <Text size={'sm'} c={theme.colors.gray[6]}>
                                            {item.title}
                                        </Text>
                                    </Link>
                                )
                            )}
                        </Breadcrumbs>

                        <Group pos={'right'}>
                            <UserMenu showHideSettingsModel={openSettings} />
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar className='px-0'>
                <Group className='flex !flex-col !items-start !justify-start !gap-2'>
                    <div className='header w-full relative h-24 flex items-center justify-center bg-cDefault/50'>
                        <Link to={'/app'} className='flex items-center py-2 px-6 text-sm gap-2 lg:gap-4 xl:gap-4 2xl:gap-4 !font-medium'>
                            <AspectRatio ratio={16 / 9} maw={'100px'} h={'80px'} mx='auto'>
                                <Image src={logo} alt='logo' className='!object-fill' width='100px' height={'80px'} styles={{ root: { height: '80px', width: '100px', objectFit: 'fill' } }} />
                            </AspectRatio>
                        </Link>
                        <Burger opened={opened} className='absolute top-4 right-4' onClick={toggle} hiddenFrom='sm' size='md' />
                    </div>
                    <motion.ul
                        className={styles.navbarContainer}
                        variants={{ visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.05 } }, hidden: { opacity: 0 } }}
                        initial="hidden"
                        animate="visible"
                    >
                        {menuItems.map((item, index) => (
                            <motion.li
                                key={item.key}
                                className={styles.navbarItemWrapper}
                                variants={{
                                    hidden: { x: -40, opacity: 0 },
                                    visible: { x: 0, opacity: 1, transition: { delay: index * 0.03 } },
                                }}
                            >
                                <UnstyledButton
                                    onClick={() => handleNavClick(item)}
                                    className={`${item.active ? styles.activeItem : styles.inactiveItem} ${styles.navbarItem}`}
                                >
                                    <Link to={`/app${item.route}`} className='flex items-center py-2 px-6 text-sm gap-2 lg:gap-4 xl:gap-4 2xl:gap-4 !font-medium'>
                                        <span>{createElement(item.icon, { size: 16 })}</span>
                                        <span>{t(item.key)}</span>
                                    </Link>
                                </UnstyledButton>
                            </motion.li>
                        ))}
                    </motion.ul>
                </Group>
            </AppShell.Navbar>

            <AppShell.Main>
                <div className='w-full h-full flex flex-col flex-1'>
                    <AnimatePresence mode={"wait"}>
                        <div style={{ overflow: "hidden", height: "100%", width: "100%" }}>
                            <motion.div
                                key={pathname}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className='w-full h-full'
                            >
                                <Outlet />
                            </motion.div>
                        </div>
                    </AnimatePresence>
                </div>
            </AppShell.Main>
        </AppShell>
    );
}
