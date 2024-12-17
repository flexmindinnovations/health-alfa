import React, { useState, useEffect } from 'react';
import { TextInput, Button, Select, Group, Box, NumberInput, Stack, Grid, Textarea, CloseIcon, useMantineTheme, ScrollArea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Save, SquarePen } from 'lucide-react';
import { ImagePicker } from '@components/ImagePicker';
import { useTranslation } from 'react-i18next';
import { useApiConfig } from '@contexts/ApiConfigContext.jsx';
import useHttp from '@hooks/axios-instance';
import { openNotificationWithSound } from '@config/Notifications';

const bloodGroupTypes = [
    {
        "title": "A Positive",
        "value": "A+"
    },
    {
        "title": "A Negative",
        "value": "A-"
    },
    {
        "title": "B Positive",
        "value": "B+"
    },
    {
        "title": "B Negative",
        "value": "B-"
    },
    {
        "title": "AB Positive",
        "value": "AB+"
    },
    {
        "title": "AB Negative",
        "value": "AB-"
    },
    {
        "title": "O Positive",
        "value": "O+"
    },
    {
        "title": "O Negative",
        "value": "O-"
    }
];

const genderOptions = [
    { title: 'Male', value: 'Male' },
    { title: 'Female', value: 'Female' },
    { title: 'Other', value: 'Other' },
]

const schema = z.object({
    clientId: z.number().optional(),
    firstName: z.string().min(1, 'First Name is required'),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last Name is required'),
    emailId: z.string().email('Invalid email format'),
    mobileNo: z.string().min(1, 'Mobile Number is required'),
    bloodType: z.string().optional().refine((value) =>
        bloodGroupTypes.some((group) => group.value === value),
        { message: 'Invalid blood group type' }
    ),
    gender: z.string().optional().refine((value) =>
        genderOptions.some((group) => group.value === value),
        { message: 'Gender is required' }
    ),
    dateOfBirth: z.date().optional(),
    profileImagePath: z
        .any()
        .refine((file) => file instanceof File || typeof file === 'string', 'Invalid file type')
        .optional(),
});

export function AddEditClient({ data = {}, mode = 'add', handleCancel }) {
    const [profileImage, setProfileImage] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { i18n, t } = useTranslation();
    const { apiConfig } = useApiConfig();
    const http = useHttp();
    const theme = useMantineTheme();
    const [disableForm, setDisableForm] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            clientId: data.clientId || 0,
            firstName: data.firstName || '',
            middleName: data.middleName || '',
            lastName: data.lastName || '',
            emailId: data.emailId || '',
            mobileNo: data.mobileNo || '',
            bloodType: data.bloodType || '',
            gender: data.gender || '',
            height: data.height || '',
            clientAddress: data.clientAddress || '',
            emergencyContactNumber: data.emergencyContactNumber || '',
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            profileImagePath: data.profileImagePath || '',
        },
        enhanceGetInputProps: () => ({ disabled: disableForm }),
        validateInputOnBlur: true,
        validateInputOnChange: true,
        validate: zodResolver(schema),
    });

    const handleSubmit = (values) => {
        saveUpdateClient(values);
    };

    const saveUpdateClient = async (data) => {
        setLoading(true);
        setDisableForm(true);
        const apiCalls = [];
        const { clientId, ...rest } = data;
        if (typeof rest === 'object' && rest.hasOwnProperty('height')) {
            rest.height = rest.height.toString();
        }
        rest['profileImagePath'] = '';
        const saveUpdate = clientId > 0 ? http.put(apiConfig.clients.update(clientId), rest) : http.post(apiConfig.clients.save, rest);
        apiCalls.push(saveUpdate);
        if (profileImage) {
            const formData = new FormData();
            formData.append('file', profileImage);
            const updateProfileImage = http.post(apiConfig.clients.updateUserImage(clientId), formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        if (percentCompleted > 0 && percentCompleted < 100) {
                            setIsUploading(true);
                        } else {
                            setIsUploading(false);
                        }
                        setImageUploadProgress(percentCompleted);
                    }
                }
            );
            apiCalls.push(updateProfileImage);
        }
        try {
            const response = await Promise.allSettled(apiCalls);
            const saveUpdateResponse = response[0];

            if (saveUpdateResponse.status === 'fulfilled' && saveUpdateResponse.value?.status === 200) {
                const data = saveUpdateResponse.value.data;
                openNotificationWithSound({
                    title: t('updateSuccessfull'),
                    message: data.message,
                    color: theme.colors.brand[6]
                }, { withSound: false })
            } else if (saveUpdateResponse.status === 'rejected') {
                console.error('Save/Update failed:', saveUpdateResponse.reason);
            }

            const updateProfileImageResponse = response[1];
            if (updateProfileImageResponse?.status === 'fulfilled' && updateProfileImageResponse.value?.status === 200) {
                const data = updateProfileImageResponse.value.data;
                openNotificationWithSound({
                    title: t('profileImageUpdateSuccessfull'),
                    message: data.message,
                    color: theme.colors.brand[6]
                }, { withSound: false })
            } else if (updateProfileImageResponse?.status === 'rejected') {
                console.error('Profile image update failed:', updateProfileImageResponse.reason);
            }

        } catch (error) {
            const { name, message } = error;
            openNotificationWithSound({
                title: name,
                message: message,
                color: theme.colors.red[6]
            }, { withSound: false })
        } finally {
            setLoading(false);
            setDisableForm(false);
            handleCancel({ refresh: true });
        }
    }

    const uploadUserImage = async (file) => {
        setImageUploadProgress(0);
        const { clientId, ...rest } = form.values;
        const formData = new FormData();
        formData.append('file', file);
        const response = await http.post(apiConfig.clients.updateUserImage(clientId), formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    if (percentCompleted > 0 && percentCompleted < 100) {
                        setIsUploading(true);
                    } else {
                        setIsUploading(false);
                    }
                    setImageUploadProgress(percentCompleted);
                }
            }
        );
        const data = response.data;
        openNotificationWithSound({
            title: t('profileImageUpdateSuccessfull'),
            message: data.message,
            color: theme.colors.brand[6]
        }, { withSound: false })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
        >
            <Box sx={{ maxWidth: 900, margin: '0 auto' }}>
                <motion.form onSubmit={form.onSubmit(handleSubmit)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Stack>
                        <ScrollArea scrollbars={'y'}
                            styles={{
                                root: {
                                    padding: isSmallScreen ? '0' : '0 20px'
                                }
                            }}
                        >
                            <Stack className="flex-1 max-h-[30rem] mx-auto">
                                <Grid gutter="md">
                                    <Grid.Col span={{ base: 12, md: 4, lg: 4 }} className='flex items-center justify-center'>
                                        <ImagePicker
                                            disableForm={disableForm}
                                            value={form.values.profileImagePath}
                                            uploadProgress={imageUploadProgress}
                                            isUploading={isUploading}
                                            onChange={(file) => setProfileImage(file)}
                                        // onChange={(file) => uploadUserImage(file)}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                                        <Grid gutter="md">
                                            <Grid.Col span={6}>
                                                <TextInput label="First Name" placeholder="Enter first name" {...form.getInputProps('firstName')} />
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <TextInput label="Middle Name" placeholder="Enter middle name" {...form.getInputProps('middleName')} />
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <TextInput label="Last Name" placeholder="Enter last name" {...form.getInputProps('lastName')} />
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <TextInput label="Mobile Number" placeholder="Enter mobile number" {...form.getInputProps('mobileNo')} />
                                            </Grid.Col>
                                        </Grid>
                                    </Grid.Col>
                                </Grid>

                                <Grid mt={5} gutter="md">
                                    <Grid.Col span={6}>
                                        <TextInput label="Email ID" placeholder="Enter email" {...form.getInputProps('emailId')} />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Select
                                            label="Gender"
                                            placeholder="Select gender"
                                            checkIconPosition='right'
                                            data={genderOptions}
                                            searchable
                                            clearable
                                            {...form.getInputProps('gender')}
                                        />
                                    </Grid.Col>

                                </Grid>
                                <Grid gutter="md">
                                    <Grid.Col span={6}>
                                        <DateInput label="Date of Birth" placeholder="Select date" {...form.getInputProps('dateOfBirth')} />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <NumberInput label="Height"
                                            hideControls
                                            placeholder="Enter height"
                                            {...form.getInputProps('height')}
                                        />
                                    </Grid.Col>
                                </Grid>
                                <Grid gutter="md">
                                    <Grid.Col span={6}>
                                        <Select
                                            label="Blood Group"
                                            placeholder="Select blood group"
                                            data={bloodGroupTypes}
                                            title='title'
                                            checkIconPosition='right'
                                            searchable
                                            clearable
                                            {...form.getInputProps('bloodType')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput label="Emergency Contact" placeholder="Enter emergency contact" {...form.getInputProps('emergencyContactNumber')} />
                                    </Grid.Col>
                                </Grid>

                                {/* Address */}
                                <Grid mt="md">
                                    <Grid.Col span={12}>
                                        <Textarea rows={3} label="Address"
                                            radius={'lg'}
                                            styles={{
                                                label: {
                                                    fontWeight: 'normal',
                                                    fontSize: '14px'
                                                },
                                                input: {
                                                    paddingLeft: '10px'
                                                }
                                            }}
                                            placeholder="Enter address" {...form.getInputProps('clientAddress')} />
                                    </Grid.Col>
                                </Grid>
                            </Stack>
                        </ScrollArea>
                        {/* Buttons */}
                        <Group position="right" justify='flex-end' px={isSmallScreen ? 0 : 20}>
                            <Button variant="outline"
                                leftSection={<CloseIcon size={16} />}
                                onClick={() => handleCancel({ refresh: false })}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                leftSection={
                                    mode === 'add' ? <Save size={16} /> : <SquarePen size={16} />
                                }
                                loading={loading}
                                disabled={loading || !form.isValid()}>
                                {mode === 'add' ? t('save') : t('update')}
                            </Button>
                        </Group>
                    </Stack>

                </motion.form>
            </Box>
        </motion.div>
    );
}
