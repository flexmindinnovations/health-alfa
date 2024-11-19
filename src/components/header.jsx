import { AppShell, Burger, Group, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

const links = [
    { link: '/', label: 'Home', key: 'Home' },
    { link: '/about-us', label: 'About', key: 'About' },
    { link: '/contact-us', label: 'Contact', key: "Contact" },
    { link: '/login', label: 'Login', key: 'login' },
];

export default function Header() {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        <div></div>
                        <Group
                            ml="xl"
                            gap={20}
                            visibleFrom="sm"
                            sx={{
                                '.control': {
                                    display: 'block',
                                    padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-md)',
                                    borderRadius: 'var(--mantine-radius-md)',
                                    fontWeight: 500,
                                    '&:hover': {
                                        backgroundColor: 'var(--mantine-color-dark-6)', // Adjust colors as needed
                                    },
                                },
                            }}
                        >
                            {links.map((link) => (
                                <Link to={link.link} key={link.key} className="control">
                                    {link.label}
                                </Link>
                            ))}
                        </Group>

                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar py="md" px={4}>
                {links.map((link) => (
                    <Link to={link.link} key={link.key} className="control">
                        {link.label}
                    </Link>
                ))}
            </AppShell.Navbar>
        </AppShell>
    )
}
