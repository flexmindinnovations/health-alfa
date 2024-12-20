import {createElement, useEffect, useState} from 'react';
import {Container, Tabs, useMantineTheme} from '@mantine/core';
import {ProfileComponent} from './Profile';
import {PreferenceComponent} from './Preference';
import {SlidersHorizontal, UserCog2Icon} from 'lucide-react';
import {useTranslation} from "react-i18next";

const SETTING_ITEMS = [
    {id: 1, key: "profile", title: "Profile", icon: UserCog2Icon, component: ProfileComponent, active: false},
    {
        id: 2,
        key: "preference",
        title: "Preference",
        icon: SlidersHorizontal,
        component: PreferenceComponent,
        active: false
    }
];


function Settings() {
    const {t} = useTranslation();
    const [settingOptions, setSettingOptions] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const theme = useMantineTheme();

    useEffect(() => {
        setSettingOptions(SETTING_ITEMS);
    }, []);

    return (
        <Container p={0} m={0}>
            <Tabs
                style={{height: '100%'}}
                value={activeTab}
                orientation={"horizontal"}
                onChange={setActiveTab}
            >
                <Tabs.List>
                    {settingOptions.map((item) => (
                        <Tabs.Tab
                            key={item.id}
                            leftSection={createElement(item.icon, {size: 16})}
                            value={item.key}
                            active={activeTab.key}
                            sx={{
                                backgroundColor: activeTab === item.key ? 'blue' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'lightblue',
                                },
                            }}
                        >
                            {t(item.key)}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
                {settingOptions.map((item) => (
                    <Tabs.Panel mih="25rem" className='py-5 px-0 md:!p-5 lg:!p-5 xl:!p-5' key={item.id}
                                value={item.key}>
                        <item.component/>
                    </Tabs.Panel>
                ))}
            </Tabs>
        </Container>
    );
}

export default Settings;