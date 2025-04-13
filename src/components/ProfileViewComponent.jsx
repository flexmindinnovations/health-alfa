import { Center, Grid, Group, Stack, Text, Title, useMantineTheme } from "@mantine/core";
import { ImagePicker } from "@components/ImagePicker.jsx";
import { useEncrypt } from "@hooks/EncryptData.jsx";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

export function ProfileView({ data = {} }) {
    const { getEncryptedData } = useEncrypt();
    const [imagePath, setImagePath] = useState('');
    const [userType, setUserType] = useState('admin');
    const theme = useMantineTheme();

    useEffect(() => {
        setImagePath(getProfileImagePath());
    }, []);

    const getProfileImagePath = () => {
        const userType = getEncryptedData('roles').toLowerCase();
        setUserType(userType);
        let path = '';
        switch (userType) {
            case 'admin':
                path = 'admin';
                break;
            case 'client':
            case 'user':
                path = data['profileImagePath'];
                break;
            case 'doctor':
                path = data['doctorProfileImagePath'];
                break;
        }
        return path;
    }

    const excludeProperties = (obj, excludedKeys) => {
        return Object.keys(obj)
            .filter(key => !excludedKeys.includes(key))
            .reduce((acc, key) => {
                acc[key] = obj[key];
                return acc;
            }, {});
    }

    const excludedKeys = ['doctorProfileImagePath', 'doctorId', 'registrationDate', 'profileImagePath', 'clientId'];
    const filteredData = excludeProperties(data, excludedKeys);

    const formatKey = (key) => {
        const updateKey = getUpdatedKey(key);
        return updateKey.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
    }

    const getUpdatedKey = (key) => {
        let newKey = key;
        switch (key) {
            case 'emailId':
                newKey = 'email';
                break;
            case 'mobileNo':
                newKey = 'contactNumber';
                break;
            case 'registerDate':
                newKey = 'registrationDate';
                break;
        }
        return newKey;
    }

    const formatMobileNumber = (number) => {
        const cleanedNumber = number.replace(/\D/g, '');
        if (cleanedNumber.startsWith('91') && cleanedNumber.length === 12) {
            return `+91-${cleanedNumber.slice(2)}`;
        }
        return number;
    };

    const stringFormatting = (inputString) => {
        if (!inputString) return '';
        inputString = inputString?.toString()?.trim();
        if (inputString.includes(',')) {
            const inputStringArray = inputString.split(',').map(input => input.trim());
            if (inputStringArray.length > 1) {
                const lastString = inputStringArray.pop();
                return `${inputStringArray.join(', ')} and ${lastString}`;
            }
        }
        return inputString;
    };

    const formatData = (key, value) => {
        const dateFields = ['dateOfBirth', 'registerDate'];
        const numberFields = ['mobileNo'];
        const isDateField = dateFields.includes(key);
        const isNumberField = numberFields.includes(key);
        const date = dayjs(value);
        return isDateField
            ? date.format('DD-MM-YYYY')
            : value ? isNumberField ? formatMobileNumber(value) : stringFormatting(value) : 'NA';
    }

    return (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className='h-full overflow-y-auto max-h-96'>
            <Stack gap={0} p={20}>
                <Group>
                    <Center styles={{
                        root: {
                            width: '100%',
                        }
                    }}>
                        <ImagePicker value={imagePath} disableForm={true} />
                    </Center>
                </Group>
                <Group my={'md'}>
                    <Title size="h5" style={{ fontWeight: '400' }}>
                        {userType.charAt(0).toUpperCase() + userType.slice(1)} Details
                    </Title>
                </Group>
                <Grid>
                    {Object.entries(filteredData).map(([key, value]) => {
                        return (
                            <Grid.Col p={5} key={key} span={12}
                            >
                                <Grid style={{
                                    borderBottom: `1px solid ${theme.colors.gray[1]}`,
                                    paddingBottom: '4px'
                                }}>
                                    <Grid.Col span={6}>
                                        <Text size="xs" c={theme.colors.gray[7]}>
                                            {formatKey(key)}
                                        </Text>
                                    </Grid.Col>
                                    <Grid.Col key={key} span={6}>
                                        <Text size="xs" c={theme.colors.black}>
                                            {formatData(key, value)}
                                        </Text>
                                    </Grid.Col>
                                </Grid>
                            </Grid.Col>
                        );
                    })}
                </Grid>
            </Stack>
        </motion.div>
    )
}
