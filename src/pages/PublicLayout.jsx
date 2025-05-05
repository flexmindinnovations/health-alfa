import { AppShell, AspectRatio, Burger, Button, Group, Image, UnstyledButton, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "@styles/layout.module.css";
import { createElement, useEffect, useState, useRef } from "react";
import { HeadsetIcon, HomeIcon, InfoIcon, LayoutDashboardIcon, LockIcon, } from "lucide-react";
import logo from '/images/logo.png';
import { useScroll, useSpring, motion } from 'framer-motion';

// Menu Links
const links = [
    { link: "/", label: "Home", icon: HomeIcon, key: "home" },
    { link: "/about-us", label: "About", icon: InfoIcon, key: "aboutUs" },
    { link: "/contact-us", label: "Contact", icon: HeadsetIcon, key: "contactUs" },
];

// Auth Items
const authItems = [
    {
        link: "/login",
        label: "Login",
        icon: LockIcon,
        key: "login",
    },
    {
        link: "/app",
        label: "Go To Dashboard",
        icon: LayoutDashboardIcon,
        key: "dashboard",
    },
];

export default function PublicLayout() {
    const [opened, { toggle }] = useDisclosure();
    const { t } = useTranslation();
    const [menuItems, setMenuItems] = useState([]);
    const [userMenuItems, setUserMenuItems] = useState(authItems);
    const { pathname } = useLocation();
    const { isAuthenticated } = useAuth();
    const theme = useMantineTheme();
    const mainRef = useRef(null);
    const { scrollY, scrollYProgress } = useScroll({ container: mainRef });
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const activePath = sessionStorage.getItem('currentItem') || pathname;
        const updatedMenuItems = links.map(item => ({
            ...item,
            active: `${item.link}` === activePath
        }));
        setMenuItems(updatedMenuItems);
        const updatedAuthItems = authItems.map((item) => ({
            ...item,
            active:
                (item.key === "login" && !isAuthenticated()) ||
                (item.key === "dashboard" && isAuthenticated()),
        }));
        setUserMenuItems(updatedAuthItems);
    }, [pathname, isAuthenticated]);

    const handleNavClick = (menuItem) => {
        const targetPath = menuItem.link;
        sessionStorage.setItem('currentItem', targetPath);
        const updatedMenuItems = menuItems.map((item) => ({
            ...item,
            active: item.key === menuItem.key,
        }));
        setMenuItems(updatedMenuItems);
        if (window.innerWidth < 768) toggle();
    };

    useEffect(() => {
        const updateScroll = () => {
            const y = scrollY.get();
            const currentViewPort = window.innerHeight - 105;
            setScrolled(y > currentViewPort);
        };
        updateScroll();
        const unsubscribe = scrollY.on("change", updateScroll);
        return () => unsubscribe();
    }, [scrollY]);

    return (
        <AppShell
            navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { desktop: true, mobile: !opened },
            }}
            padding={0}
        >
            <AppShell.Header
                component={motion.header}
                py={10}
                style={{
                    backgroundColor: scrolled ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.7)',
                    margin: scrolled ? "0px" : "20px",
                    borderRadius: scrolled ? "0px" : "999px",
                    transition: "margin 0.3s ease-in-out, background-color 0.3s ease-in-out, border-radius 0.3s ease-in-out",
                }}
                className={`transition-colors duration-300 backdrop-blur-sm ${scrolled ? '' : '!border-none rounded-full'}`}>
                <Group h="100%" px="md">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom="sm"
                        size="sm"
                    />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        {/* Top Navbar Items */}
                        <div className="flex md:hidden"></div>
                        <Group px={20}>
                            <AspectRatio ratio={900 / 720} mx='auto'>
                                <Image
                                    src={logo}
                                    alt='logo'
                                    className='!object-fill h-[40px]'
                                />
                            </AspectRatio>
                        </Group>
                        <Group ml="xl" gap={10} visibleFrom="sm">
                            {menuItems.map((item) => (
                                <UnstyledButton
                                    key={item.key}
                                    onClick={() => handleNavClick(item)}
                                    className={`${item.active ? styles.activeItem : styles.inactiveItem
                                        } ${styles.publicNavbarItem}`}
                                >
                                    <Link
                                        to={item.link}
                                        className="flex items-center py-2 px-4 text-sm gap-2 !font-medium"
                                    >
                                        <span>{createElement(item.icon, { size: 16 })}</span>
                                        <span>{t(item.key)}</span>
                                    </Link>
                                </UnstyledButton>
                            ))}
                        </Group>
                        {/* Auth Items */}
                        <Group>
                            {userMenuItems.map(
                                (item) =>
                                    item.active && (
                                        <Button
                                            variant="outline"
                                            p={0}
                                            color={theme.primaryColor}
                                            key={item.key}
                                            onClick={() => handleNavClick(item)}
                                            className="!rounded-full"
                                        >
                                            <Link
                                                to={item.link}
                                                className="flex items-center py-2 px-4 text-sm gap-2 !font-medium"
                                            >
                                                <span>{createElement(item.icon, { size: 16 })}</span>
                                                <span>{t(item.label)}</span>
                                            </Link>
                                        </Button>
                                    )
                            )}
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            {/* Sidebar Navigation */}
            <AppShell.Navbar py="md" px={4}>
                <Group className='flex !flex-col !items-start !justify-start !gap-2'>
                    {menuItems.map((item) => (
                        <UnstyledButton
                            key={item.key}
                            onClick={() => handleNavClick(item)}
                            className={`${item.active ? styles.activeItem : styles.inactiveItem
                                } ${styles.navbarItem}`}
                        >
                            <Link
                                to={item.link}
                                className={`flex items-center py-2 px-6 text-sm gap-2 lg:gap-4 xl:gap-4 2xl:gap-4 !font-medium`}
                            >
                                <span>{createElement(item.icon, { size: 16 })}</span>
                                <span>{t(item.key)}</span>
                            </Link>
                        </UnstyledButton>
                    ))}
                </Group>
            </AppShell.Navbar>

            {/* Main Content */}
            <AppShell.Main ref={mainRef} style={{ overflowY: "auto", height: "100vh" }}>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}