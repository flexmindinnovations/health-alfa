import {createElement, useEffect, useState} from 'react';
import {Button, Container, Group, Loader, Stack, Tabs} from '@mantine/core';
import {ProfileComponent} from './Profile';
import {PreferenceComponent} from './Preference';
import {EyeIcon, SlidersHorizontal, SquarePen, UserCog2Icon} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {useEncrypt} from "@hooks/EncryptData.jsx";

const SETTING_ITEMS = [
    {id: 1, key: 'profile', title: 'Profile', icon: UserCog2Icon, component: ProfileComponent},
    {id: 2, key: 'preference', title: 'Preference', icon: SlidersHorizontal, component: PreferenceComponent},
];

export const Settings = () => {
    const {t} = useTranslation();
    const [settingItems, setSettingItems] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isViewMode, setIsViewMode] = useState(false);
    const {getEncryptedData} = useEncrypt();

    useEffect(() => {
        const userType = getEncryptedData('roles')?.toLowerCase();
        const newSettings = userType === 'admin'
            ? SETTING_ITEMS.filter((item) => item.id !== 1)
            : SETTING_ITEMS;
        setActiveTab(() => newSettings[0].key);
        setSettingItems(newSettings);
    }, [])

    return (
        <Container style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            {
                settingItems.length ?
                    <Tabs
                        value={activeTab}
                        onChange={setActiveTab}
                    >
                        <Tabs.List justify={'center'}>
                            {settingItems.map((item) => (
                                <Tabs.Tab
                                    key={item.id}
                                    value={item.key}
                                    leftSection={createElement(item.icon, {size: 16})}
                                >
                                    {t(item.key)}
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>

                        {settingItems.map((item) => (
                            <Tabs.Panel key={item.id} value={item.key} py={20} px={0}
                                        style={{flexGrow: 1, display: 'flex', height: '100%', flexDirection: 'column'}}>
                                <Stack style={{height: '100%', flexGrow: 1}} gap={0}>
                                    {activeTab === 'profile' && (
                                        <Group justify="end" style={{padding: '5px 20px'}}>
                                            <Button
                                                leftSection={isViewMode ? <EyeIcon size={14}/> : <SquarePen size={14}/>}
                                                onClick={() => setIsViewMode((prev) => !prev)}
                                                size="compact-sm"
                                                style={{
                                                    fontSize: '12px',
                                                    fontWeight: 'normal',
                                                }}
                                            >
                                                {isViewMode ? t('viewDetails') : t('updateDetails')}
                                            </Button>
                                        </Group>
                                    )}
                                    <item.component data={{showEditForm: isViewMode}}/>
                                </Stack>
                            </Tabs.Panel>
                        ))}
                    </Tabs>
                    :
                    <Loader/>
            }
        </Container>
    );
};
