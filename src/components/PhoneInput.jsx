import React, { useEffect, useState } from 'react';
import { Box, Text, TextInput, useMantineTheme, Transition } from '@mantine/core';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Flag from 'react-world-flags';
import { ComboBoxComponent as ComboBox } from '@components/ComboBox';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import '@styles/Input.module.css'

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

export function GlobalPhoneInput({
    defaultValue = 'IN',
    label,
    placeholder,
    showError = true,
    onChange,
    onCountryChange,
    props,
}) {
    const theme = useMantineTheme();
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [isEmail, setIsEmail] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    // const emailSchema = z.string().email("Invalid email address");
    const emailSchema = z.string().min(3, { message: "Atleast 3 chars" });
    const phoneNumberSchema = z.string().refine(
        (value) => {
            const phoneNumber = parsePhoneNumberFromString(value);
            return phoneNumber?.isValid() || false;
        },
        { message: "Please enter a valid phone number" }
    );

    const inputValidationSchema = z.object({
        username: z.string().refine(
            (value) => {
                const trimmedValue = value.trim();
                const isPhoneNumber = /^\d|\+/.test(trimmedValue);
                if (!isPhoneNumber) {
                    return emailSchema.safeParse(trimmedValue).success;
                } else {
                    return phoneNumberSchema.safeParse(value).success;
                }
            },
            // { message: "Please enter a valid email address or phone number" }
            { message: "Please enter a valid username" }
        )
    })

    const form = useForm({
        initialValues: { username: '' },
        validateInputOnBlur: true,
        validateInputOnChange: true,
        validate: zodResolver(inputValidationSchema),
    });

    useEffect(() => {
        const _countries = countries.map((country) => ({
            ...country,
            key: `${country.id}`,
            icon: <Flag code={country.flag} style={{ height: '16px', width: '18px' }} />,
        }));
        const defaultCountry = _countries.find((country) => country.value === defaultValue);
        setSelectedCountry(defaultCountry);
        setCountryList(_countries);
    }, [defaultValue]);

    const handleInputChange = (e) => {
        const value = e.target.value.trim();
        setInputValue(value);
        let formattedValue = value;

        if (value) {
            const isEmailInput = /\D/.test(value);
            setIsEmail(isEmailInput);

            if (!isEmailInput) {
                const countryDialCode = selectedCountry.label;
                formattedValue = value.startsWith('+') ? value : `${countryDialCode}${value}`;
            } else {
                formattedValue = value;
            }
        } else {
            setIsEmail(true);
        }
        form.setFieldValue('username', formattedValue);
        form.validateField('username');
        onChange?.({ value: formattedValue, isValid: form.isValid() });
    };


    const handleOnFocus = () => setIsFocused(true);
    const handleOnBlur = () => {
        setIsFocused(false);
        form.validateField('username');
    };

    const handleCountryChange = (selected) => {
        setSelectedCountry(selected);
        const formattedValue = inputValue.trim();
        if (formattedValue) {
            const isPhoneNumber = /^\d|\+/.test(formattedValue);
            if (isPhoneNumber && !formattedValue.startsWith(selected.label)) {
                const updatedValue = formattedValue.replace(/^\+?/, '');
                setInputValue(updatedValue);
                form.setFieldValue('username', updatedValue);
                form.validateField('username');
            } else {
                form.setFieldValue('username', formattedValue);
                form.validateField('username');
            }
        }

        form.validateField('username');
        onCountryChange(selected);
    };

    return (
        <div className='phoneInput' style={{ width: '100%' }}>
            <Text component="label" htmlFor="phoneInput" size="sm" style={{ display: 'block', marginBottom: 4 }}>
                {label}
            </Text>
            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${form.errors.username
                        ? theme.colors.red[6]
                        : isFocused ? `var(--mantine-primary-color-filled)` : theme.colors.gray[4]
                        }`,
                    borderRadius: theme.radius.md,
                    padding: 0,
                    transition: 'border-color 0.2s ease',
                }}
            >
                <Transition
                    mounted={!isEmail}
                    transition="fade-right"
                    duration={100}
                >
                    {(styles) => (
                        <div
                            style={{
                                ...styles,
                                transform: `translateX(${!isEmail ? 0 : -30}px)`,
                                transition: 'transform 0.3s ease',
                                borderTopLeftRadius: theme.radius.md,
                                borderBottomLeftRadius: theme.radius.md
                            }}
                        >
                            <ComboBox
                                withinPortal={true}
                                minWidth={'320px'}
                                left={'18%'}
                                dataSource={countryList}
                                defaultValue={selectedCountry}
                                onValueChange={handleCountryChange}
                                styles={{
                                    dropdown: {
                                        zIndex: 9999,
                                        height: theme.spacing.md
                                    },
                                    input: {
                                        border: 'none',
                                        background: 'transparent',
                                        minWidth: 110,
                                        height: '42px',
                                        maxHeight: 200
                                    },
                                    root: {
                                        height: '42px',
                                        background: 'transparent'
                                    }
                                }}
                            />
                        </div>
                    )}
                </Transition>

                <TextInput
                    id="phoneInput"
                    {...props}
                    {...form.getInputProps('username')}
                    placeholder={placeholder}
                    size="md"
                    onChange={handleInputChange}
                    value={inputValue}
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                    maxLength={isEmail ? 50 : selectedCountry?.maxDigits || 15}
                    error={null}
                    styles={{
                        error: {
                            display: 'none'
                        },
                        input: {
                            border: 'none',
                            padding: '0 10px',
                            background: 'transparent',
                            height: 'auto',
                            width: '100%',
                            flex: '1',
                            fontSize: '0.8rem',
                            borderRadius: theme.radius.md
                        },
                        root: {
                            width: '100%',
                        },
                    }}
                />
            </Box>
            {form.errors.username && showError && (
                <Text size="xs" mt={2} style={{ color: theme.colors.red[6] }}>
                    {form.errors.username}
                </Text>
            )}
        </div>
    );
}
