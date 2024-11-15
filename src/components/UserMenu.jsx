import { forwardRef, useState } from 'react'
import {
  Avatar,
  Menu,
  Popover,
  Group,
  Select,
  UnstyledButton
} from '@mantine/core'
import {
  IconSettings,
  IconChevronRight,
  IconLogout,
  IconLanguage
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

const UserButton = forwardRef(({ image, name, email, ...others }, ref) => (
  <UnstyledButton
    ref={ref}
    style={{
      color: 'var(--mantine-color-text)',
      borderRadius: 'var(--mantine-radius-sm)'
    }}
    {...others}
  >
    <Group>
      <Avatar src={image} radius='xl' />
    </Group>
  </UnstyledButton>
))

export function UserMenu ({ showHideSettingsModel }) {
  const { i18n } = useTranslation()

  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
  }

  return (
    <div>
      <Menu shadow='md' width={250} radius='md' withArrow>
        <Menu.Target>
          <UserButton
            image='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png'
            name='Harriette Spoonlicker'
            email='hspoonlicker@outlook.com'
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item className='pointer-events-none'>
            <div className='flex flex-col items-start justify-start'>
              <p className='opacity-50 text-sm'>Signed in as</p>
              <h2 className='font-semibold'>User</h2>
              <p className='font-light text-xs'>zoey@example.com</p>
            </div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            leftSection={<IconSettings size={14} />}
            onClick={showHideSettingsModel(true)}
          >
            Settings
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item color='red' leftSection={<IconLogout size={14} />}>
            Log Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  )
}
