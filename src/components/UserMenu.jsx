import { forwardRef, useState } from 'react';
import { Avatar, Menu, Popover, Group, Select, UnstyledButton } from "@mantine/core";
import { IconSettings, IconChevronRight, IconLogout, IconLanguage } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

const UserButton = forwardRef(({ image, name, email, ...others }, ref) => (
    <UnstyledButton
        ref={ref}
        style={{
            color: 'var(--mantine-color-text)',
            borderRadius: 'var(--mantine-radius-sm)',
        }}
        {...others}
    >
        <Group>
            <Avatar src={image} radius="xl" />
        </Group>
    </UnstyledButton>
));

export function UserMenu({ showHideSettingsModel }) {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div>
            {/* <Dropdown as="button" placement="bottom-end">
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
                                            <h2>
                                                User
                                            </h2>
                                            <p className="font-semibold">zoey@example.com</p>
                                        </DropdownItem>
                                        <DropdownItem key="settings" onClick={showHideSettingsModel}>
                                            Settings
                                        </DropdownItem>
                                        <DropdownItem as={"a"} key="language" className="pointer-events-none">
                                            <div className="w-full !flex !items-center !justify-between gap-2 z-10 pointer-events-auto">
                                                <p>
                                                    Language
                                                </p>
                                                <ThemeSwitcher />
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem key="logout" color="danger" textValue={"Log Out"}>
                                            Log Out
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown> */}
            <Menu shadow="md" radius="md" withArrow>
                <Menu.Target>
                    <UserButton
                        image="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
                        name="Harriette Spoonlicker"
                        email="hspoonlicker@outlook.com"
                    />
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item className='pointer-events-none'>
                        <div className='flex flex-col items-start justify-start'>
                            <p className='opacity-50 text-sm'>Signed in as</p>
                            <h2 className="font-semibold">
                                User
                            </h2>
                            <p className='font-light text-xs'>zoey@example.com</p>
                        </div>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item leftSection={<IconSettings size={14} />} onClick={showHideSettingsModel(true)}>
                        Settings
                    </Menu.Item>
                    {/* <Menu.Item icon={<IconLanguage size={14} />}>
                    <Menu trigger='click-hover' shadow="md" radius="md" position='left-start' withArrow>
                        <Menu.Target>
                            <Menu.Item p={0} w="100%">
                                Language
                            </Menu.Item>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item onClick={() => changeLanguage('en')}>
                                English
                            </Menu.Item>
                            <Menu.Item onClick={() => changeLanguage('ar')}>
                                Arabic
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Menu.Item> */}

                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconLogout size={14} />}>
                        Log Out
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu >
        </div>
    );
}
