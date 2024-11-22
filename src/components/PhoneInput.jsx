import { useState, useEffect } from 'react'
import { Box, TextInput, Text, useMantineTheme } from '@mantine/core'
import {
  parsePhoneNumberFromString,
  validatePhoneNumberLength
} from 'libphonenumber-js'
import Flag from 'react-world-flags'
import { ComboBoxComponent as ComboBox } from '@components/ComboBox'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'

const countries = [
  { id: 'US-1', label: '+1', value: 'US', flag: 'US', maxDigits: 10 },
  { id: 'CA-1', label: '+1', value: 'CA', flag: 'CA', maxDigits: 10 },
  { id: 'GB-44', label: '+44', value: 'GB', flag: 'GB', maxDigits: 10 },
  { id: 'IN-91', label: '+91', value: 'IN', flag: 'IN', maxDigits: 10 },
  { id: 'EG-20', label: '+20', value: 'EG', flag: 'EG', maxDigits: 10 },
  { id: 'AE-971', label: '+971', value: 'AE', flag: 'AE', maxDigits: 9 },
  { id: 'SA-966', label: '+966', value: 'SA', flag: 'SA', maxDigits: 9 },
  { id: 'KW-965', label: '+965', value: 'KW', flag: 'KW', maxDigits: 8 },
  { id: 'QA-974', label: '+974', value: 'QA', flag: 'QA', maxDigits: 8 },
  { id: 'BH-973', label: '+973', value: 'BH', flag: 'BH', maxDigits: 8 },
  { id: 'OM-968', label: '+968', value: 'OM', flag: 'OM', maxDigits: 8 },
  { id: 'LB-961', label: '+961', value: 'LB', flag: 'LB', maxDigits: 8 },
  { id: 'JO-962', label: '+962', value: 'JO', flag: 'JO', maxDigits: 9 },
  { id: 'PS-970', label: '+970', value: 'PS', flag: 'PS', maxDigits: 9 },
  { id: 'IQ-964', label: '+964', value: 'IQ', flag: 'IQ', maxDigits: 9 },
  { id: 'SD-249', label: '+249', value: 'SD', flag: 'SD', maxDigits: 9 },
  { id: 'LY-218', label: '+218', value: 'LY', flag: 'LY', maxDigits: 9 }
]

const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .max(15, { message: 'Phone number is too long' })
    .refine(
      value => {
        const phoneNumber = parsePhoneNumberFromString(value)
        return phoneNumber?.isValid() || false
      },
      {
        message: 'Please enter a valid phone number'
      }
    )
})

export function GlobalPhoneInput ({
  defaultValue = 'IN',
  label,
  placeholder,
  showError = true,
  onChange
}) {
  const theme = useMantineTheme()
  const [countryList, setCountryList] = useState([])
  const [selectedCountry, setSelectedCountry] = useState({})
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [maxLength, setMaxLength] = useState(10)
  const form = useForm({
    initialValues: { phoneNumber: '' },
    validate: zodResolver(phoneNumberSchema),
    validateOnChange: true,
    validateInputOnBlur: true
  })

  useEffect(() => {
    const _countries = countries.map(country => ({
      ...country,
      key: `${country.id}`,
      icon: (
        <Flag code={country.flag} style={{ height: '16px', width: '18px' }} />
      )
    }))

    const defaultCountry = _countries.find(
      country => country.value === defaultValue
    )
    setSelectedCountry(defaultCountry)
    setCountryList(_countries)
    setMaxLength(getMaxLengthForCountry(defaultCountry?.value))
  }, [])

  const getMaxLengthForCountry = countryCode => {
    const country = countries.find(country => country.value === countryCode)
    return country?.maxDigits || 15
  }

  const handlePhoneNumberChange = e => {
    const value = e.target.value
    setInputValue(value)

    const countryDialCode = selectedCountry.label
    const formattedValue = value.startsWith('+')
      ? value
      : `${countryDialCode}${value}`

    try {
      const phoneNumber = parsePhoneNumberFromString(
        formattedValue,
        selectedCountry.value
      )
      const isValidNumber = phoneNumber?.isValid() || false
      form.setFieldValue('phoneNumber', formattedValue)
      form.validate()
      onChange({ value, isValidNumber })
    } catch (error) {
      form.setFieldValue('phoneNumber', formattedValue)
      form.validate()
    }
  }

  const handleCountryChange = e => {
    setSelectedCountry(e)
    const countryDialCode = e.label
    const formattedValue = inputValue.startsWith('+')
      ? inputValue
      : `${countryDialCode}${inputValue}`

    setMaxLength(e.maxDigits)

    try {
      const phoneNumber = parsePhoneNumberFromString(formattedValue, e.value)
      form.setFieldValue('phoneNumber', formattedValue)
      form.validate()
    } catch (error) {
      form.setFieldValue('phoneNumber', formattedValue)
      form.validate()
    }
  }

  const handleBlur = () => setFocused(false)
  const handleFocus = () => setFocused(true)

  return (
    <div style={{ width: '100%' }}>
      <Text
        component='label'
        htmlFor='phoneInput'
        size='sm'
        style={{ display: 'block', marginBottom: 4 }}
      >
        {label}
      </Text>

      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          border: `1px solid ${
            form.errors.phoneNumber
              ? theme.colors.red[6]
              : focused
              ? theme.colors.blue[6]
              : theme.colors.gray[4]
          }`,
          borderRadius: theme.radius.md,
          padding: 0,
          transition: 'border-color 0.2s ease'
        }}
      >
        <ComboBox
          dataSource={countryList}
          defaultValue={selectedCountry}
          onValueChange={handleCountryChange}
          styles={{
            dropdown: { zIndex: 9999 },
            input: { border: 'none', minWidth: 110, maxHeight: 200 }
          }}
        />
        <TextInput
          id='phoneInput'
          placeholder={placeholder}
          size='md'
          onChange={handlePhoneNumberChange}
          value={inputValue}
          maxLength={maxLength}
          styles={{
            root: { flex: 1 },
            input: {
              border: 'none',
              padding: 0,
              background: 'transparent',
              height: 'auto',
              width: '100%',
              flex: '1'
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          error={form.errors.phoneNumber && showError} // Mantine's error handling
        />
      </Box>

      {form.errors.phoneNumber && showError && (
        <Text
          fz={theme.fontSizes.xs}
          mt={2}
          style={{ color: theme.colors.red[6] }}
        >
          {form.errors.phoneNumber}
        </Text>
      )}
    </div>
  )
}
