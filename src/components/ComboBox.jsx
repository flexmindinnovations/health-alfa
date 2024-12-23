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
                                      props,
                                      styles,
                                      withinPortal = false,
                                      left,
                                      isPhoneInput = false,
                                      minWidth,
                                      labelProps
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

    const getSelectedItem = val => dataSource.find(_item => _item.value === val)

    useEffect(() => {
        const _selectedItem = getSelectedItem(defaultValue.value ?? defaultValue)
        if (_selectedItem) {
            setSelectedItem(_selectedItem)
            setValue(_selectedItem.value)
        }
    }, [defaultValue])

    const shouldFilterOptions = !dataSource.some(
        item => item.label === (search || defaultValue)
    )
    const filteredOptions = shouldFilterOptions
        ? dataSource?.filter(item => {
            return item.value.toLowerCase().includes(search.toLowerCase().trim())
        })
        : dataSource

    const getLabel = item => {
        if (item) {
            return (
                <div className='flex items-center justify-start gap-2'>
                    {item.icon && typeof item.icon === 'string'
                        ? createElement(item.icon, {size: 14})
                        : item.icon}
                    <span style={{...labelProps}}> {item.label}</span>
                </div>
            )
        } else {
            return ''
        }
    }

    const options = filteredOptions.map((item, index) => (
        <Combobox.Option
            value={item.value}
            key={item.value}
            className={cx({[classes.animateOption]: animating})}
            style={{animationDelay: `${index * 50}ms`, width: '100%'}}
        >
            <Group flex justify='space-between' className='min-w-10'>
                <div className='flex items-center justify-start gap-2'>
                    {getLabel(item)}
                    {isPhoneInput && item.value}
                </div>
                {item.value === value && <CheckIcon opacity={'0.4'} size={12}/>}
            </Group>
        </Combobox.Option>
    ))

    return (
        <Combobox
            {...props}
            store={combobox}
            withinPortal={withinPortal}
            onOptionSubmit={val => {
                const _selectedItem = getSelectedItem(val)
                if (_selectedItem) setSelectedItem(_selectedItem)
                onValueChange(_selectedItem)
                setValue(val)
                setSearch('')
                combobox.closeDropdown()
            }}
            styles={{
                dropdown: {
                    zIndex: 9999,
                    // position: 'fixed',
                    left: left,
                    minWidth: minWidth,
                    maxHeight: 200,
                    flex: 1,
                    width: '100%'
                },
                input: {
                    flex: 1,
                    width: '100%',
                    height: '100%'
                }
            }}
        >
            <Combobox.Target>
                <InputBase
                    component='button'
                    type='button'
                    pointer
                    className='!border-none'
                    rightSection={loading ? <Loader size={14}/> : <Combobox.Chevron/>}
                    onClick={() => combobox.openDropdown()}
                    rightSectionPointerEvents='none'
                    styles={{...styles}}
                >
                    {getLabel(selectedItem) || (
                        <Input.Placeholder>
                            {t('selectOrTypePlaceholder')}
                        </Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown className='overflow-auto'>
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
