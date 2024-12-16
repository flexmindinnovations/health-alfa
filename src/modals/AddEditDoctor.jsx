import { useState, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Button, Group, Box, Select, Grid, Textarea, CloseIcon, useMantineTheme, MultiSelect } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { SquarePen, Save } from 'lucide-react';
import { ImagePicker } from '@components/ImagePicker';
import { useApiConfig } from '@contexts/ApiConfigContext';
import useHttp from '@hooks/axios-instance';
import { openNotificationWithSound } from '@config/Notifications';
import { useTranslation } from 'react-i18next';
import degreeMaster from '../assets/data/degree-master.json';

const genderOptions = [
    { title: 'Male', value: 'Male' },
    { title: 'Female', value: 'Female' },
    { title: 'Other', value: 'Other' },
]

const mappedDegrees = degreeMaster.map((each) => ({
    value: each.degree,
    label: each.degree,
}));

const normalizeField = (field) => {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string' && field.includes(',')) {
        return field.split(',').map(item => item.trim());
    }
    if (typeof field === 'string') {
        return [field];
    }
    return [];
};

const doctorSchema = z.object({
    doctorId: z.number().optional(),
    doctorName: z.string().min(1, { message: 'Doctor name is required' }),
    // mobileNo: z.string()
    //     .optional()
    //     .refine((value) => !value || /^\d{10}$/.test(value), { message: 'Invalid mobile number' }),
    mobileNo: z.string()
        .optional(),
    dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
    gender: z.string().optional().refine((value) =>
        genderOptions.some((group) => group.value === value),
        { message: 'Gender is required' }
    ),
    qualification: z.array(z.string()).nonempty({ message: 'At least one qualification is required' }),
    speciality: z.array(z.string()).optional(),
    medicalRegistrationNumber: z.string().optional(),
    medicalCouncil: z.string().optional(),
    registerDate: z.date({ required_error: 'Registration date is required' }),
    emailId: z.string().optional(),
    doctorAddress: z.string().optional(),
    doctorProfileImagePath: z
        .any()
        .refine((file) => file instanceof File || typeof file === 'string', 'Invalid file type')
        .optional()
});

export function AddEditDoctor({ data = {}, mode = 'add', handleCancel }) {
    const [profileImage, setProfileImage] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { i18n, t } = useTranslation();
    const { apiConfig } = useApiConfig();
    const http = useHttp();
    const theme = useMantineTheme();
    const [disableForm, setDisableForm] = useState(false);
    const [selectedDegrees, setSelectedDegrees] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);
    const form = useForm({
        initialValues: {
            doctorId: data?.doctorId || 0,
            doctorName: data?.doctorName || '',
            doctorAddress: data?.doctorAddress || '',
            mobileNo: data?.mobileNo || '',
            dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth) : new Date(),
            gender: data?.gender || '',
            qualification: normalizeField(data?.qualification),
            speciality: normalizeField(data?.speciality),
            medicalRegistrationNumber: data?.medicalRegistrationNumber || '',
            medicalCouncil: data?.medicalCouncil || '',
            registerDate: data?.registerDate ? new Date(data.registerDate) : new Date(),
            emailId: data?.emailId || '',
            doctorProfileImagePath: data?.doctorProfileImagePath || '',
        },
        enhanceGetInputProps: () => ({ disabled: disableForm }),
        validateInputOnBlur: true,
        validateInputOnChange: true,
        validate: zodResolver(doctorSchema),
    });

    useEffect(() => {
        const { values } = form;
        if (values.qualification && values.qualification.length > 0) {
            handleDegreeChange(values.qualification);
        }
    }, [form.values.qualification])

    const handleDegreeChange = (selected) => {
        setSelectedDegrees(selected);

        const specialties = degreeMaster
            .filter((each) => selected.includes(each.degree))
            .flatMap((each) => each.specialities)
            .filter((value, index, self) => self.indexOf(value) === index);
        setSpecialtyOptions(
            specialties.map((specialty) => ({ value: specialty, label: specialty })));
    }

    const handleSubmit = (values) => {
        saveUpdateDoctor(values);
    };

    const saveUpdateDoctor = async (data) => {
        setLoading(true);
        setDisableForm(true);
        const apiCalls = [];
        const { doctorId, ...rest } = data;
        const payload = {
            ...rest,
            qualification: rest.qualification.join(','),
            speciality: rest.speciality.join(','),
            doctorProfileImagePath: ''
        }
        const saveUpdate = doctorId > 0 ? http.put(apiConfig.doctors.update(doctorId), payload) : http.post(apiConfig.doctors.save, payload);
        apiCalls.push(saveUpdate);
        if (profileImage) {
            const formData = new FormData();
            formData.append('file', profileImage);
            const updateProfileImage = http.post(apiConfig.doctors.updateDoctorImage(doctorId), formData,
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
        >
            <Box sx={{ maxWidth: 900, margin: '0 auto' }}>
                <motion.form onSubmit={form.onSubmit(handleSubmit)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Grid gutter="md">
                        <Grid.Col span={4} className='flex items-center justify-center'>
                            <ImagePicker
                                disableForm={disableForm}
                                value={form.values.doctorProfileImagePath}
                                uploadProgress={imageUploadProgress}
                                isUploading={isUploading}
                                onChange={(file) => setProfileImage(file)}
                            // onChange={(file) => uploadUserImage(file)}
                            />
                        </Grid.Col>
                        <Grid.Col span={8}>
                            <Grid gutter="md">
                                <Grid.Col span={6}>
                                    <TextInput label="Doctor Name" placeholder="Enter doctor name" {...form.getInputProps('doctorName')} />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <TextInput label="Mobile Number"
                                        placeholder="Enter mobile number" {...form.getInputProps('mobileNo')}
                                        disabled={true}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <DateInput label="Date of Birth" placeholder="Select date" {...form.getInputProps('dateOfBirth')} />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Select
                                        label="Gender"
                                        searchable
                                        placeholder="Select gender"
                                        data={['Male', 'Female', 'Other']}
                                        {...form.getInputProps('gender')}
                                    />
                                </Grid.Col>
                            </Grid>
                        </Grid.Col>
                    </Grid>

                    <Grid mt={5} gutter="md">
                        <Grid.Col span={6}>
                            <MultiSelect
                                label="Qualification"
                                placeholder="Select degree(s)"
                                data={mappedDegrees}
                                value={selectedDegrees}
                                onChange={handleDegreeChange}
                                {...form.getInputProps('qualification')}
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <MultiSelect
                                label="Speciality"
                                placeholder="Select specialty"
                                data={specialtyOptions}
                                // maxValues={5}
                                {...form.getInputProps('speciality')}
                            />
                        </Grid.Col>
                    </Grid>

                    <Grid gutter="md">
                        <Grid.Col span={6}>
                            <TextInput label="Medical Registration Number" placeholder="Enter registration number" {...form.getInputProps('medicalRegistrationNumber')} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput label="Medical Council" placeholder="Enter medical council" {...form.getInputProps('medicalCouncil')} />
                        </Grid.Col>
                    </Grid>

                    <Grid gutter="md">
                        <Grid.Col span={6}>
                            <DateInput label="Register Date" placeholder="Pick date" {...form.getInputProps('registerDate')} />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput label="Email ID" placeholder="Enter email address" {...form.getInputProps('emailId')} />
                        </Grid.Col>
                    </Grid>

                    <Grid mt="md">
                        <Grid.Col span={12}>
                            <Textarea
                                rows={3}
                                label="Address"
                                placeholder="Enter address"
                                {...form.getInputProps('doctorAddress')}
                            />
                        </Grid.Col>
                    </Grid>

                    <Group position="right" justify='flex-end' mt="xl">
                        <Button
                            disabled={disableForm}
                            leftSection={<CloseIcon size={16} />}
                            variant="outline"
                            onClick={() => handleCancel({ refresh: false })}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={loading}
                            className='min-w-24'
                            leftSection={
                                mode === 'add' ? <Save size={16} /> : <SquarePen size={16} />
                            }
                        >
                            {mode === 'add' ? 'Save' : 'Update'}
                        </Button>
                    </Group>
                </motion.form>
            </Box>
        </motion.div>
    );
};
