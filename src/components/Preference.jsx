import {Container, Grid, Group, Loader, Select, Text, useDirection, useMantineColorScheme} from '@mantine/core'
import {useTranslation} from 'react-i18next'
import {forwardRef, useEffect, useState} from 'react'
import {MonitorDot, MoonIcon, Sun} from 'lucide-react'

const providedLanguages = [{id: 1, label: 'English', value: 'en'}, {id: 2, label: 'Arabic', value: 'ar'}]

const themeData = [{value: 'auto', label: 'Auto', icon: MonitorDot}, {
    value: 'light',
    label: 'Light',
    icon: Sun
}, {value: 'dark', label: 'Dark', icon: MoonIcon}]

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef(({label, icon, ...others}, ref) => (<div ref={ref} {...others}>
    {' '}
    <Group noWrap>
        {' '}
        {icon} <Text>{label}</Text>{' '}
    </Group>{' '}
</div>))

const rtlLanguages = ['ar']

export function PreferenceComponent() {
    const [preference, setPreference] = useState(localStorage.getItem('lng'))
    const [languages] = useState(providedLanguages)
    const [theme, setTheme] = useState('auto')
    const {setDirection} = useDirection()
    const {i18n} = useTranslation()
    const [themeList, setThemeList] = useState([])
    const {setColorScheme} = useMantineColorScheme({
        keepTransitions: true
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const lng = localStorage.getItem('lng') || 'en'
        setThemeList(themeData)
        const _theme = localStorage.getItem('mantine-color-scheme-value') || 'auto'
        setPreference(lng)
        setTheme(_theme)

        setLoading(false)
    }, [])

    const changeLanguage = lng => {
        i18n.changeLanguage(lng)
        const direction = rtlLanguages.includes(lng) ? 'rtl' : 'ltr'
        setDirection(direction)
        localStorage.setItem('dir', direction)
        localStorage.setItem('lng', lng)
    }

    const handleLanguageChange = option => {
        changeLanguage(option.value)
    }

    const handleColorSchemeChange = option => {
        const _theme = option ? option : localStorage.getItem('mantine-color-scheme-value') || 'auto';
        if (_theme && _theme !== theme) {
            setTheme(_theme);
            setColorScheme(_theme);
            localStorage.setItem('mantine-color-scheme-value', _theme);
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

    return (<Container m={0} p={0} px={10}>
        <Grid align='center' m={0} p={0}>
            <Grid.Col span={{base: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                <Text size='sm'>Theme</Text>
            </Grid.Col>
            <Grid.Col span={{base: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                <Select
                    data={themeList.map(item => ({...item, component: SelectItem}))}
                    onChange={handleColorSchemeChange}
                    defaultValue={theme}
                    allowDeselect={false}
                    checkIconPosition="right"
                    styles={{
                        item: {
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }
                    }}
                />
            </Grid.Col>

            <Grid.Col span={{base: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                <Text size='sm'>Language</Text>
            </Grid.Col>
            <Grid.Col span={{base: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                <Select
                    size='sm'
                    placeholder='Select System Language'
                    data={languages}
                    defaultValue={preference}
                    checkIconPosition="right"
                    allowDeselect={false}
                    onChange={(_value, option) => handleLanguageChange(option)}
                />
            </Grid.Col>
        </Grid>
    </Container>)
}
