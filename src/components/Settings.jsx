import ModalWrapper from '@components/Modal';
import { useState, useEffect, createElement } from 'react';
import { Tabs, Container, useMantineTheme } from '@mantine/core';
import { ProfileComponent } from './Profile';
import { PreferenceComponent } from './Preference';
import { IconUserCog, IconAdjustmentsHorizontal } from '@tabler/icons-react';

const SETTING_ITEMS = [
    { id: 1, key: "profile", title: "Profile", icon: IconUserCog, component: ProfileComponent, active: false },
    { id: 2, key: "preference", title: "Preference", icon: IconAdjustmentsHorizontal, component: PreferenceComponent, active: false }
];


function Settings({ isOpen, toggle }) {
    const [settingOptions, setSettingOptions] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const theme = useMantineTheme();

    useEffect(() => {
        setSettingOptions(SETTING_ITEMS);
    }, []);

    return (
        <ModalWrapper title="Settings" isOpen={isOpen} toggle={toggle}>
            <Container p={0} mih="20rem" m={0}>
                <Tabs
                    style={{ height: '100%' }}
                    value={activeTab}
                    orientation={"horizontal"}
                    onChange={setActiveTab}
                >
                    <Tabs.List>
                        {settingOptions.map((item) => (
                            <Tabs.Tab
                                key={item.id}
                                leftSection={createElement(item.icon, { size: 16 })}
                                value={item.key}
                                active={activeTab.key}
                                sx={{
                                    backgroundColor: activeTab === item.key ? 'blue' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'lightblue',
                                    },
                                }}
                            >
                                {item.title}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                    {settingOptions.map((item) => (
                        <Tabs.Panel mih="25rem" p={10} key={item.id} value={item.key}>
                            <item.component />
                        </Tabs.Panel>
                    ))}
                </Tabs>
            </Container>
        </ModalWrapper>
    );
}

export default Settings;