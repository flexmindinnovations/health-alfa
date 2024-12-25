import {createElement, useState} from 'react';
import {Button, Container, Group, Stack, Tabs} from '@mantine/core';
import {ProfileComponent} from './Profile';
import {PreferenceComponent} from './Preference';
import {EyeIcon, SlidersHorizontal, SquarePen, UserCog2Icon} from 'lucide-react';
import {useTranslation} from 'react-i18next';

const SETTING_ITEMS = [
    {id: 1, key: 'profile', title: 'Profile', icon: UserCog2Icon, component: ProfileComponent},
    {id: 2, key: 'preference', title: 'Preference', icon: SlidersHorizontal, component: PreferenceComponent},
];

export const Settings = () => {
    const {t} = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');
    const [isViewMode, setIsViewMode] = useState(false);

    return (
        <Container style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
            >
                <Tabs.List justify={'center'}>
                    {SETTING_ITEMS.map((item) => (
                        <Tabs.Tab
                            key={item.id}
                            value={item.key}
                            leftSection={createElement(item.icon, {size: 16})}
                        >
                            {t(item.key)}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                {SETTING_ITEMS.map((item) => (
                    <Tabs.Panel key={item.id} value={item.key} p={20}
                                style={{flexGrow: 1, display: 'flex', height: '100%', flexDirection: 'column'}}>
                        <Stack style={{height: '100%', flexGrow: 1}} gap={0}>
                            {activeTab === 'profile' && (
                                <Group justify="end" style={{padding: '10px'}}>
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
        </Container>
    );
};
