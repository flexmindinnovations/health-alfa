import {
  AppShell,
  Burger,
  Button,
  Group,
  UnstyledButton,
  useMantineTheme,
  AspectRatio,
  Image
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "@contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "@styles/layout.module.css";
import { createElement, useEffect, useState } from "react";
import {
  HeadsetIcon,
  HomeIcon,
  InfoIcon,
  LayoutDashboardIcon,
  LockIcon,
} from "lucide-react";
import logo from '/images/logo.png'

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

  // Update menu items based on the current path
  useEffect(() => {
    const updatedMenuItems = links.map((item) => ({
      ...item,
      active: item.link === pathname,
    }));
    setMenuItems(updatedMenuItems);

    // Update auth items based on authentication status
    const updatedAuthItems = authItems.map((item) => ({
      ...item,
      active:
        (item.key === "login" && !isAuthenticated()) ||
        (item.key === "dashboard" && isAuthenticated()),
    }));
    setUserMenuItems(updatedAuthItems);
  }, [pathname, isAuthenticated]);

  // Handle navigation and sidebar collapse
  const handleNavClick = (menuItem) => {
    const updatedMenuItems = menuItems.map((item) => ({
      ...item,
      active: item.key === menuItem.key,
    }));
    setMenuItems(updatedMenuItems);

    // Collapse sidebar on mobile
    if (window.innerWidth < 768) toggle();
  };

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding={0}
    >
      {/* Header */}
      <AppShell.Header>
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
            <Group>
            <AspectRatio ratio={1600 / 900} mx='auto'>
            <Image
              src={logo}
              alt='logo'
              className='!object-fill h-10 w-6'
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
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
