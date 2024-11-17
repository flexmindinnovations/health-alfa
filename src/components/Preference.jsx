import {
  Container,
  Grid,
  Text,
  Select,
  useDirection,
  useMantineColorScheme,
  Loader
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, forwardRef, createElement } from 'react'
import { IconDeviceDesktop, IconSun, IconMoon } from '@tabler/icons-react'

const providedLanguages = [
  { id: 1, label: 'English', value: 'en' },
  { id: 2, label: 'Arabic', value: 'ar' }
]

const themeData = [
  { value: 'auto', label: 'Auto', icon: IconDeviceDesktop },
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon }
]

const SelectItem = forwardRef(({ label, icon, ...others }, ref) => (
  <div ref={ref} {...others}>
    {' '}
    <Group noWrap>
      {' '}
      {icon} <Text>{label}</Text>{' '}
    </Group>{' '}
  </div>
))

const rtlLanguages = ['ar']

export function PreferenceComponent () {
  const [preference, setPreference] = useState(localStorage.getItem('lng'))
  const [languages, setLanguages] = useState(providedLanguages)
  const [theme, setTheme] = useState('auto')
  const { dir, setDirection } = useDirection()
  const { i18n } = useTranslation()
  const [themeList, setThemeList] = useState()
  const { setColorScheme } = useMantineColorScheme({
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
    setColorScheme(option)
  }

  if (loading) {
    return (
      <Container
        m={0}
        p={0}
        px={10}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        {' '}
        <Loader />{' '}
      </Container>
    )
  }

  return (
    <Container m={0} p={0} px={10}>
      <Grid align='center' m={0} p={0}>
        <Grid.Col span={{ base: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <Text size='sm'>Theme</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <Select
            data={themeList.map(item => ({ ...item, component: SelectItem }))}
            onChange={handleColorSchemeChange}
            defaultValue={theme}
            styles={{ item: { display: 'flex', alignItems: 'center' } }}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <Text size='sm'>Language</Text>
        </Grid.Col>
        <Grid.Col span={{ base: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
          <Select
            size='sm'
            placeholder='Select System Language'
            data={languages}
            defaultValue={preference}
            allowDeselect={false}
            onChange={(_value, option) => handleLanguageChange(option)}
          />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
