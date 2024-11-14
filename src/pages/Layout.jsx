import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context.jsx";
import { AppShell, Burger, Grid, Group, UnstyledButton, ActionIcon, Image,AspectRatio } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from '@mantinex/mantine-logo';
import styles from "@styles/layout.module.css";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, } from "@nextui-org/react"
import { createElement, useEffect, useState } from "react";
import { MENU_ITEMS } from "../config/menu-items.js";
import { Sidebar } from "@components/sidebar.jsx";
import Settings from "@components/Settings.jsx";
import { X } from "lucide-react";
import { useDocumentTitle } from "@hooks/DocumentTitle";
import { useTranslation } from "react-i18next";
import logo from "/images/logo.png";

export function Layout() {
    const { t } = useTranslation();
    const [menuItems, setMenuItems] = useState([]);
    const [publicItems, setPublicItems] = useState([]);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [opened, { toggle }] = useDisclosure();
    const { pathname } = useLocation();
    const [showSettingsModel, setShowSettingsModel] = useState(false);

    useEffect(() => {
        const updatedMenuItems = MENU_ITEMS.map(item => ({
            ...item,
            active: `/app${item.route}` === pathname,
        }));
        const publicItems = updatedMenuItems.slice(MENU_ITEMS.length - 2, MENU_ITEMS.length);
        setPublicItems(publicItems)
        setMenuItems(updatedMenuItems);
    }, [pathname]);

    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         navigate("/login");
    //     }
    // }, [isAuthenticated]);

    const handleNavClick = (menuItem) => {
        const publicLinkItemIndex = publicItems.findIndex((item) => item.id === menuItem.id);
        const isPublicLink = publicLinkItemIndex !== -1;
        const updateMenuItems = menuItems.map(item => ({
            ...item,
            active: item.id === menuItem.id,
        }));
        setMenuItems(updateMenuItems);
        if (!isPublicLink) toggle();
    }

    const showHideSettingsModel = () => {
        setShowSettingsModel(prev => !prev);
    }

    return (
        <>
            {showSettingsModel &&
                <Settings isOpen={showSettingsModel} toggle={() => showHideSettingsModel()} />
            }
            <AppShell
                header={{ height: 60 }}
                footer={{ height: 60 }}
                navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
                padding="md"
                layout="alt"
                pl={0}
            >
                <AppShell.Header>
                    <Group h="100%" px="20">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" />
                        <Group justify="space-between" style={{ flex: 1 }}>
                            {/* <MantineLogo src={logo} size={30} /> */}
                            <div></div>
                            <Group>
                                <Dropdown as="button" placement="bottom-end">
                                    <DropdownTrigger>
                                        <Avatar
                                            isBordered
                                            size={"sm"}
                                            as="button"
                                            className="ml-8 transition-transform"
                                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                        />
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                                        <DropdownItem key="profile" className=" pointer-events-none h-14 gap-2"
                                            textValue={"info"}>
                                            <p className="font-semibold">Signed in as</p>
                                            <p className="font-semibold">zoey@example.com</p>
                                        </DropdownItem>
                                        <DropdownItem key="settings" onClick={showHideSettingsModel}>
                                            Settings
                                        </DropdownItem>
                                        <DropdownItem key="logout" color="danger" textValue={"Log Out"}>
                                            Log Out
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Group>
                        </Group>
                    </Group>
                </AppShell.Header>

                <AppShell.Navbar className="px-0" >
                    <Group className="flex !flex-col !items-start !justify-start !gap-2">
                        <div className="header w-full relative h-24 flex items-center justify-center bg-cDefault/50">
                            <AspectRatio ratio={900 / 720} maw={100} mx="auto" >
                                <Image
                                    src={logo}
                                    alt="logo"
                                    width="100%"
                                />
                            </AspectRatio>
                            <Burger opened={opened} className="absolute top-4 right-4" onClick={toggle} hiddenFrom="sm" size="md" />
                        </div>
                        {
                            menuItems.slice(0, menuItems.length - 2).map(item => (
                                <UnstyledButton
                                    key={item.key}
                                    onClick={() => handleNavClick(item)}
                                    className={`${item.active ? styles.activeItem : styles.inactiveItem}
                             max-w-[60%] md:max-w-[90%] lg:max-w-[85%] xl:max-w-[85%] 2xl:max-w-[85%] mr-auto rounded-r-full w-full m-0`}
                                >
                                    <Link to={`/app${item.route}`}
                                        className={`flex items-center py-2 px-6 text-sm gap-2 lg:gap-4 xl:gap-4 2xl:gap-4 !font-medium ${item.active ? 'text-white' : 'text-cTextPrimary'}`}>
                                        <span>
                                            {createElement(item.icon, { size: 16 })}
                                        </span>
                                        <span>{t(item.key)}</span>
                                    </Link>
                                </UnstyledButton>
                            ))
                        }
                    </Group>
                </AppShell.Navbar>

                <AppShell.Main>
                    <Outlet/>
                </AppShell.Main>
                <AppShell.Footer p="md">
                    <div className="container w-full h-full flex items-center justify-end">
                        <Group className="flex !items-start !justify-start !gap-2">
                            {
                                menuItems.slice(
                                    menuItems.length - 2, menuItems.length)
                                    .map(item => (
                                        <UnstyledButton
                                            key={item.key}
                                            onClick={() => handleNavClick(item)}
                                            className={`${item.active ? '!bg-cPrimaryFilled text-white active:text-white focus:text-white' : 'hover:bg-cDefault hover:text-cTextPrimary'} rounded-full`}
                                        >
                                            <Link to={`/app${item.route}`}
                                                className={`flex items-center py-1.5 px-4 text-sm gap-1 !font-medium ${item.active ? 'text-white' : 'text-cTextPrimary'}`}>
                                                <span>
                                                    {createElement(item.icon, { size: 16 })}
                                                </span>
                                                <span>{t(item.key)}</span>
                                            </Link>
                                        </UnstyledButton>
                                    ))
                            }
                        </Group>
                    </div>
                </AppShell.Footer>
            </AppShell>
        </>
    )
}