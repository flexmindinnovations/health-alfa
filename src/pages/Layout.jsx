import {Link, Outlet, useLocation} from 'react-router-dom'
import {AppShell, AspectRatio, Burger, Group, Image, UnstyledButton} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import styles from '@styles/layout.module.css'
import {createElement, useEffect, useState} from 'react'
import {MENU_ITEMS} from '../config/menu-items.js'
import Settings from '@components/Settings.jsx'
import {useTranslation} from 'react-i18next'
import {UserMenu} from '@components/UserMenu.jsx'
import logo from '/images/logo.png'
import {AnimatePresence, motion} from 'framer-motion';

export function Layout() {
    const {t} = useTranslation()
    const [menuItems, setMenuItems] = useState([])
    const [publicItems, setPublicItems] = useState([])
    const [opened, {toggle}] = useDisclosure()
    const {pathname} = useLocation()
    const [showSettingsModel, setShowSettingsModel] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const updatedMenuItems = MENU_ITEMS.map(item => ({
            ...item,
            active: `/app${item.route}` === pathname
        }))
        const publicItems = updatedMenuItems.slice(
            MENU_ITEMS.length - 2,
            MENU_ITEMS.length
        )
        setPublicItems(publicItems)
        setMenuItems(updatedMenuItems)
    }, [pathname])

    const handleNavClick = menuItem => {
        const publicLinkItemIndex = publicItems.findIndex(
            item => item.id === menuItem.id
        )
        const isPublicLink = publicLinkItemIndex !== -1
        const updateMenuItems = menuItems.map(item => ({
            ...item,
            active: item.id === menuItem.id
        }))
        setMenuItems(updateMenuItems)
        if (!isPublicLink) toggle()
    }

    const showHideSettingsModel = () => {
        setShowSettingsModel(prev => !prev)
    }

    return (
        <>
            {showSettingsModel && (
                <Settings
                    isOpen={showSettingsModel}
                    toggle={() => showHideSettingsModel()}
                />
            )}
            <AppShell
                header={{height: 60}}
                footer={{height: 60}}
                navbar={{
                    width: 250,
                    breakpoint: 'sm',
                    collapsed: {mobile: !opened}
                }}
                styles={{main: {height: '100vh', display: 'flex', flexDirection: 'column'}}}
                padding='md'
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
                        <Group justify='space-between' style={{flex: 1}}>
                            <div></div>
                            <Group pos={'right'}>
                                <UserMenu showHideSettingsModel={() => showHideSettingsModel()}/>
                            </Group>
                        </Group>
                    </Group>
                </AppShell.Header>

                <AppShell.Navbar className='px-0'>
                    <Group className='flex !flex-col !items-start !justify-start !gap-2'>
                        <div
                            className='header w-full relative h-24 flex items-center justify-center bg-cDefault/50'>
                            <AspectRatio ratio={16 / 9} maw={100} mx='auto'>
                                <Image
                                    src={logo}
                                    alt='logo'
                                    className='!object-fill'
                                    width='100%'
                                />
                            </AspectRatio>
                            <Burger
                                opened={opened}
                                className='absolute top-4 right-4'
                                onClick={toggle}
                                hiddenFrom='sm'
                                size='md'
                            />
                        </div>
                        <motion.ul
                            className={styles.navbarContainer}
                            variants={{
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        when: "beforeChildren",
                                        staggerChildren: 0.4,
                                    },
                                },
                                hidden: {opacity: 0},
                            }}
                            initial="hidden"
                            animate="visible"
                        >
                            {menuItems.slice(0, menuItems.length - 2).map((item, index) => (
                                <motion.li
                                    key={item.key}
                                    className={styles.navbarItemWrapper}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    // onMouseLeave={() => setHoveredIndex(null)}
                                    variants={{
                                        hidden: {
                                            x: -40,
                                            opacity: 0,
                                        },
                                        visible: {
                                            x: 0,
                                            opacity: 1,
                                            transition: {
                                                delay: index * 0.03,
                                            },
                                        },
                                    }}
                                >
                                    <UnstyledButton
                                        key={item.key}
                                        onClick={() => handleNavClick(item)}
                                        className={`${
                                            item.active ? styles.activeItem : styles.inactiveItem
                                        } ${styles.navbarItem}`}
                                    >
                                        <Link
                                            to={`/app${item.route}`}
                                            className={`flex items-center py-2 px-6 text-sm gap-2 lg:gap-4 xl:gap-4 2xl:gap-4 !font-medium`}
                                        >
                                            <span>{createElement(item.icon, {size: 16})}</span>
                                            <span>{t(item.key)}</span>
                                        </Link>
                                    </UnstyledButton>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </Group>
                </AppShell.Navbar>

                <AppShell.Main>
                    <div className={`w-full h-full flex flex-col flex-1`}>
                        <AnimatePresence mode={"wait"}>
                            <div style={{overflow: "hidden", height: "100%", width: "100%"}}>
                                <motion.div
                                    key={pathname}
                                    initial={{x: -10, opacity: 0}}
                                    animate={{x: 0, opacity: 1}}
                                    exit={{opacity: 0}}
                                    transition={{duration: 0.2, ease: "easeOut"}}
                                    className='w-full h-full'>
                                    <Outlet/>
                                </motion.div>
                            </div>
                        </AnimatePresence>
                    </div>
                </AppShell.Main>
            </AppShell>
        </>
    )
}
