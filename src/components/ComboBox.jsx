import {CheckIcon, Combobox, Group, Input, InputBase, Loader, useCombobox} from '@mantine/core'
import cx from 'clsx'
import {useTranslation} from 'react-i18next'
import {createElement, useEffect, useState} from 'react'
import classes from '@styles/ComboBox.module.css'

export function ComboBoxComponent({
                                      loading,
                                      label,
                                      dataSource = [],
                                      defaultValue,
                                      onValueChange,
                                      props
                                  }) {
    const {t} = useTranslation()
    const [animating, setAnimating] = useState(false)
    const combobox = useCombobox({
        onDropdownClose: () => {
            setAnimating(false)
            combobox.resetSelectedOption()
            combobox.focusTarget()
            setSearch('')
        },
        onDropdownOpen: () => {
            setAnimating(true)
            combobox.focusSearchInput()
        }
    })

    const [value, setValue] = useState(defaultValue)
    const [selectedItem, setSelectedItem] = useState()
    const [search, setSearch] = useState('')

    useEffect(() => {
        const _selectedItem = getSelectedItem(defaultValue)
        if (_selectedItem) setSelectedItem(_selectedItem)
    }, [])

    const shouldFilterOptions = !dataSource.some(
        item => item.label === (search || defaultValue)
    )
    const filteredOptions = shouldFilterOptions
        ? dataSource?.filter(item => {
            return item.value.toLowerCase().includes(search.toLowerCase().trim())
        })
        : dataSource

    const options = filteredOptions.map((item, index) => (
        <Combobox.Option
            value={item.value}
            key={item.value}
            className={cx({[classes.animateOption]: animating})}
            style={{animationDelay: `${index * 50}ms`}}
        >
            <Group flex justify='space-between'>
                {item.icon && createElement(item.icon, {size: 14})}
                <span> {item.label}</span>
                {item.value === value && <CheckIcon opacity={'0.4'} size={12}/>}
            </Group>
        </Combobox.Option>
    ))

    const getSelectedItem = val => dataSource.find(_item => _item.value === val)

    return (
        <Combobox
            {...props}
            store={combobox}
            withinPortal={false}
            onOptionSubmit={val => {
                const _selectedItem = getSelectedItem(val)
                if (_selectedItem) setSelectedItem(_selectedItem)
                onValueChange(_selectedItem)
                setValue(val)
                setSearch('')
                combobox.closeDropdown()
            }}
        >
            <Combobox.Target>
                <InputBase
                    component='button'
                    type='button'
                    pointer
                    rightSection={loading ? <Loader size={14}/> : <Combobox.Chevron/>}
                    onClick={() => combobox.openDropdown()}
                    rightSectionPointerEvents='none'
                >
                    {selectedItem?.label || (
                        <Input.Placeholder>
                            {t('selectOrTypePlaceholder')}
                        </Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Search
                    value={search}
                    onChange={event => setSearch(event.currentTarget.value)}
                    onBlur={() => {
                        combobox.closeDropdown()
                        setSearch('')
                    }}
                    placeholder={t('selectOrTypePlaceholder')}
                />
                <Combobox.Options>
                    {options.length === 0 ? (
                        <Combobox.Empty>{t('nothingFound')}</Combobox.Empty>
                    ) : (
                        options
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}
