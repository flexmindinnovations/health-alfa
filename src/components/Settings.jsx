import ModalWrapper from '@components/Modal';
import { useState, useEffect, createElement } from 'react';
import { Tabs, Container } from '@mantine/core';
import { ProfileComponent } from './Profile';
import { PreferenceComponent } from './Preference';
import { IconUserCog, IconSettings } from '@tabler/icons-react';

const SETTING_ITEMS = [
    { id: 1, key: "profile", title: "Profile", icon: IconUserCog, component: ProfileComponent, active: false },
    { id: 2, key: "preference", title: "Preference", icon: IconSettings, component: PreferenceComponent, active: false }
];


function Settings({ isOpen, toggle }) {
    const [settingOptions, setSettingOptions] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        setSettingOptions(SETTING_ITEMS);
    }, []);

    return (
        <ModalWrapper title="Settings" isOpen={isOpen} toggle={toggle}>
            <Container p={0} mih="20rem" m={0}>
                <Tabs
                    style={{ height: '100%' }}
                    value={activeTab}
                    orientation="vertical"
                    onChange={setActiveTab}
                >
                    <Tabs.List>
                        {settingOptions.map((item) => (
                            <Tabs.Tab
                                key={item.id}
                                leftSection={createElement(item.icon, { size: 16 })}
                                value={item.key}>
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