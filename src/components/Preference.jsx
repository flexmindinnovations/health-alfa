import {Container, Grid, Loader, SegmentedControl, Text, useDirection, useMantineColorScheme} from '@mantine/core'
import {useTranslation} from 'react-i18next'
import {createElement, useEffect, useState} from 'react'
import {MonitorDot, MoonIcon, Sun} from 'lucide-react'
import {ComboBoxComponent} from '@components/ComboBox'

const providedLanguages = [{id: 1, label: 'English', value: 'en'}, {id: 2, label: 'Arabic', value: 'ar'}]

const themeData = [{value: 'auto', label: 'Auto', icon: MonitorDot}, {
    value: 'light', label: 'Light', icon: Sun,
}, {value: 'dark', label: 'Dark', icon: MoonIcon}]

const rtlLanguages = ['ar']

export function PreferenceComponent() {
    const [preference, setPreference] = useState(localStorage.getItem('lng'))
    const [languages] = useState(providedLanguages)
    const [theme, setTheme] = useState('auto')
    const {setDirection} = useDirection()
    const {i18n, t} = useTranslation()
    const [themeList, setThemeList] = useState(themeData)
    const {setColorScheme} = useMantineColorScheme({
        keepTransitions: true
    })
    const [refreshCount, setRefreshCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const lng = localStorage.getItem('lng') || 'en'
        setThemeList(themeData)
        const _theme = localStorage.getItem('mantine-color-scheme-value') || 'auto'
        setPreference(lng)
        i18n.changeLanguage(lng).then(r => r);
        setTheme(_theme)

        setLoading(false)
    }, [i18n.language])

    const changeLanguage = lng => {
        i18n.changeLanguage(lng)
        const direction = rtlLanguages.includes(lng) ? 'rtl' : 'ltr'
        setDirection(direction)
        localStorage.setItem('dir', direction)
        localStorage.setItem('lng', lng)
        setRefreshCount(prevState => prevState + 1)
    }

    const handleLanguageChange = item => {
        const {value} = item
        changeLanguage(value)
    }

    const handleColorSchemeChange = option => {
        const _theme = option ? option : localStorage.getItem('mantine-color-scheme-value') || 'auto'
        if (_theme && _theme !== theme) {
            setTheme(_theme)
            setColorScheme(_theme)
            localStorage.setItem('mantine-color-scheme-value', _theme)
        }
    }

    if (loading) {
        return (<Container
            m={0}
            p={0}
            px={10}
            style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
            }}
        >
            {' '}
            <Loader/>{' '}
        </Container>)
    }

    return (<Container m={0} p={0} className='px-0 md:px-4 lg:px-4 xl:px-4 2xl:px-4'>
        <Grid align='center' m={0} p={0}>
            <Grid.Col span={{base: 4, sm: 4, md: 6, lg: 6, xl: 6}}>
                <Text size='sm'>{t('theme')}</Text>
            </Grid.Col>
            <Grid.Col span={{base: 8, sm: 8, md: 6, lg: 6, xl: 6}}>
                <SegmentedControl
                    data={themeList.map(item => ({
                        value: item.value, label: (<div
                            className='flex items-center justify-center gap-2 text-xs md:text-sm lg:text-sm xl:text-sm'>
                            {createElement(item.icon, {size: 16})}
                            {t(item.value)}
                        </div>)
                    }))}
                    radius={'xl'}
                    withItemsBorders
                    onChange={handleColorSchemeChange}
                    value={theme}
                    fullWidth
                    key={refreshCount}
                    transitionDuration={300}
                    transitionTimingFunction='linear'
                />
            </Grid.Col>

            <Grid.Col span={{base: 4, sm: 4, md: 6, lg: 6, xl: 6}}>
                <Text size='sm'>{t("language")}</Text>
            </Grid.Col>
            <Grid.Col span={{base: 8, sm: 8, md: 6, lg: 6, xl: 6}}>
                <ComboBoxComponent
                    loading={loading}
                    onValueChange={data => handleLanguageChange(data)}
                    label={''}
                    dataSource={languages}
                    defaultValue={preference}
                />
            </Grid.Col>
        </Grid>
    </Container>)
}
